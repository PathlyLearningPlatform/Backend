export function emptyStringToNull<T>(value: T): T | null {
  if(typeof value === 'string') {
    if(value.length <= 0) {
      return null;
    }
  }

  return value;
}