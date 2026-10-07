#include <array>
#include <algorithm>
#include <bit>
#include <cmath>
#include <cstdint>
#include <fstream>
#include <iomanip>
#include <iostream>
#include <limits>
#include <stdexcept>
#include <string>
#include <vector>

// Independently authored from public scoring/interface rules only.
using Counts=std::array<int,6>;
struct Outcome { int roll; double probability; };
struct Bag { Counts counts; int size; std::vector<int> dice; std::vector<Outcome> outcomes; };
std::vector<Bag> bags;
std::vector<int> full;
std::array<int,46656> byCounts;
std::array<std::array<int,13>,252> base;
std::array<int,252> equalFace;
std::array<std::vector<int>,252> allowedHolds;
std::array<std::vector<int>,64> reachable;
int code(const Counts& c) { int v=0,m=1;for(int n:c){v+=n*m;m*=6;}return v; }
int factorial(int n) { int v=1;for(int i=2;i<=n;++i)v*=i;return v; }
void enumerate(Counts& c,int face,int remaining,int size) {
    if(face==5) {
        c[5]=remaining; Bag b{c,size,{}, {}};
        for(int i=0;i<6;++i)for(int k=0;k<c[i];++k)b.dice.push_back(i+1);
        bags.push_back(std::move(b));return;
    }
    for(int k=0;k<=remaining;++k){c[face]=k;enumerate(c,face+1,remaining-k,size);}
}
void prepare() {
    Counts c{};
    for(int n=0;n<=5;++n)enumerate(c,0,n,n);
    std::sort(bags.begin(),bags.end(),[](const Bag&a,const Bag&b){return a.dice<b.dice;});
    byCounts.fill(-1);
    for(int i=0;i<(int)bags.size();++i){byCounts[code(bags[i].counts)]=i;if(bags[i].size==5)full.push_back(i);}
    if(bags.size()!=462||full.size()!=252)throw std::runtime_error("bag enumeration count");
    std::array<int,46656> fullIndex;fullIndex.fill(-1);
    for(int i=0;i<252;++i)fullIndex[code(bags[full[i]].counts)]=i;
    std::size_t edges=0;
    for(auto& held:bags){
        const int n=5-held.size;
        double total=0;
        for(const auto& rolled:bags)if(rolled.size==n){
            Counts combined{};int denominator=1;
            for(int i=0;i<6;++i){combined[i]=held.counts[i]+rolled.counts[i];denominator*=factorial(rolled.counts[i]);}
            const double p=double(factorial(n)/denominator)/std::pow(6.,n);
            const int index=fullIndex[code(combined)];
            if(index<0)throw std::runtime_error("completion lookup");
            held.outcomes.push_back({index,p});total+=p;edges++;
        }
        if(std::abs(total-1)>1e-12)throw std::runtime_error("probability sum");
    }
    if(edges!=4368)throw std::runtime_error("outcome edge count");
    for(int r=0;r<252;++r){
        const auto& bag=bags[full[r]];int sum=0,maximum=0,present=0;bool two=false,three=false;
        equalFace[r]=-1;
        for(int i=0;i<6;++i){sum+=(i+1)*bag.counts[i];maximum=std::max(maximum,bag.counts[i]);if(bag.counts[i])present|=1<<i;two|=bag.counts[i]==2;three|=bag.counts[i]==3;if(bag.counts[i]==5)equalFace[r]=i;base[r][i]=(i+1)*bag.counts[i];}
        base[r][6]=maximum>=3?sum:0;base[r][7]=maximum>=4?sum:0;
        base[r][8]=two&&three?25:0;
        base[r][9]=((present&15)==15||(present&30)==30||(present&60)==60)?30:0;
        base[r][10]=present==31||present==62?40:0;base[r][11]=maximum==5?50:0;base[r][12]=sum;
        for(int h=0;h<462;++h){bool ok=true;for(int i=0;i<6;++i)if(bags[h].counts[i]>bag.counts[i])ok=false;if(ok)allowedHolds[r].push_back(h);}
    }
    for(int mask=0;mask<64;++mask){
        std::array<bool,64> values{};values[0]=true;
        for(int face=0;face<6;++face)if(mask&(1<<face)){
            std::array<bool,64> next{};
            for(int upper=0;upper<64;++upper)if(values[upper])for(int k=0;k<=5;++k)next[std::min(63,upper+k*(face+1))]=true;
            values=next;
        }
        for(int u=0;u<64;++u)if(values[u])reachable[mask].push_back(u);
    }
    std::cerr<<"prepared 462 holds,252 rolls,4368 weighted completions\n";
}
std::size_t index(int mask,int upper,int bonus){return std::size_t(mask)+std::size_t(upper)*8192+std::size_t(bonus)*524288;}
void write(const std::string& filename,const std::vector<double>& values){
    if constexpr(std::endian::native!=std::endian::little)throw std::runtime_error("little endian host required");
    std::ofstream out(filename,std::ios::binary);out.write(reinterpret_cast<const char*>(values.data()),static_cast<std::streamsize>(values.size()*sizeof(double)));if(!out)throw std::runtime_error("table write");
}
void solve(bool official,const std::string& filename){
    std::vector<double> table(1<<20,std::numeric_limits<double>::quiet_NaN());
    std::array<double,252> decisions{},nextDecisions{};
    std::array<double,462> choices{};
    std::size_t computed=0,copied=0,valid=0;
    for(int mask=8191;mask>=0;--mask){
        int maximumUpper=0;for(int f=0;f<6;++f)if(!(mask&(1<<f)))maximumUpper+=5*(f+1);
        for(int bonus=0;bonus<=((mask&(1<<11))?1:0);++bonus){
            for(int upper:reachable[mask&63]){
                valid++;
                const auto at=index(mask,upper,bonus);
                if(mask==8191){table[at]=0;continue;}
                if(upper>0&&upper+maximumUpper<63){table[at]=table[index(mask,0,bonus)];copied++;continue;}
                for(int r=0;r<252;++r){
                    double best=-std::numeric_limits<double>::infinity();
                    const int face=equalFace[r];const bool extra=face>=0&&(mask&(1<<11));
                    const bool joker=extra&&(mask&(1<<face));
                    int forced=8191^mask;
                    if(official&&extra){
                        if(!joker)forced=1<<face;
                        else if(forced&8128)forced&=8128;
                    }
                    for(int category=0;category<13;++category)if(forced&(1<<category)){
                        int points=base[r][category];
                        if(joker&&category>=8&&category<=10)points=category==8?25:category==9?30:40;
                        const int nextUpper=category<6?std::min(63,upper+points):upper;
                        const int nextBonus=bonus||(category==11&&points==50);
                        const double continuation=table[index(mask|(1<<category),nextUpper,nextBonus)];
                        if(!std::isfinite(continuation))throw std::runtime_error("uncomputed reachable child");
                        const double value=points+(extra&&bonus?100:0)+(upper<63&&nextUpper==63?35:0)+continuation;
                        best=std::max(best,value);
                    }
                    decisions[r]=best;
                }
                for(int reroll=0;reroll<2;++reroll){
                    for(int h=0;h<462;++h){double value=0;for(const auto& outcome:bags[h].outcomes)value+=outcome.probability*decisions[outcome.roll];choices[h]=value;}
                    for(int r=0;r<252;++r){double best=-std::numeric_limits<double>::infinity();for(int h:allowedHolds[r])best=std::max(best,choices[h]);nextDecisions[r]=best;}
                    decisions=nextDecisions;
                }
                double value=0;for(const auto& outcome:bags[byCounts[0]].outcomes)value+=outcome.probability*decisions[outcome.roll];
                table[at]=value;computed++;
            }
        }
        if(mask%512==0)std::cerr<<(official?"official":"published")<<" mask="<<mask<<" computed="<<computed<<" copied="<<copied<<"\n";
    }
    write(filename,table);
    std::cout<<std::setprecision(17)<<"{\"mode\":\""<<(official?"official":"published")<<"\",\"expectedValue\":"<<table[0]<<",\"validStates\":"<<valid<<",\"computedStates\":"<<computed<<",\"equivalentCopies\":"<<copied<<",\"entries\":"<<table.size()<<"}\n";
}
