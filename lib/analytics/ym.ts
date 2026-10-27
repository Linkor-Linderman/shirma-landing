export function sanitizeYmId(value: string | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return /^\d{1,15}$/.test(trimmed) ? trimmed : null;
}
