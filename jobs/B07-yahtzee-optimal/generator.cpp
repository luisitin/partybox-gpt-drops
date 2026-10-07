// Independently authored finite Yahtzee DP. Rules/representation: PUBLIC-CONTRACT.md.
#include <algorithm>
#include <array>
#include <bit>
#include <cmath>
#include <cstdint>
#include <fstream>
#include <iomanip>
#include <iostream>
#include <limits>
#include <memory>
#include <stdexcept>
#include <string>
#include <vector>

constexpr int ALL=8191, Y=1<<11, SIZE=1<<20, FULL_FIRST=210, FULL_COUNT=252, HANDS=462;
static_assert(std::endian::native==std::endian::little,"Table encoding requires little endian");
struct Hand {std::array<int,6> count{};std::vector<int> dice;int length=0,code=0,face=-1;};
struct Lattice {
 std::vector<Hand> hands;std::array<int,46656> id{};std::array<int,HANDS> rank{};
 std::array<std::array<int,6>,HANDS> plus{},minus{};
 std::array<std::array<bool,64>,64> reachable{};std::array<int,64> remaining{};
 Lattice(){
  id.fill(-1);
  const auto enumerate=[&](auto&&self,int target,int minimum,Hand h)->void{
   if(h.length==target){int scale=1;for(int f=0;f<6;f++){h.code+=h.count[f]*scale;scale*=6;if(h.count[f]==5)h.face=f;}
    id[h.code]=static_cast<int>(hands.size());hands.push_back(h);return;}
   for(int f=minimum;f<6;f++){Hand next=h;next.count[f]++;next.length++;next.dice.push_back(f+1);self(self,target,f,next);}
  };
  for(int n=0;n<=5;n++)enumerate(enumerate,n,0,Hand{});
  if(hands.size()!=HANDS||hands[FULL_FIRST].length!=5)throw std::runtime_error("Hand inventory");
  std::vector<int> sorted;for(int i=0;i<HANDS;i++)sorted.push_back(i);
  std::sort(sorted.begin(),sorted.end(),[&](int a,int b){return hands[a].dice<hands[b].dice;});
  for(int i=0;i<HANDS;i++)rank[sorted[i]]=i;
  for(int i=0;i<HANDS;i++){plus[i].fill(-1);minus[i].fill(-1);int scale=1;
   for(int f=0;f<6;f++){if(hands[i].length<5)plus[i][f]=id[hands[i].code+scale];if(hands[i].count[f]>0)minus[i][f]=id[hands[i].code-scale];scale*=6;}}
  for(int mask=0;mask<64;mask++){
   std::array<bool,64>s{};s[0]=true;
   for(int f=0;f<6;f++){if(mask&(1<<f)){std::array<bool,64>next{};
     for(int u=0;u<64;u++)if(s[u])for(int c=0;c<=5;c++)next[std::min(63,u+c*(f+1))]=true;
     s=next;
    }else remaining[mask]+=5*(f+1);}
   reachable[mask]=s;
  }
 }
 int rollId(const std::array<int,6>&count)const{int code=0,scale=1;for(int f=0;f<6;f++){code+=count[f]*scale;scale*=6;}return id[code]-FULL_FIRST;}
};
struct Policy {std::array<std::uint16_t,FULL_COUNT> h1{},h2{};std::array<std::uint8_t,FULL_COUNT> category{};};
struct Option {int category,points;};
using Menu=std::array<std::vector<Option>,FULL_COUNT>;
int rawScore(const Hand&h,int category){
 if(category<6)return h.count[category]*(category+1);
 int sum=0,maximum=0,bits=0;bool pair=false,triple=false;
 for(int f=0;f<6;f++){sum+=(f+1)*h.count[f];maximum=std::max(maximum,h.count[f]);if(h.count[f])bits|=1<<f;pair|=h.count[f]==2;triple|=h.count[f]==3;}
 switch(category){case 6:return maximum>=3?sum:0;case 7:return maximum>=4?sum:0;case 8:return pair&&triple?25:0;
 case 9:return (bits&15)==15||(bits&30)==30||(bits&60)==60?30:0;
 case 10:return bits==31||bits==62?40:0;case 11:return maximum==5?50:0;case 12:return sum;}
 throw std::runtime_error("Category");
}
Menu menuFor(const Lattice&l,int mask,bool published){
 Menu menu;
 for(int r=0;r<FULL_COUNT;r++){const auto&h=l.hands[FULL_FIRST+r];const int open=ALL^mask;
  const bool extra=h.face>=0&&(mask&Y);int legal=open;
  if(extra&&!published){if(open&(1<<h.face))legal=1<<h.face;else if(open&~63)legal=open&~63;}
  const bool joker=extra&&(mask&(1<<h.face));
  for(int c=0;c<13;c++)if(legal&(1<<c)){int points=rawScore(h,c);
   if(joker){if(c==8)points=25;else if(c==9)points=30;else if(c==10)points=40;}
   menu[r].push_back({c,points});}
 }
 return menu;
}
int stateIndex(int mask,int upper,bool bonus){return mask+(upper<<13)+(bonus?(1<<19):0);}
int canonicalIndex(const Lattice&l,int mask,int upper,bool bonus){
 return stateIndex(mask,upper+l.remaining[mask&63]<63?0:upper,bonus);
}
// For a fixed complete-hand value, average remaining dice one face at a time.
void expectations(const Lattice&l,std::array<double,HANDS>&values){
 for(int i=FULL_FIRST-1;i>=0;i--){double sum=0;for(int f=0;f<6;f++)sum+=values[l.plus[i][f]];values[i]=sum/6;}
}
// Every submultiset is reached by removing one die repeatedly.
void maxima(const Lattice&l,std::array<double,HANDS>&values,std::array<std::uint16_t,FULL_COUNT>*hold){
 std::array<int,HANDS>choice{};
 for(int i=0;i<HANDS;i++){choice[i]=i;
  for(int f=0;f<6;f++){const int prior=l.minus[i][f];if(prior<0)continue;
   if(values[prior]>values[i]||(values[prior]==values[i]&&l.rank[choice[prior]]<l.rank[choice[i]])){values[i]=values[prior];choice[i]=choice[prior];}}
  if(hold&&i>=FULL_FIRST)(*hold)[i-FULL_FIRST]=static_cast<std::uint16_t>(choice[i]);
 }
}
double component(const Lattice&l,const Menu&menu,const std::vector<double>&table,int mask,int upper,bool bonus,Policy*policy){
 std::array<double,HANDS>values{};
 for(int r=0;r<FULL_COUNT;r++){double best=-std::numeric_limits<double>::infinity();int category=-1;
  const bool extra=bonus&&l.hands[FULL_FIRST+r].face>=0;
  for(const auto&o:menu[r]){const int u=o.category<6?std::min(63,upper+o.points):upper;
   const bool y=bonus||(o.category==11&&o.points==50);
   const int reward=o.points+(extra?100:0)+(o.category<6&&upper<63&&upper+o.points>=63?35:0);
   const double future=table[stateIndex(mask|(1<<o.category),u,y)];
   if(!std::isfinite(future))throw std::runtime_error("Unsolved successor");
   const double value=reward+future;if(value>best){best=value;category=o.category;}}
  values[FULL_FIRST+r]=best;if(policy)policy->category[r]=static_cast<std::uint8_t>(category);
 }
 expectations(l,values);maxima(l,values,policy?&policy->h1:nullptr);
 expectations(l,values);maxima(l,values,policy?&policy->h2:nullptr);
 expectations(l,values);return values[0];
}
struct Solution {std::vector<double>table;std::unique_ptr<Policy[]>policy;std::uint64_t components=0,validStates=0;};
Solution solve(const Lattice&l,bool published,bool policies){
 Solution s;s.table.assign(SIZE,std::numeric_limits<double>::quiet_NaN());if(policies)s.policy=std::make_unique<Policy[]>(SIZE);
 for(int filled=13;filled>=0;filled--){std::vector<int>masks;for(int mask=0;mask<=ALL;mask++)if(__builtin_popcount(static_cast<unsigned>(mask))==filled)masks.push_back(mask);
  std::uint64_t components=0,states=0;
  #pragma omp parallel for schedule(dynamic,1) reduction(+:components,states)
  for(std::size_t i=0;i<masks.size();i++){const int mask=masks[i];const auto menu=filled==13?Menu{}:menuFor(l,mask,published);
   for(int flag=0;flag<=(mask&Y?1:0);flag++){
    for(int upper=0;upper<=63;upper++)if(l.reachable[mask&63][upper]&&canonicalIndex(l,mask,upper,flag!=0)==stateIndex(mask,upper,flag!=0)){
     const int index=stateIndex(mask,upper,flag!=0);s.table[index]=filled==13?0:component(l,menu,s.table,mask,upper,flag!=0,s.policy?&s.policy[index]:nullptr);components++;
    }
    for(int upper=0;upper<=63;upper++)if(l.reachable[mask&63][upper]){const int index=stateIndex(mask,upper,flag!=0),canonical=canonicalIndex(l,mask,upper,flag!=0);
     s.table[index]=s.table[canonical];if(!std::isfinite(s.table[index]))throw std::runtime_error("Nonfinite solved state");states++;}
   }
  }
  s.components+=components;s.validStates+=states;
  std::cout<<"tier "<<filled<<" components="<<components<<" valid="<<states<<std::endl;
 }
 return s;
}
void binary(const std::string&file,const std::vector<double>&table){
 std::ofstream out(file,std::ios::binary);if(!out)throw std::runtime_error("Cannot create binary");
 for(double value:table){const auto*p=reinterpret_cast<const unsigned char*>(&value);for(int i=0;i<8;i++)out.put(static_cast<char>(p[i]));}
 if(!out)throw std::runtime_error("Binary write failed");
}
struct RNG {std::uint32_t state;explicit RNG(std::uint32_t seed):state(seed){}
 std::uint32_t word(){state+=0x6d2b79f5U;auto t=state;t=(t^(t>>15))*(t|1U);t^=t+(t^(t>>7))*(t|61U);return t^(t>>14);}
 int die(){auto draw=word();while(draw>=4294967292U)draw=word();return static_cast<int>(draw%6);}
};
void simulate(const Lattice&l,const Solution&s,bool published,std::uint64_t games,std::uint32_t seed,const std::string&report){
 if(!s.policy)throw std::runtime_error("Simulation needs policies");
 RNG rng(seed^(published?0x9e3779b9U:0x6d2b79f5U));long double sum=0,squares=0;
 std::uint64_t rolls=0;int minimum=10000,maximum=0;
 for(std::uint64_t game=0;game<games;game++){
  int mask=0,upper=0,total=0;bool bonus=false;
  for(int turn=0;turn<13;turn++){const auto&policy=s.policy[canonicalIndex(l,mask,upper,bonus)];
   std::array<int,6>count{};for(int n=0;n<5;n++){count[rng.die()]++;rolls++;}
   for(int remaining=2;remaining>0;remaining--){const int r=l.rollId(count);if(r<0||r>=FULL_COUNT)throw std::runtime_error("Bad roll lookup");
    const auto&keep=l.hands[remaining==2?policy.h2[r]:policy.h1[r]];count=keep.count;
    for(int n=keep.length;n<5;n++){count[rng.die()]++;rolls++;}
   }
   const auto&hand=l.hands[FULL_FIRST+l.rollId(count)];const int c=policy.category[l.rollId(count)];
   const int open=ALL^mask;int legal=open;
   const bool extra=hand.face>=0&&(mask&Y);
   if(extra&&!published){if(open&(1<<hand.face))legal=1<<hand.face;else if(open&~63)legal=open&~63;}
   if(!(legal&(1<<c)))throw std::runtime_error("Illegal simulated category");
   int points=rawScore(hand,c);
   if(extra&&(mask&(1<<hand.face))){if(c==8)points=25;else if(c==9)points=30;else if(c==10)points=40;}
   total+=points+(bonus&&hand.face>=0?100:0);
   if(c<6){if(upper<63&&upper+points>=63)total+=35;upper=std::min(63,upper+points);}
   bonus=bonus||(c==11&&points==50);mask|=1<<c;
  }
  if(mask!=ALL)throw std::runtime_error("Incomplete game");
  sum+=total;squares+=static_cast<long double>(total)*total;minimum=std::min(minimum,total);maximum=std::max(maximum,total);
  if((game+1)%100000==0)std::cout<<"simulated "<<game+1<<" games"<<std::endl;
 }
 const double mean=static_cast<double>(sum/games),variance=static_cast<double>((squares-sum*sum/games)/(games-1));
 const double standardError=std::sqrt(variance/games),ev=s.table[0],sigma=std::abs(mean-ev)/standardError;
 std::ofstream out(report);out<<std::setprecision(17)<<"{\"passed\":"<<(sigma<=4?"true":"false")<<",\"mode\":\""<<(published?"published":"official")<<"\",\"seed\":"<<seed<<",\"games\":"<<games<<",\"individualDiceDraws\":"<<rolls<<",\"expectedValue\":"<<ev<<",\"mean\":"<<mean<<",\"sampleVariance\":"<<variance<<",\"standardError\":"<<standardError<<",\"sigma\":"<<sigma<<",\"minimum\":"<<minimum<<",\"maximum\":"<<maximum<<"}\n";
 if(!out||sigma>4)throw std::runtime_error("Simulation four-SE requirement");
}
int main(int argc,char**argv){try{
 std::string mode="official",output,report;std::uint64_t games=0;std::uint32_t seed=1;
 for(int i=1;i<argc;i++){const std::string arg=argv[i];if(i+1>=argc)throw std::runtime_error("Missing argument");const std::string value=argv[++i];
  if(arg=="--mode")mode=value;else if(arg=="--output")output=value;else if(arg=="--games")games=std::stoull(value);else if(arg=="--seed")seed=static_cast<std::uint32_t>(std::stoul(value));else if(arg=="--report")report=value;else throw std::runtime_error("Unknown option");}
 if((mode!="official"&&mode!="published")||output.empty()||(games&&(games<2||report.empty())))throw std::runtime_error("Invalid options");
 Lattice lattice;auto solution=solve(lattice,mode=="published",games!=0);binary(output,solution.table);
 std::cout<<std::setprecision(17)<<"{\"mode\":\""<<mode<<"\",\"expectedValue\":"<<solution.table[0]<<",\"canonicalComponents\":"<<solution.components<<",\"validStates\":"<<solution.validStates<<",\"tableEntries\":"<<SIZE<<"}"<<std::endl;
 if(games)simulate(lattice,solution,mode=="published",games,seed,report);
 return 0;
 }catch(const std::exception&e){std::cerr<<"ERROR: "<<e.what()<<std::endl;return 1;}}
