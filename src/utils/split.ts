// Largest remainder distribution over integer minor units
export function largestRemainder(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a,b)=>a+b,0);
  if (sum <= 0) return weights.map(()=>0);
  const raw = weights.map(w => (total * w) / sum);
  const base = raw.map(v => Math.floor(v));
  let rem = total - base.reduce((a,b)=>a+b,0);
  const rank = raw.map((v,i)=>({i, frac: v - Math.floor(v)})).sort((a,b)=>b.frac - a.frac);
  const out = [...base];
  for (let k=0; k<rem; k++) out[rank[k % rank.length].i] += 1;
  return out;
}

export function equalSplit(total: number, n: number): number[] {
  return largestRemainder(total, Array.from({length:n}, () => 1));
}
