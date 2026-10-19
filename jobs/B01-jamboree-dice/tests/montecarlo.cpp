#include <cstdint>
#include <iostream>
#include <limits>
#include <vector>

struct Generator {
  std::uint32_t a, b = 0x9e3779b9u, c = 0x243f6a88u, d = 0xb7e15162u;
  std::uint64_t draws = 0, rejected = 0;
  explicit Generator(std::uint32_t seed) : a(seed) {}
  std::uint32_t next() {
    const std::uint32_t x = b * 5u;
    const std::uint32_t result = ((x << 7) | (x >> 25)) * 9u;
    const std::uint32_t t = b << 9;
    c ^= a; d ^= b; b ^= c; a ^= d; c ^= t;
    d = (d << 11) | (d >> 21);
    ++draws;
    return result;
  }
  std::uint32_t index(std::uint32_t width) {
    const std::uint64_t span = std::uint64_t{1} << 32;
    const std::uint64_t limit = span - span % width;
    for (;;) {
      const std::uint32_t value = next();
      if (value < limit) return value % width;
      ++rejected;
    }
  }
};

int main(int argc, char**) {
  std::uint32_t seed;
  std::uint64_t trials;
  if (!(std::cin >> seed >> trials) || seed == 0) return 2;
  Generator rng(seed);
  if (argc > 1) {
    std::cout << '[';
    for (std::uint64_t i = 0; i < trials; ++i) {
      if (i) std::cout << ',';
      std::cout << rng.next();
    }
    std::cout << "]\n";
    return 0;
  }
  unsigned blocks, bins;
  if (!(std::cin >> blocks >> bins) || blocks < 1 || blocks > 5 || bins == 0) return 2;
  std::vector<std::uint32_t> widths(blocks);
  unsigned space = 1;
  for (auto& width : widths) {
    if (!(std::cin >> width) || width < 1 || width > 10) return 2;
    space *= width;
  }
  std::vector<unsigned> rankToBin(space);
  for (auto& bin : rankToBin) if (!(std::cin >> bin) || bin >= bins) return 2;
  std::vector<std::uint64_t> counts(bins, 0);
  for (std::uint64_t t = 0; t < trials; ++t) {
    unsigned rank = 0;
    for (const auto width : widths) rank = rank * width + rng.index(width);
    ++counts[rankToBin[rank]];
  }
  std::cout << "{\"observed\":[";
  for (unsigned i = 0; i < bins; ++i) {
    if (i) std::cout << ',';
    std::cout << counts[i];
  }
  std::cout << "],\"trials\":" << trials << ",\"rngDraws\":" << rng.draws
            << ",\"rejectedDraws\":" << rng.rejected << "}\n";
  return 0;
}
