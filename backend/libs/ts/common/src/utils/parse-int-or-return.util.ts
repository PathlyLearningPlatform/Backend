export function parseIntOrReturn(value?: unknown): number | string | undefined {
  if (!value) {
    return undefined;
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  const parsed = parseInt(value, 10);

  if (Number.isNaN(parsed)) {
    return value;
  } else {
    return parsed;
  }
}