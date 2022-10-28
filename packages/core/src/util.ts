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

// export const set = (obj: any, pathArray: any[], value: any) => {
//   const cursor = get(obj, pathArray.slice(0, -1));
//   if (!cursor) return;

//   cursor[pathArray.slice(-1)[0]] = value;
// };

export const get = (obj: any, pathArray: any[]) => {
  let cursor = obj;
  for (const prop of pathArray) {
    cursor = obj[prop];
    if (!cursor) return undefined;
  }
  return cursor;
};
