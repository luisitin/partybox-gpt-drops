#pragma once
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
#include <unordered_map>
#include <memory>
// Standard headers are included above, before the independent generator's
// namespace wrapper. Its original source is neither edited nor reimplemented.
namespace b07_independent {
#include "generate-core.hpp"
}
struct NativeCard { int usedMask,upper; bool yahtzeeBonus,published; };
struct NativeScore { bool legal; int points,yahtzeeBonus,upperBonus; NativeCard next; };
struct NativeTurn {
    std::array<double,252> zero,one,two;
    std::array<int,252> category,holdOneCodes,holdTwoCodes;
};
class NativeReference {
    std::vector<double> official_,published_;
    std::unordered_map<std::uint32_t,std::unique_ptr<NativeTurn>> cache_;
    static std::vector<double> load(const std::string& filename) {
        if constexpr(std::endian::native!=std::endian::little)throw std::runtime_error("native reference requires little endian");
        std::ifstream in(filename,std::ios::binary|std::ios::ate);
        if(!in||in.tellg()!=8388608)throw std::runtime_error("independent table size");
        in.seekg(0);std::vector<double> values(1048576);
        in.read(reinterpret_cast<char*>(values.data()),8388608);if(!in)throw std::runtime_error("independent table read");return values;
    }
    static void validate(NativeCard card) {
        if(card.usedMask<0||card.usedMask>8191||card.upper<0||card.upper>63||(card.yahtzeeBonus&&!(card.usedMask&2048)))throw std::runtime_error("invalid native card");
        const auto& values=b07_independent::reachable[card.usedMask&63];
        if(!std::binary_search(values.begin(),values.end(),card.upper))throw std::runtime_error("unreachable native upper");
    }
    double future(NativeCard card) const {
        const double value=(card.published?published_:official_)[b07_independent::index(card.usedMask,card.upper,card.yahtzeeBonus)];
        if(!std::isfinite(value))throw std::runtime_error("missing native continuation");
        return value;
    }
    static NativeCard canonical(NativeCard card) {
        int remaining=0;for(int f=0;f<6;++f)if(!(card.usedMask&(1<<f)))remaining+=5*(f+1);
        if(card.upper+remaining<63)card.upper=0;
        return card;
    }
    static std::uint32_t key(NativeCard card) {return static_cast<std::uint32_t>(b07_independent::index(card.usedMask,card.upper,card.yahtzeeBonus))+(card.published?1048576U:0U);}
    static int roll(const std::array<int,6>& counts) {
        int total=0;for(int n:counts){if(n<0||n>5)throw std::runtime_error("native die counts");total+=n;}
        if(total!=5)throw std::runtime_error("native five dice");
        const int b=b07_independent::byCounts[b07_independent::code(counts)];
        const auto it=std::find(b07_independent::full.begin(),b07_independent::full.end(),b);
        if(it==b07_independent::full.end())throw std::runtime_error("native full roll lookup");
        return static_cast<int>(it-b07_independent::full.begin());
    }
    static NativeScore write(int r,int category,NativeCard card) {
        if(category<0||category>12)throw std::runtime_error("native category");
        const int f=b07_independent::equalFace[r];
        const bool extra=f>=0&&(card.usedMask&2048),matching=extra&&(card.usedMask&(1<<f));
        bool legal=!(card.usedMask&(1<<category));
        if(!card.published&&extra){if(!matching)legal=legal&&category==f;else if((8191^card.usedMask)&8128)legal=legal&&category>=6;}
        if(!legal)return {false,0,0,0,card};
        int points=b07_independent::base[r][category];
        if(matching&&category>=8&&category<=10)points=category==8?25:category==9?30:40;
        NativeCard next=card;next.usedMask|=1<<category;
        if(category<6)next.upper=std::min(63,card.upper+points);
        if(category==11&&points==50)next.yahtzeeBonus=true;
        return {true,points,extra&&card.yahtzeeBonus?100:0,card.upper<63&&next.upper==63?35:0,next};
    }
public:
    NativeReference(const std::string& officialOwnBin,const std::string& publishedOwnBin):official_(load(officialOwnBin)),published_(load(publishedOwnBin)) {
        static bool prepared=false;if(!prepared){b07_independent::prepare();prepared=true;}
    }
    int fullRollIndex(int countCode) const {
        if(countCode<0||countCode>=46656)throw std::runtime_error("native roll code");
        const int b=b07_independent::byCounts[countCode];
        const auto it=std::find(b07_independent::full.begin(),b07_independent::full.end(),b);
        if(it==b07_independent::full.end())throw std::runtime_error("native full roll code");
        return static_cast<int>(it-b07_independent::full.begin());
    }
    NativeScore score(const std::array<int,6>& counts,int category,NativeCard card) const {validate(card);return write(roll(counts),category,card);}
    double expectedValue(NativeCard card) const {validate(card);return future(card);}
    const NativeTurn& turn(NativeCard actual) {
        validate(actual);if(actual.usedMask==8191)throw std::runtime_error("native full card has no turn");
        const auto card=canonical(actual);const auto at=key(card);
        const auto found=cache_.find(at);if(found!=cache_.end())return *found->second;
        auto result=std::make_unique<NativeTurn>();
        for(int r=0;r<252;++r){double best=-std::numeric_limits<double>::infinity();int chosen=-1;
            for(int c=0;c<13;++c){const auto s=write(r,c,card);if(!s.legal)continue;const double value=s.points+s.yahtzeeBonus+s.upperBonus+future(s.next);if(value>best){best=value;chosen=c;}}
            result->zero[r]=best;result->category[r]=chosen;
        }
        const auto reroll=[&](const std::array<double,252>& previous,std::array<double,252>& values,std::array<int,252>& codes){
            std::array<double,462> choices{};
            for(int h=0;h<462;++h){double v=0;for(const auto& e:b07_independent::bags[h].outcomes)v+=e.probability*previous[e.roll];choices[h]=v;}
            for(int r=0;r<252;++r){double best=-std::numeric_limits<double>::infinity();int chosen=-1;
                for(int h:b07_independent::allowedHolds[r])if(choices[h]>best){best=choices[h];chosen=h;}
                values[r]=best;codes[r]=b07_independent::code(b07_independent::bags[chosen].counts);
            }
        };
        reroll(result->zero,result->one,result->holdOneCodes);reroll(result->one,result->two,result->holdTwoCodes);
        const auto* ptr=result.get();cache_.emplace(at,std::move(result));return *ptr;
    }
    double heldValue(NativeCard card,int holdCode,int rollsLeft) {
        if(rollsLeft!=1&&rollsLeft!=2)throw std::runtime_error("native remaining rolls");
        if(holdCode<0||holdCode>=46656)throw std::runtime_error("native hold code");
        const int h=b07_independent::byCounts[holdCode];if(h<0)throw std::runtime_error("native missing hold");
        const auto& t=turn(card);const auto& previous=rollsLeft==1?t.zero:t.one;
        double value=0;for(const auto& e:b07_independent::bags[h].outcomes)value+=e.probability*previous[e.roll];return value;
    }
    const std::array<int,6>& fullRollCounts(int r) const {if(r<0||r>=252)throw std::runtime_error("native roll index");return b07_independent::bags[b07_independent::full[r]].counts;}
    std::size_t computedComponents()const{return cache_.size();}
};
