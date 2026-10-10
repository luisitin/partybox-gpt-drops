// Post-exchange verification controller. The primary generator is unchanged.
#define main primarySealedGeneratorEntry
#include "generator.cpp"
#undef main
#include "independent/native-adapter/native-reference.hpp"
#include <unordered_set>
#include <sstream>
#include <cerrno>
#include <unistd.h>

NativeScore primaryWrite(const Lattice&l,const std::array<int,6>&count,int category,NativeCard card){
 const auto&hand=l.hands[FULL_FIRST+l.rollId(count)];const int open=ALL^card.usedMask;int legal=open;
 const bool extra=hand.face>=0&&(card.usedMask&Y);
 if(extra&&!card.published){if(open&(1<<hand.face))legal=1<<hand.face;else if(open&~63)legal=open&~63;}
 if(!(legal&(1<<category)))return {false,0,0,0,card};
 int points=rawScore(hand,category);
 if(extra&&(card.usedMask&(1<<hand.face))){if(category==8)points=25;else if(category==9)points=30;else if(category==10)points=40;}
 auto next=card;next.usedMask|=1<<category;
 if(category<6)next.upper=std::min(63,card.upper+points);
 next.yahtzeeBonus=card.yahtzeeBonus||(category==11&&points==50);
 return {true,points,card.yahtzeeBonus&&hand.face>=0?100:0,category<6&&card.upper<63&&card.upper+points>=63?35:0,next};
}
void sameScore(const NativeScore&a,const NativeScore&b){
 if(a.legal!=b.legal||a.points!=b.points||a.yahtzeeBonus!=b.yahtzeeBonus||a.upperBonus!=b.upperBonus
 ||a.next.usedMask!=b.next.usedMask||a.next.upper!=b.next.upper||a.next.yahtzeeBonus!=b.next.yahtzeeBonus||a.next.published!=b.next.published)
 throw std::runtime_error("Paired scorer/transition discrepancy");
}
void u16(std::ostream&out,int value){if(value<0||value>65535)throw std::runtime_error("u16 code");out.put(static_cast<char>(value&255));out.put(static_cast<char>((value>>8)&255));}
void u32(std::ostream&out,std::uint32_t value){for(int n=0;n<4;n++)out.put(static_cast<char>((value>>(8*n))&255));}
void f64(std::ostream&out,double value){if(!std::isfinite(value))throw std::runtime_error("Nonfinite observation");out.write(reinterpret_cast<const char*>(&value),8);}
int main(int argc,char**argv){try{
 if(argc!=8)throw std::runtime_error("usage: paired-sim official|published seed games report.json visited.bin regenerated.bin observations-fd-path");
 const std::string mode=argv[1];if(mode!="official"&&mode!="published")throw std::runtime_error("Invalid mode");
 const bool published=mode=="published";const auto seed=static_cast<std::uint32_t>(std::stoul(argv[2]));const auto games=std::stoull(argv[3]);
 if(seed<1||seed>3||games<2)throw std::runtime_error("Invalid full simulation arguments");
 Lattice l;auto solution=solve(l,published,true);binary(argv[6],solution.table);
 NativeReference reference("independent/official.bin","independent/published.bin");
 for(int r=0;r<252;r++)if(l.hands[210+r].count!=reference.fullRollCounts(r))throw std::runtime_error("Independent full-hand order mismatch");
 RNG rng(seed^(published?0x9e3779b9U:0x6d2b79f5U));std::unordered_set<std::uint32_t>visited;
 std::uint64_t diceDraws=0,holdComparisons=0,categoryComparisons=0,scoreComparisons=0,alternateHolds=0,alternateCategories=0;
 long double sum=0,squares=0;double maximumDecisionGap=0;int minimum=10000,maximum=0;
 for(std::uint64_t game=0;game<games;game++){
  NativeCard card{0,0,false,published};int total=0,independentTotal=0;
  for(int turn=0;turn<13;turn++){
   const int at=canonicalIndex(l,card.usedMask,card.upper,card.yahtzeeBonus);visited.insert(static_cast<std::uint32_t>(at)+(published?1048576U:0U));
   const auto&policy=solution.policy[at];const auto&other=reference.turn(card);
   std::array<int,6>count{};for(int die=0;die<5;die++){count[rng.die()]++;diceDraws++;}
   for(int remaining=2;remaining>0;remaining--){
    const int r=l.rollId(count),choice=remaining==2?policy.h2[r]:policy.h1[r];
    if(choice<0||choice>=462)throw std::runtime_error("Invalid native policy hold");
    const auto&held=l.hands[choice];for(int face=0;face<6;face++)if(held.count[face]>count[face])throw std::runtime_error("Native hold not subset");
    const double actual=reference.heldValue(card,held.code,remaining),optimum=remaining==2?other.two[r]:other.one[r],gap=std::abs(actual-optimum);
    if(gap>1e-10)throw std::runtime_error("Paired optimal-hold discrepancy");
    maximumDecisionGap=std::max(maximumDecisionGap,gap);holdComparisons++;
    if(held.code!=(remaining==2?other.holdTwoCodes[r]:other.holdOneCodes[r]))alternateHolds++;
    count=held.count;for(int die=held.length;die<5;die++){count[rng.die()]++;diceDraws++;}
   }
   const int r=l.rollId(count),category=policy.category[r];
   const auto actual=primaryWrite(l,count,category,card),otherScore=reference.score(count,category,card);sameScore(actual,otherScore);scoreComparisons++;
   if(!actual.legal)throw std::runtime_error("Illegal primary write");
   const double objective=otherScore.points+otherScore.yahtzeeBonus+otherScore.upperBonus+reference.expectedValue(otherScore.next);
   const double gap=std::abs(objective-other.zero[r]);if(gap>1e-10)throw std::runtime_error("Paired optimal-category discrepancy");maximumDecisionGap=std::max(maximumDecisionGap,gap);categoryComparisons++;
   if(category!=other.category[r])alternateCategories++;
   total+=actual.points+actual.yahtzeeBonus+actual.upperBonus;independentTotal+=otherScore.points+otherScore.yahtzeeBonus+otherScore.upperBonus;
   card=actual.next;
  }
  if(card.usedMask!=8191||total!=independentTotal)throw std::runtime_error("Paired full-game discrepancy");
  sum+=total;squares+=static_cast<long double>(total)*total;minimum=std::min(minimum,total);maximum=std::max(maximum,total);
  if((game+1)%100000==0)std::cout<<"paired "<<mode<<" seed "<<seed<<" games "<<game+1<<std::endl;
 }
 const double mean=static_cast<double>(sum/games),variance=static_cast<double>((squares-sum*sum/games)/(games-1)),se=std::sqrt(variance/games),ev=solution.table[0],sigma=std::abs(mean-ev)/se;
 if(sigma>4)throw std::runtime_error("Paired simulation four-SE gate");
 std::vector<std::uint32_t>keys(visited.begin(),visited.end());std::sort(keys.begin(),keys.end());
 std::ofstream indexOut(argv[5],std::ios::binary);for(const auto key:keys)u32(indexOut,key);if(!indexOut)throw std::runtime_error("Visited-key write");
 const std::string destination=argv[7];const int descriptor=std::stoi(destination.substr(destination.find_last_of('/')+1));
 std::ostringstream observations(std::ios::binary|std::ios::out);
 for(const auto key:keys){const auto raw=key&1048575U;const auto&policy=solution.policy[raw];NativeCard card{static_cast<int>(raw&8191U),static_cast<int>((raw>>13)&63U),(raw&524288U)!=0,published};const auto&other=reference.turn(card);
  observations.str("");observations.clear();
  u32(observations,key);
  for(int r=0;r<252;r++)observations.put(static_cast<char>(policy.category[r]));
  for(int r=0;r<252;r++)u16(observations,l.hands[policy.h1[r]].code);
  for(int r=0;r<252;r++)u16(observations,l.hands[policy.h2[r]].code);
  for(int r=0;r<252;r++)observations.put(static_cast<char>(other.category[r]));
  for(const auto code:other.holdOneCodes)u16(observations,code);
  for(const auto code:other.holdTwoCodes)u16(observations,code);
  for(const auto value:other.zero)f64(observations,value);
  for(const auto value:other.one)f64(observations,value);
  for(const auto value:other.two)f64(observations,value);
  const auto bytes=observations.str();if(bytes.size()!=8572)throw std::runtime_error("Observation record size");
  std::size_t sent=0;while(sent<bytes.size()){const auto wrote=::write(descriptor,bytes.data()+sent,bytes.size()-sent);if(wrote<0&&errno==EINTR)continue;if(wrote<=0)throw std::runtime_error("Observation stream write failure");sent+=static_cast<std::size_t>(wrote);}
 }
 std::ofstream report(argv[4]);report<<std::setprecision(17)<<"{\"passed\":true,\"mode\":\""<<mode<<"\",\"seed\":"<<seed<<",\"games\":"<<games<<",\"pairedResults\":"<<games<<",\"holdComparisons\":"<<holdComparisons<<",\"categoryComparisons\":"<<categoryComparisons<<",\"scoreTransitionComparisons\":"<<scoreComparisons<<",\"decisionComparisons\":"<<holdComparisons+categoryComparisons<<",\"individualDiceDraws\":"<<diceDraws<<",\"distinctVisitedComponents\":"<<keys.size()<<",\"referenceComputedComponents\":"<<reference.computedComponents()<<",\"observationRecordBytes\":8572,\"maximumDecisionGap\":"<<maximumDecisionGap<<",\"decisionTolerance\":1e-10,\"alternateHolds\":"<<alternateHolds<<",\"alternateCategories\":"<<alternateCategories<<",\"expectedValue\":"<<ev<<",\"independentExpectedValue\":"<<reference.expectedValue({0,0,false,published})<<",\"mean\":"<<mean<<",\"sampleVariance\":"<<variance<<",\"standardError\":"<<se<<",\"sigma\":"<<sigma<<",\"minimum\":"<<minimum<<",\"maximum\":"<<maximum<<"}\n";
 if(!report)throw std::runtime_error("Paired report write failure");
 return 0;
 }catch(const std::exception&e){std::cerr<<"ERROR: "<<e.what()<<std::endl;return 1;}}
