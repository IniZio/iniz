class RefV2<TValue> {
  value: TValue;

  constructor(value: TValue) {
    this.value = value;
  }
}

export function isRef(value: any): value is RefV2<any> {
  return value instanceof RefV2;
}

export function refV2<TValue>(value: TValue) {
  return new RefV2(value) as unknown as TValue;
}
