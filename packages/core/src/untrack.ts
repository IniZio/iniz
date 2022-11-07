class Untrack<TValue> {
  value: TValue;
  frozen: boolean = true;

  constructor(value: TValue, frozen: boolean = true) {
    this.value = value;
    this.frozen = frozen;
  }
}

export function isUntrack(value: any): value is Untrack<any> {
  return value instanceof Untrack;
}

export function untrack<TValue>(value: TValue, frozen: boolean = true) {
  return new Untrack(value, frozen) as unknown as TValue;
}
