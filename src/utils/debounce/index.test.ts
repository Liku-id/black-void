import debounce from '.';

jest.useFakeTimers();

describe('debounce', () => {
  it('should call the function after the timeout', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 500);

    debouncedFn('hello');
    expect(mockFn).not.toBeCalled();

    jest.advanceTimersByTime(499);
    expect(mockFn).not.toBeCalled();

    jest.advanceTimersByTime(1);
    expect(mockFn).toBeCalledWith('hello');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should debounce multiple rapid calls into one', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 300);

    debouncedFn('a');
    debouncedFn('b');
    debouncedFn('c');

    jest.advanceTimersByTime(299);
    expect(mockFn).not.toBeCalled();

    jest.advanceTimersByTime(1);
    expect(mockFn).toBeCalledWith('c');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should use default timeout (1000ms) when not specified', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn);

    debouncedFn('default');

    jest.advanceTimersByTime(999);
    expect(mockFn).not.toBeCalled();

    jest.advanceTimersByTime(1);
    expect(mockFn).toBeCalledWith('default');
  });

  it('should cancel previous call if new one comes in before timeout', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 200);

    debouncedFn('1');
    jest.advanceTimersByTime(100); // 100ms passed

    debouncedFn('2');
    jest.advanceTimersByTime(100); // Still not enough to trigger
    expect(mockFn).not.toBeCalled();

    jest.advanceTimersByTime(100); // Total 200ms from 2nd call
    expect(mockFn).toBeCalledWith('2');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
