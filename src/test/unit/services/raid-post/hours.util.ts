export const addHours = (date: Date, hours: number) => {
  const copy = new Date(date);
  copy.setTime(copy.getTime() + hours * 60 * 60 * 1000);
  return copy;
};

export const subtractHours = (date: Date, hours: number) => {
  return addHours(date, -hours);
};
