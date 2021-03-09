/**
 * Checks whether given date is in the past
 */
export const isDateInThePast = (date: Date) => {
  return new Date() > date;
};
