function minValidator<T>(min: T) {
  return ({ value }: { value: T }) =>
    value < min ? { min: { min, actual: value } } : null;
}

function maxValidator<T>(max: T) {
  return ({ value }: { value: T }) =>
    value > max ? { max: { max: max, actual: value } } : null;
}

function minLengthValidator<T extends { length: number }>(minLength: number) {
  return ({ value }: { value: T }) =>
    value.length < minLength
      ? { minLength: { minLength: minLength, actual: value.length } }
      : null;
}

function maxLengthValidator<T extends { length: number }>(maxLength: number) {
  return ({ value }: { value: T }) =>
    value.length > maxLength
      ? { maxLength: { maxLength: maxLength, actual: value.length } }
      : null;
}

function requiredValidator<T>() {
  return ({ value }: { value: T }) =>
    value === null || (Array.isArray(value) && value.length === 0)
      ? { required: true }
      : null;
}

export const validators = {
  min: minValidator,
  max: maxValidator,
  minLength: minLengthValidator,
  maxLength: maxLengthValidator,
  required: requiredValidator,
};
