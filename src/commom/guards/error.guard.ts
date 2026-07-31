export function isMongoError(error: unknown): error is { code: number } {
  return typeof error === 'object' && error !== null && 'code' in error;
}
