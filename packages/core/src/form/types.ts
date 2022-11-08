type ExtractReturnTypes<T extends (((i: any) => any) | undefined)[]> = {
  [K in keyof T]: T[K] extends (i: any) => infer R ? Awaited<R> : never;
};

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

/**
 * Here we cast array of validators to object of all validation results
 * 1. ExtractReturnTypes to derive array of return types for all validators
 * 2. `[number]` to change the array to union type
 * 3. Exclude null | undefined to avoid the type become never
 * 4. UnionToIntersection to merge into intersection object
 */
export type ValidationErrors<T extends (((i: any) => any) | undefined)[] | undefined> = UnionToIntersection<
  Exclude<
    ExtractReturnTypes<Exclude<T, undefined>>[number],
    null | undefined
  >
  > extends infer O
  ? { [K in keyof O]?: O[K] | undefined }
  : never;
