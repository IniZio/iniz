function minValidator<T>(min: T) {
  return ({ value }: { value: T }) =>
    value < min ? { min: { min, actual: value } } : null;
}

function maxValidator<T>(max: T) {
  return ({ value }: { value: T }) =>
    value > max ? { max: { max: max, actual: value } } : null;
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
  required: requiredValidator,
};
