/**
 * Removes empty slots from inventory.
 * If a slot in inventory is empty, GW2 API returns null in its place, thus we remove all the nulls
 */
export const removeEmptySlots = <T>(slots: (T | null)[]) => {
  return slots.filter(notEmpty);
};

const notEmpty = <TValue>(
  value: TValue | null | undefined
): value is TValue => {
  return value !== null && value !== undefined;
};
