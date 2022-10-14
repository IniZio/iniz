class Ref<TValue> {
  value: TValue;

  constructor(value: TValue) {
    this.value = value;
  }
}

export function isRef(value: any): value is Ref<any> {
  return value instanceof Ref;
}

export function ref<TValue>(value: TValue) {
  return new Ref(value) as unknown as TValue;
}
