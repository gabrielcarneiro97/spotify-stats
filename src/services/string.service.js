export function maxLength(string, maxParam) {
  const max = maxParam || 21;

  if (string.length <= max) return string;

  return `${string.slice(0, max - 3)}...`;
}

export function a() {}
