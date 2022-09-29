export function isClass(value: any) {
  return typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    value.constructor.name !== 'Object' &&
    Object.isExtensible(value);
}

export function canProxy(value: any) {
  return value !== undefined &&
    typeof value === 'object' &&
      (
        !isClass(value) ||
        (
          !(value instanceof Map) &&
          !(value instanceof Set) &&
          !(value instanceof WeakMap) &&
          !(value instanceof WeakSet) &&
          !(value instanceof Error) &&
          !(value instanceof Number) &&
          !(value instanceof Date) &&
          !(value instanceof String) &&
          !(value instanceof RegExp) &&
          !(value instanceof ArrayBuffer)
        )
    );
}

export function arrayStartsWith(a: any[], b: any[]) {
  return b.every((bv, index) => bv === a[index]);
}
