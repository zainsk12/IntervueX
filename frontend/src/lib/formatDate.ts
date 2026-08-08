/**
 * Formats an ISO date string for display (e.g. "Aug 9, 2026, 3:45 PM").
 * Falls back to the raw input string if it cannot be parsed/formatted.
 */
export function formatDateTime(value: string): string {
  try {
    return new Date(value).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return value
  }
}