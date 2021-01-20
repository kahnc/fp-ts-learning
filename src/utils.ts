
export function len(n: string): number { return n.length }

export function sum(ns: number[]) { return ns.reduce((sum, n) => sum + n, 0) }

export function double(x: number) { return x + x; }

export function add(x: number) { return (y: number) => x + y; }

export function boundScore (min: number, max: number) {
  return (score: number) => Math.max(min, Math.min(max, score));
}