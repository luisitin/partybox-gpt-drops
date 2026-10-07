#include "native-reference.hpp"
int main(int argc,char**argv){try{
    if(argc!=4)throw std::runtime_error("usage: dump-reference KEYS.bin official.bin published.bin");
    NativeReference reference(argv[2],argv[3]);std::ifstream input(argv[1],std::ios::binary);if(!input)throw std::runtime_error("keys read");
    std::uint32_t key;std::size_t count=0;
    while(input.read(reinterpret_cast<char*>(&key),4)){
        if(key>=2097152U)throw std::runtime_error("key range");
        NativeCard card{static_cast<int>(key%8192),static_cast<int>((key/8192)%64),(key&524288U)!=0,(key&1048576U)!=0};
        const auto& turn=reference.turn(card);
        std::cout.write(reinterpret_cast<const char*>(&key),4);
        for(const auto* values:{&turn.zero,&turn.one,&turn.two})std::cout.write(reinterpret_cast<const char*>(values->data()),2016);
        for(const auto* values:{&turn.category,&turn.holdOneCodes,&turn.holdTwoCodes}){
            std::array<std::int32_t,252> output{};for(int i=0;i<252;++i)output[i]=(*values)[i];
            std::cout.write(reinterpret_cast<const char*>(output.data()),1008);
        }
        count++;
    }
    if(!input.eof()||!std::cout)throw std::runtime_error("native stream IO");
    std::cerr<<"native reference components emitted="<<count<<" cached="<<reference.computedComponents()<<"\n";
}catch(const std::exception&e){std::cerr<<e.what()<<"\n";return 1;}}
