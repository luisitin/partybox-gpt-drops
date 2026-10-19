// Blind independent numerical oracle, authored from the public mathematical
// contract. No production or pre-existing B18 reference source was inspected.
#include <quadmath.h>
#include <array>
#include <cmath>
#include <cstdint>
#include <cstdio>
#include <cstring>
#include <limits>
#include <string>

using Q = __float128;

static double finite_double(Q value) {
  const Q maximum = static_cast<Q>(std::numeric_limits<double>::max());
  if (value > maximum) return std::numeric_limits<double>::max();
  if (value < -maximum) return -std::numeric_limits<double>::max();
  if (isnanq(value)) return 0;
  return static_cast<double>(value);
}

static bool read_double(double& result) {
  unsigned char bytes[8];
  const std::size_t count = std::fread(bytes, 1, 8, stdin);
  if (count == 0 && std::feof(stdin)) return false;
  if (count != 8) {
    std::fputs("Incomplete binary float64 input\n", stderr);
    std::exit(2);
  }
  std::uint64_t bits = 0;
  for (unsigned i = 0; i < 8; ++i) bits |= std::uint64_t(bytes[i]) << (8 * i);
  std::memcpy(&result, &bits, 8);
  return true;
}

static void write_double(double value) {
  std::uint64_t bits;
  std::memcpy(&bits, &value, 8);
  unsigned char bytes[8];
  for (unsigned i = 0; i < 8; ++i) bytes[i] = (bits >> (8 * i)) & 255;
  if (std::fwrite(bytes, 1, 8, stdout) != 8) std::exit(3);
}

// De Casteljau evaluation uses a different expression from power-basis
// production solvers and does not assume either interior control is ordered.
static Q curve(Q t, Q first, Q second) {
  const Q complement = 1 - t;
  const Q a = t * first;
  const Q b = complement * first + t * second;
  const Q c = complement * second + t;
  const Q d = complement * a + t * b;
  const Q e = complement * b + t * c;
  return complement * d + t * e;
}

static Q derivative(Q t, Q first, Q second) {
  const Q complement = 1 - t;
  return 3 * (first * complement * complement +
              2 * (second - first) * complement * t +
              (1 - second) * t * t);
}

static Q inverse(Q target, Q first, Q second) {
  if (target == 0) return 0;
  if (target == 1) return 1;
  // The only internal stationary point possible with CSS control x values.
  if (first == 1 && second == 0 && target == Q(0.5)) return Q(0.5);
  Q low = 0;
  Q high = 1;
  Q t = Q(0.5);
  for (unsigned iteration = 0; iteration < 4096; ++iteration) {
    const Q value = curve(t, first, second);
    if (value == target) return t;
    if (value < target) low = t;
    else high = t;
    const Q slope = derivative(t, first, second);
    Q candidate = slope > 0 ? t - (value - target) / slope : -1;
    if (!(candidate > low && candidate < high)) candidate = (low + high) / 2;
    if (candidate == t || candidate == low || candidate == high) return candidate;
    t = candidate;
  }
  std::fputs("Quad inversion did not converge\n", stderr);
  std::exit(4);
}

static double bezier(const std::array<double, 6>& input) {
  for (unsigned i = 0; i < 5; ++i) if (!std::isfinite(input[i])) return 0;
  const Q p = input[0], x1 = input[1], y1 = input[2];
  const Q x2 = input[3], y2 = input[4];
  if (x1 < 0 || x1 > 1 || x2 < 0 || x2 > 1) return 0;
  if (p == 0) return 0;
  if (p == 1) return 1;
  if (p < 0) {
    const Q slope = x1 > 0 ? y1 / x1 : (x2 > 0 ? y2 / x2 : 0);
    return finite_double(p * slope);
  }
  if (p > 1) {
    const Q slope = x2 < 1 ? (1 - y2) / (1 - x2) :
      (x1 < 1 ? (1 - y1) / (1 - x1) : 0);
    return finite_double(1 + (p - 1) * slope);
  }
  // Solve the smaller endpoint distance to retain accuracy at p near one.
  if (p > Q(0.5)) {
    const Q t = inverse(1 - p, 1 - x2, 1 - x1);
    return finite_double(1 - curve(t, 1 - y2, 1 - y1));
  }
  return finite_double(curve(inverse(p, x1, x2), y1, y2));
}

static std::array<double, 2> spring(const std::array<double, 6>& input) {
  for (double value : input) if (!std::isfinite(value)) return {0, 0};
  const Q t = input[0], mass = input[1], stiffness = input[2];
  const Q damping = input[3], x0 = input[4], v0 = input[5];
  if (mass <= 0 || stiffness < 0 || damping < 0) return {0, 0};
  if (t <= 0) return {input[4], input[5]};
  Q x, v;
  if (stiffness == 0) {
    if (damping == 0) {
      x = x0 + v0 * t;
      v = v0;
    } else {
      const Q rate = damping / mass;
      const Q decay = expq(-rate * t);
      x = x0 + v0 * (-expm1q(-rate * t)) / rate;
      v = v0 * decay;
    }
  } else {
    // Products of two binary64 values fit exactly in the 113-bit mantissa
    // when their exponents are close enough for discriminant cancellation.
    const Q discriminant = damping * damping - 4 * mass * stiffness;
    const Q alpha = damping / (2 * mass);
    const Q omega2 = stiffness / mass;
    if (discriminant < 0) {
      const Q beta = sqrtq(-discriminant) / (2 * mass);
      const Q angle = beta * t;
      const Q s = sinq(angle) / beta;
      const Q c = cosq(angle);
      const Q decay = expq(-alpha * t);
      x = decay * (x0 * c + (v0 + alpha * x0) * s);
      v = decay * (v0 * c - (alpha * v0 + omega2 * x0) * s);
    } else if (discriminant == 0) {
      const Q z = v0 + alpha * x0;
      const Q decay = expq(-alpha * t);
      x = decay * (x0 + z * t);
      v = decay * (v0 - alpha * z * t);
    } else {
      const Q radical = sqrtq(discriminant);
      const Q slow = -2 * stiffness / (damping + radical);
      const Q fast = -(damping + radical) / (2 * mass);
      const Q gap = radical / mass;
      const Q z = v0 - slow * x0;
      const Q span = -expm1q(-gap * t) / gap;
      x = expq(slow * t) * (x0 + z * span);
      v = slow * x + z * expq(fast * t);
    }
  }
  return {finite_double(x), finite_double(v)};
}

int main(int argc, char** argv) {
  const bool spring_mode = argc == 2 && std::string(argv[1]) == "--spring";
  if (argc > 2 || (argc == 2 && !spring_mode)) {
    std::fputs("usage: quad-oracle [--spring]\n", stderr);
    return 1;
  }
  const unsigned width = spring_mode ? 6 : 5;
  std::array<double, 6> input{};
  while (read_double(input[0])) {
    for (unsigned column = 1; column < width; ++column) {
      if (!read_double(input[column])) {
        std::fputs("Incomplete binary record\n", stderr);
        return 2;
      }
    }
    if (spring_mode) {
      const auto state = spring(input);
      write_double(state[0]);
      write_double(state[1]);
    } else write_double(bezier(input));
  }
  return std::ferror(stdin) || std::ferror(stdout) ? 3 : 0;
}
