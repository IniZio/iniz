export type FilterFirstElement<T extends unknown[]> = T extends [
  unknown,
  ...infer R
]
  ? R
  : [];
