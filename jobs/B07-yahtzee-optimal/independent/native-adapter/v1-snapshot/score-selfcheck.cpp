#include "native-reference.hpp"
int main(int argc,char**argv){try{
    if(argc!=3)throw std::runtime_error("usage: score-selfcheck official.bin published.bin");
    NativeReference reference(argv[1],argv[2]);
    const std::array<std::uint32_t,10> baseKeys{0,2048,2052,526336,526340,8190,532478,4095,31+50*8192,31+63*8192};
    for(std::uint32_t mode:{0U,1048576U})for(std::uint32_t raw:baseKeys){
        const auto key=raw+mode;NativeCard card{static_cast<int>(key%8192),static_cast<int>((key/8192)%64),(key&524288U)!=0,mode!=0};
        for(int r=0;r<252;++r)for(int c=0;c<13;++c){
            const auto s=reference.score(reference.fullRollCounts(r),c,card);
            const auto ri=static_cast<std::uint16_t>(r);const auto category=static_cast<std::uint8_t>(c),legal=static_cast<std::uint8_t>(s.legal);
            const std::array<std::int32_t,7> fields{s.points,s.yahtzeeBonus,s.upperBonus,s.next.usedMask,s.next.upper,s.next.yahtzeeBonus,s.next.published};
            std::cout.write(reinterpret_cast<const char*>(&key),4);std::cout.write(reinterpret_cast<const char*>(&ri),2);
            std::cout.write(reinterpret_cast<const char*>(&category),1);std::cout.write(reinterpret_cast<const char*>(&legal),1);
            std::cout.write(reinterpret_cast<const char*>(fields.data()),28);
        }
    }
    if(!std::cout)throw std::runtime_error("score output");
}catch(const std::exception&e){std::cerr<<e.what()<<"\n";return 1;}}
