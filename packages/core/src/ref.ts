class Ref<TValue> {
  value: TValue;
  frozen: boolean = true;

  constructor(value: TValue, frozen: boolean = true) {
    this.value = value;
    this.frozen = frozen;
  }
}

export function isRef(value: any): value is Ref<any> {
  return value instanceof Ref;
}

export function ref<TValue>(value: TValue, frozen: boolean = true) {
  return new Ref(value, frozen) as unknown as TValue;
}
