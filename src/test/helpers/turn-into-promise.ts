export const turnIntoPromise = <T>(fn: () => T) =>
  new Promise<T>((resolve) => resolve(fn()));
