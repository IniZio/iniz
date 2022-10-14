export function isClass(value: any) {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    value.constructor.name !== "Object" &&
    Object.isExtensible(value)
  );
}

export function arrayStartsWith(a: any[], b: any[]) {
  return b.every((bv, index) => bv === a[index]);
}
