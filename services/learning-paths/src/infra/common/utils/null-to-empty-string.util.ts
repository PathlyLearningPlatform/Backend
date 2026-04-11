export function nullToEmptyString<T>(value: T | null): T | '' {
  if(value === null) {
    return '';
  }

  return value;
}