// Largest remainder distribution over integer minor units
export function largestRemainder(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum <= 0) return weights.map(() => 0);
  const raw = weights.map(w => (total * w) / sum);
  const base = raw.map(v => Math.floor(v));
  const remainder = total - base.reduce((a, b) => a + b, 0);
  const ranked = raw.map((v, i) => ({ index: i, fraction: v - Math.floor(v) })).sort((a, b) => b.fraction - a.fraction);
  const result = [...base];
  for (let k = 0; k < Math.min(remainder, ranked.length); k++) {
    result[ranked[k].index] += 1;
  }
  return result;
}

export function equalSplit(total: number, n: number): number[] {
  return largestRemainder(total, Array.from({ length: n }, () => 1));
}

export function weightsSplit(total: number, weights: number[]): number[] {
  const cleanedWeights = weights.map(w => Math.max(0, Number.isFinite(w) ? w : 0));
  const sum = cleanedWeights.reduce((a, b) => a + b, 0);
  if (sum <= 0) return weights.map(() => 0);
  return largestRemainder(total, cleanedWeights);
}

export function sumEquals(total: number, parts: number[]): boolean {
  const sum = parts.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);
  return sum === total;
}
