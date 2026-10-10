// Verification-only 113-bit reference; never reads/imports production code.
// GNU C++17 + libquadmath. IEEE binary64 inputs are converted exactly to __float128.
#include <quadmath.h>
#include <cmath>
#include <cstdint>
#include <cstdio>
#include <cstdlib>
#include <limits>
#include <string>
static_assert(__FLT128_MANT_DIG__ == 113, "113-bit significand required");
static_assert(sizeof(double)==8 && std::numeric_limits<double>::is_iec559, "binary64 required");
using Q = __float128;
static uint32_t state;
static double random01() {
  state ^= state<<13; state ^= state>>17; state ^= state<<5;
  return double(state)/4294967296.0;
}
// de Casteljau evaluation, deliberately NOT production's polynomial/residual.
static Q coordinate(Q t, Q p1, Q p2) {
  Q a=t*p1, b=(1-t)*p1+t*p2, c=(1-t)*p2+t;
  return (1-t)*((1-t)*a+t*b)+t*((1-t)*b+t*c);
}
static Q reference(double pp, double aa, double bb, double cc, double dd) {
  Q p=pp,a=aa,b=bb,c=cc,d=dd;
  if (p==0 || p==1) return p;
  if (p<0) return a>0 ? p*b/a : c>0 ? p*d/c : Q(0);
  if (p>1) return c<1 ? 1+(p-1)*(1-d)/(1-c) : a<1 ? 1+(p-1)*(1-b)/(1-a) : Q(1);
  Q lo=0,hi=1,t;
  for(int i=0;i<116;i++) {
    t=(lo+hi)/2;
    Q value=coordinate(t,a,c);
    if(value==p) return coordinate(t,b,d);
    if(value<p) lo=t; else hi=t;
  }
  return coordinate((lo+hi)/2,b,d);
}
static void emit(double kind, double p,double a,double b,double c,double d) {
  double row[]={kind,p,a,b,c,d,double(reference(p,a,b,c,d))};
  if(std::fwrite(row,sizeof(double),7,stdout)!=7) std::exit(2);
}
int main(int argc,char**argv) {
  if(argc<2) return 2;
  state=uint32_t(std::stoul(argv[1]));
  const unsigned n=argc>2?unsigned(std::stoul(argv[2])):1000000;
  const double named[4][4]={{.25,.1,.25,1},{.42,0,1,1},{0,0,.58,1},{.42,0,.58,1}};
  for(unsigned i=0;i<n;i++) {
    double p=random01(),a=random01(),b=8*random01()-4,c=random01(),d=8*random01()-4;
    switch(i%20) {
      case 0: a=c=0; break;
      case 1: a=c=1; break;
      case 2: a=1;c=0;p=.5+(random01()<.5?-1:1)*std::ldexp(1.,-int(15+38*random01()));break;
      case 3: a=1-random01()*1e-12;c=random01()*1e-12;
        p=double(coordinate(Q(.5),Q(a),Q(c)))+(random01()<.5?-1:1)*std::ldexp(1.,-int(32+28*random01()));break;
      case 4: c=a;break;
      case 5: {auto& v=named[(i/20)%4];a=v[0];b=v[1];c=v[2];d=v[3];break;}
      case 6: p=-2+5*p;break;
      case 7: p=(i/20)%2;break;
      case 8: p=std::ldexp(1.,-int(1+52*random01()));a=c=0;break;
      case 9: p=1-std::ldexp(1.,-int(1+52*random01()));a=c=1;break;
    }
    emit(0,p,a,b,c,d);
  }
  // A separate named-easing grid, including CSS extrapolation.
  for(int j=0;j<4;j++) for(int i=0;i<=10000;i++) {
    auto& v=named[j]; emit(j+1,-1+3.*i/10000,v[0],v[1],v[2],v[3]);
  }
  std::fprintf(stderr,"oracle: seed=%u random=%u named=40004 precision=113 bits iterations=116\n",unsigned(std::stoul(argv[1])),n);
}
