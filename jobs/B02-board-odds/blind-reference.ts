/**
 * Independently authored B02 reference. There are no production imports.
 *
 * A segment follows zero-cost entries until the first ordinary entry, a
 * dead end, or a closed pass-through communicating class. Segment outcomes
 * and finite visit rewards are solved exactly, component by component.
 * Dynamic programming then concatenates segments for each integer face.
 */

export interface Rational {
  readonly numerator: bigint;
  readonly denominator: bigint;
}

export interface BoardNode {
  readonly id: string;
  readonly kind: string;
  readonly next: readonly string[];
  readonly passThrough: boolean;
}

export interface Board {
  readonly nodes: readonly BoardNode[];
}

export type BranchPolicy = 'uniform' | 'toward target';
export type ExpectedPasses = Rational | 'infinity';

export interface StartOdds {
  readonly landing: Map<string, Rational>;
  readonly nonTermination: Rational;
  readonly expectedPasses: Map<string, ExpectedPasses>;
}

export type BoardOdds = Map<string, StartOdds>;

const ZERO: Rational = { numerator: 0n, denominator: 1n };
const ONE: Rational = { numerator: 1n, denominator: 1n };

function gcd(a: bigint, b: bigint): bigint {
  if (a < 0n) a = -a;
  if (b < 0n) b = -b;
  while (b !== 0n) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }
  return a;
}

function fraction(numerator: bigint, denominator = 1n): Rational {
  if (denominator === 0n) throw new Error('Zero denominator');
  if (numerator === 0n) return ZERO;
  if (denominator < 0n) {
    numerator = -numerator;
    denominator = -denominator;
  }
  const divisor = gcd(numerator, denominator);
  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor,
  };
}

function add(a: Rational, b: Rational): Rational {
  if (a.numerator === 0n) return b;
  if (b.numerator === 0n) return a;
  if (a.denominator === b.denominator) {
    return fraction(a.numerator + b.numerator, a.denominator);
  }
  const common = gcd(a.denominator, b.denominator);
  const numerator = a.numerator * (b.denominator / common)
    + b.numerator * (a.denominator / common);
  // A divisor shared by the resulting numerator and denominator can only
  // come from `common`, since the inputs were already reduced.
  const cancel = gcd(numerator, common);
  return {
    numerator: numerator / cancel,
    denominator: (a.denominator / common) * (b.denominator / cancel),
  };
}

function subtract(a: Rational, b: Rational): Rational {
  if (b.numerator === 0n) return a;
  return add(a, { numerator: -b.numerator, denominator: b.denominator });
}

function multiply(a: Rational, b: Rational): Rational {
  if (a.numerator === 0n || b.numerator === 0n) return ZERO;
  if (a.numerator === a.denominator) return b;
  if (b.numerator === b.denominator) return a;
  const crossA = gcd(a.numerator, b.denominator);
  const crossB = gcd(b.numerator, a.denominator);
  return {
    numerator: (a.numerator / crossA) * (b.numerator / crossB),
    denominator: (a.denominator / crossB) * (b.denominator / crossA),
  };
}

function divide(a: Rational, b: Rational): Rational {
  if (b.numerator === 0n) throw new Error('Singular transient component');
  if (a.numerator === 0n) return ZERO;
  let numerator = b.denominator;
  let denominator = b.numerator;
  if (denominator < 0n) {
    numerator = -numerator;
    denominator = -denominator;
  }
  return multiply(a, { numerator, denominator });
}

function copyFraction(value: Rational): Rational {
  return { numerator: value.numerator, denominator: value.denominator };
}

function zeroVector(length: number): Rational[] {
  return Array.from({ length }, () => ZERO);
}

function addVector(destination: Rational[], source: readonly Rational[]): void {
  for (let column = 0; column < destination.length; column++) {
    if (source[column]!.numerator !== 0n) {
      destination[column]! = add(destination[column]!, source[column]!);
    }
  }
}

function addScaledVector(
  destination: Rational[],
  source: readonly Rational[],
  scale: Rational,
): void {
  if (scale.numerator === 0n) return;
  for (let column = 0; column < destination.length; column++) {
    if (source[column]!.numerator !== 0n) {
      destination[column]! = add(
        destination[column]!,
        multiply(scale, source[column]!),
      );
    }
  }
}

/** Solve A X = B using exact rational forward elimination/back substitution. */
function solve(coefficients: Rational[][], rhs: Rational[][]): Rational[][] {
  const size = coefficients.length;
  const width = rhs[0]!?.length ?? 0;
  for (let pivotColumn = 0; pivotColumn < size; pivotColumn++) {
    let pivotRow = pivotColumn;
    while (pivotRow < size && coefficients[pivotRow]![pivotColumn]!.numerator === 0n) {
      pivotRow++;
    }
    if (pivotRow === size) throw new Error('Singular transient component');
    if (pivotRow !== pivotColumn) {
      [coefficients[pivotRow]!, coefficients[pivotColumn]!] =
        [coefficients[pivotColumn]!, coefficients[pivotRow]!];
      [rhs[pivotRow]!, rhs[pivotColumn]!] = [rhs[pivotColumn]!, rhs[pivotRow]!];
    }

    const divisor = coefficients[pivotColumn]![pivotColumn]!;
    if (divisor.numerator !== divisor.denominator) {
      for (let column = pivotColumn; column < size; column++) {
        coefficients[pivotColumn]![column]! = divide(coefficients[pivotColumn]![column]!, divisor);
      }
      for (let column = 0; column < width; column++) {
        rhs[pivotColumn]![column]! = divide(rhs[pivotColumn]![column]!, divisor);
      }
    }

    for (let row = pivotColumn + 1; row < size; row++) {
      const scale = coefficients[row]![pivotColumn]!;
      if (scale.numerator === 0n) continue;
      coefficients[row]![pivotColumn]! = ZERO;
      for (let column = pivotColumn + 1; column < size; column++) {
        coefficients[row]![column]! = subtract(
          coefficients[row]![column]!,
          multiply(scale, coefficients[pivotColumn]![column]!),
        );
      }
      for (let column = 0; column < width; column++) {
        if (rhs[pivotColumn]![column]!.numerator !== 0n) {
          rhs[row]![column]! = subtract(
            rhs[row]![column]!,
            multiply(scale, rhs[pivotColumn]![column]!),
          );
        }
      }
    }
  }

  const result: Rational[][] = Array.from({ length: size }, () => zeroVector(width));
  for (let row = size - 1; row >= 0; row--) {
    const solution = rhs[row]!.slice();
    for (let column = row + 1; column < size; column++) {
      const scale = coefficients[row]![column]!;
      if (scale.numerator !== 0n) {
        for (let output = 0; output < width; output++) {
          if (result[column]![output]!.numerator !== 0n) {
            solution[output]! = subtract(
              solution[output]!,
              multiply(scale, result[column]![output]!),
            );
          }
        }
      }
    }
    result[row]! = solution;
  }
  return result;
}

interface PreparedGraph {
  readonly nodes: readonly BoardNode[];
  readonly edges: readonly number[][];
  readonly passes: readonly number[];
  readonly ordinary: readonly number[];
}

function prepare(board: Board, policy: BranchPolicy, target?: string): PreparedGraph {
  if (policy !== 'uniform' && policy !== 'toward target') {
    throw new Error(`Unsupported branch policy: ${String(policy)}`);
  }
  const nodes = board.nodes;
  const positions = new Map<string, number>();
  const passes: number[] = [];
  const ordinary: number[] = [];
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index]!;
    if (positions.has(node.id)) throw new Error(`Duplicate node id: ${node.id}`);
    positions.set(node.id, index);
    (node.passThrough ? passes : ordinary).push(index);
  }

  const edges: number[][] = nodes.map(node => {
    const unique = Array.from(new Set(node.next));
    return unique.map(id => {
      const position = positions.get(id);
      if (position === undefined) throw new Error(`Unknown successor: ${id}`);
      return position;
    });
  });

  if (policy === 'toward target' && target !== undefined) {
    const targetIndex = positions.get(target);
    if (targetIndex !== undefined) {
      const predecessors: number[][] = Array.from({ length: nodes.length }, () => []);
      for (let from = 0; from < edges.length; from++) {
        for (const to of edges[from]!) predecessors[to]!.push(from);
      }
      const distance = Array.from({ length: nodes.length }, () => Infinity);
      distance[targetIndex]! = 0;
      const queue = [targetIndex];
      for (let cursor = 0; cursor < queue.length; cursor++) {
        const to = queue[cursor]!;
        for (const from of predecessors[to]!) {
          if (distance[from]! === Infinity) {
            distance[from]! = distance[to]! + 1;
            queue.push(from);
          }
        }
      }
      for (let from = 0; from < edges.length; from++) {
        let best = Infinity;
        for (const to of edges[from]!) if (distance[to]! < best) best = distance[to]!;
        edges[from]! = edges[from]!.filter(to => distance[to]! === best);
      }
    }
  }
  return { nodes, edges, passes, ordinary };
}

interface Components {
  readonly groups: readonly number[][];
  readonly componentOf: readonly number[];
  readonly order: readonly number[];
  readonly closed: readonly boolean[];
}

/** Iterative Kosaraju followed by a sink-first component ordering. */
function components(graph: PreparedGraph): Components {
  const { nodes, edges, passes } = graph;
  const reverse: number[][] = Array.from({ length: nodes.length }, () => []);
  for (const from of passes) {
    for (const to of edges[from]!) if (nodes[to]!.passThrough) reverse[to]!.push(from);
  }
  const seen = Array.from({ length: nodes.length }, () => false);
  const finish: number[] = [];
  for (const start of passes) {
    if (seen[start]!) continue;
    seen[start]! = true;
    const stack: { node: number; cursor: number }[] = [{ node: start, cursor: 0 }];
    while (stack.length > 0) {
      const frame = stack[stack.length - 1]!;
      const successors = edges[frame.node]!;
      if (frame.cursor === successors.length) {
        finish.push(frame.node);
        stack.pop();
      } else {
        const next = successors[frame.cursor++]!;
        if (nodes[next]!.passThrough && !seen[next]!) {
          seen[next]! = true;
          stack.push({ node: next, cursor: 0 });
        }
      }
    }
  }

  const componentOf = Array.from({ length: nodes.length }, () => -1);
  const groups: number[][] = [];
  for (let cursor = finish.length - 1; cursor >= 0; cursor--) {
    const start = finish[cursor]!;
    if (componentOf[start]! !== -1) continue;
    const component = groups.length;
    const group: number[] = [];
    const queue = [start];
    componentOf[start]! = component;
    for (let head = 0; head < queue.length; head++) {
      const current = queue[head]!;
      group.push(current);
      for (const prior of reverse[current]!) {
        if (componentOf[prior]! === -1) {
          componentOf[prior]! = component;
          queue.push(prior);
        }
      }
    }
    groups.push(group);
  }

  const closed = groups.map((group, component) => group.every(from =>
    edges[from]!.length > 0 && edges[from]!.every(to =>
      nodes[to]!.passThrough && componentOf[to]! === component,
    ),
  ));
  const dependencies = groups.map((group, component) => {
    const outgoing = new Set<number>();
    for (const from of group) {
      for (const to of edges[from]!) {
        if (nodes[to]!.passThrough && componentOf[to]! !== component) {
          outgoing.add(componentOf[to]!);
        }
      }
    }
    return outgoing;
  });
  const dependents: number[][] = groups.map(() => []);
  const remaining = dependencies.map((outgoing, component) => {
    for (const successor of outgoing) dependents[successor]!.push(component);
    return outgoing.size;
  });
  const order: number[] = [];
  for (let component = 0; component < groups.length; component++) {
    if (remaining[component]! === 0) order.push(component);
  }
  for (let cursor = 0; cursor < order.length; cursor++) {
    for (const previous of dependents[order[cursor]!]!) {
      remaining[previous]!--;
      if (remaining[previous]! === 0) order.push(previous);
    }
  }
  return { groups, componentOf, order, closed };
}

interface SegmentKernel {
  /** Slots: physical exits, closed-class probabilities, transient visit rewards. */
  readonly rows: readonly Rational[][];
  readonly classCount: number;
  readonly classOfPass: readonly number[];
  readonly rewardSlot: readonly number[];
}

function segmentKernel(graph: PreparedGraph): SegmentKernel {
  const { nodes, edges, passes } = graph;
  const { groups, componentOf, order, closed } = components(graph);
  const classOfComponent = groups.map(() => -1);
  let classCount = 0;
  for (let component = 0; component < groups.length; component++) {
    if (closed[component]!) classOfComponent[component]! = classCount++;
  }
  const classOfPass = nodes.map(() => -1);
  const rewardSlot = nodes.map(() => -1);
  let width = nodes.length + classCount;
  for (const pass of passes) {
    const recurrentClass = classOfComponent[componentOf[pass]!]!;
    if (recurrentClass !== -1) classOfPass[pass]! = recurrentClass;
    else rewardSlot[pass]! = width++;
  }

  // entryRows[p] starts immediately after entering p, and includes that visit.
  const entryRows: Rational[][] = nodes.map(() => zeroVector(width));
  for (const component of order) {
    const group = groups[component]!;
    if (closed[component]!) {
      for (const pass of group) {
        entryRows[pass]![nodes.length + classOfComponent[component]!]! = ONE;
      }
      continue;
    }

    const within = new Map<number, number>();
    group.forEach((node, index) => within.set(node, index));
    const coefficients = group.map(() => zeroVector(group.length));
    const rhs = group.map(() => zeroVector(width));
    for (let local = 0; local < group.length; local++) {
      const pass = group[local]!;
      const degree = edges[pass]!.length;
      const diagonal = fraction(BigInt(Math.max(1, degree)));
      coefficients[local]![local]! = diagonal;
      rhs[local]![rewardSlot[pass]!]! = diagonal;
      if (degree === 0) {
        rhs[local]![pass]! = ONE;
      } else {
        // Multiply the whole row by degree: coefficients are integers and
        // there is one unweighted contribution for every selected edge.
        for (const next of edges[pass]!) {
          if (!nodes[next]!.passThrough) {
            rhs[local]![next]! = add(rhs[local]![next]!, ONE);
          } else if (componentOf[next]! === component) {
            const column = within.get(next)!;
            coefficients[local]![column]! = subtract(coefficients[local]![column]!, ONE);
          } else {
            addVector(rhs[local]!, entryRows[next]!);
          }
        }
      }
    }
    const solutions = solve(coefficients, rhs);
    group.forEach((node, local) => { entryRows[node]! = solutions[local]!; });
  }

  const rows = nodes.map(() => zeroVector(width));
  for (let start = 0; start < nodes.length; start++) {
    const successors = edges[start]!;
    if (successors.length === 0) {
      rows[start]![start]! = ONE;
      continue;
    }
    for (const next of successors) {
      if (nodes[next]!.passThrough) addVector(rows[start]!, entryRows[next]!);
      else rows[start]![next]! = add(rows[start]![next]!, ONE);
    }
    const degree = fraction(BigInt(successors.length));
    if (successors.length !== 1) {
      for (let column = 0; column < width; column++) {
        rows[start]![column]! = divide(rows[start]![column]!, degree);
      }
    }
  }
  return { rows, classCount, classOfPass, rewardSlot };
}

interface FaceRow {
  readonly landing: Rational[];
  nonTermination: Rational;
  readonly expectedPasses: ExpectedPasses[];
}

function expose(graph: PreparedGraph, rows: readonly FaceRow[]): BoardOdds {
  const result: BoardOdds = new Map();
  for (let start = 0; start < graph.nodes.length; start++) {
    const row = rows[start]!;
    const landing = new Map<string, Rational>();
    for (let node = 0; node < graph.nodes.length; node++) {
      landing.set(graph.nodes[node]!.id, copyFraction(row.landing[node]!));
    }
    const expectedPasses = new Map<string, ExpectedPasses>();
    for (let passIndex = 0; passIndex < graph.passes.length; passIndex++) {
      const value = row.expectedPasses[passIndex]!;
      expectedPasses.set(
        graph.nodes[graph.passes[passIndex]!]!.id,
        value === 'infinity' ? value : copyFraction(value),
      );
    }
    result.set(graph.nodes[start]!.id, {
      landing,
      nonTermination: copyFraction(row.nonTermination),
      expectedPasses,
    });
  }
  return result;
}

/** Return every face 0..maxFace, including every physical start and landing. */
export function referenceByFace(
  board: Board,
  maxFace: number,
  policy: BranchPolicy = 'uniform',
  target?: string,
): Map<number, BoardOdds> {
  if (!Number.isSafeInteger(maxFace) || maxFace < 0) {
    throw new Error('maxFace must be a nonnegative safe integer');
  }
  const graph = prepare(board, policy, target);
  const table = new Map<number, BoardOdds>();
  let previous: FaceRow[] = graph.nodes.map((_, start) => {
    const landing = zeroVector(graph.nodes.length);
    landing[start]! = ONE;
    return {
      landing,
      nonTermination: ZERO,
      expectedPasses: graph.passes.map(() => ZERO),
    };
  });
  table.set(0, expose(graph, previous));
  if (maxFace === 0) return table;

  const kernel = segmentKernel(graph);
  for (let face = 1; face <= maxFace; face++) {
    const current: FaceRow[] = graph.nodes.map((_, start) => {
      const segment = kernel.rows[start]!;
      const landing = zeroVector(graph.nodes.length);
      let nonTermination = ZERO;
      for (let recurrent = 0; recurrent < kernel.classCount; recurrent++) {
        nonTermination = add(nonTermination, segment[graph.nodes.length + recurrent]!);
      }
      // A pass-through physical exit can only be a dead end. Ordinary exits
      // use the previous layer, which also makes an ordinary dead end stay put.
      for (const pass of graph.passes) landing[pass]! = segment[pass]!;
      const expectedPasses: ExpectedPasses[] = graph.passes.map(pass => {
        const recurrent = kernel.classOfPass[pass]!;
        return recurrent === -1
          ? segment[kernel.rewardSlot[pass]!]!
          : segment[graph.nodes.length + recurrent]!.numerator > 0n ? 'infinity' : ZERO;
      });

      for (const ordinary of graph.ordinary) {
        const weight = segment[ordinary]!;
        if (weight.numerator === 0n) continue;
        const later = previous[ordinary]!;
        addScaledVector(landing, later.landing, weight);
        nonTermination = add(nonTermination, multiply(weight, later.nonTermination));
        for (let passIndex = 0; passIndex < graph.passes.length; passIndex++) {
          const immediate = expectedPasses[passIndex]!;
          const subsequent = later.expectedPasses[passIndex]!;
          if (immediate === 'infinity' || subsequent === 'infinity') {
            expectedPasses[passIndex]! = 'infinity';
          } else if (subsequent.numerator !== 0n) {
            expectedPasses[passIndex]! = add(immediate, multiply(weight, subsequent));
          }
        }
      }
      return { landing, nonTermination, expectedPasses };
    });
    table.set(face, expose(graph, current));
    previous = current;
  }
  return table;
}
