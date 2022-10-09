export const IS_REF = Symbol("IS_REF");

class Ref<TValue> {
  [IS_REF] = true;

  value: TValue;

  constructor(value: TValue) {
    this.value = value;
  }
}

export function ref<TValue>(value: TValue) {
  return new Ref(value) as unknown as TValue;
}
