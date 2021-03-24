/**
 * To be used together with try-catch!
 * Extracts message from argument if it contains one.
 * Otherwise returns default message.
 */
export function getErrorMessageOrCreateDefault(error: any) {
  return error?.message ?? "Unexpected error";
}
