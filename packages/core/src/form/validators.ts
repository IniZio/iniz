function minValidator<T>(min: T) {
  return ({ value }: { value: T }) =>
    value < min ? { min: { min, actual: value } } : null;
}

function maxValidator<T>(max: T) {
  return ({ value }: { value: T }) =>
    value > max ? { max: { max: max, actual: value } } : null;
}

function minLengthValidator<T extends { length: number }>(minLength: number) {
  return ({ value }: { value?: T }) =>
    (value?.length ?? 0) < minLength
      ? { minLength: { minLength: minLength, actual: value?.length ?? 0 } }
      : null;
}

function maxLengthValidator<T extends { length: number }>(maxLength: number) {
  return ({ value }: { value?: T }) =>
    (value?.length ?? 0) > maxLength
      ? { maxLength: { maxLength: maxLength, actual: value?.length ?? 0 } }
      : null;
}

function requiredValidator<T>() {
  return ({ value }: { value?: T }) =>
    value === null ||
    value === undefined ||
    (Array.isArray(value) && value.length === 0)
      ? { required: true }
      : null;
}

function patternValidator(regex: string | RegExp) {
  return ({ value }: { value?: string }) =>
    typeof value !== "string" || !new RegExp(regex).test(value)
      ? { pattern: true }
      : null;
}

export const validators = {
  min: minValidator,
  max: maxValidator,
  minLength: minLengthValidator,
  maxLength: maxLengthValidator,
  required: requiredValidator,
  pattern: patternValidator,
};
