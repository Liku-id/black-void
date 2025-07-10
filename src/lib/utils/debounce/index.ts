/* eslint-disable @typescript-eslint/no-explicit-any */
const debounce = <T extends (...args: any[]) => void>(
  func: T,
  timeout: number = 1000
): ((...args: Parameters<T>) => void) => {
  let timer: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    // Clear first
    clearTimeout(timer);

    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
};

export default debounce;
