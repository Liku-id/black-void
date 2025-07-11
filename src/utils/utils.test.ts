import { cn } from './utils';

describe('cn utility function', () => {
  it('combines class names correctly', () => {
    const result = cn('class1', 'class2', 'class3');
    expect(result).toBe('class1 class2 class3');
  });

  it('handles undefined values', () => {
    const result = cn('class1', undefined, 'class3');
    expect(result).toBe('class1 class3');
  });

  it('handles null values', () => {
    const result = cn('class1', null, 'class3');
    expect(result).toBe('class1 class3');
  });

  it('handles false values', () => {
    const result = cn('class1', false, 'class3');
    expect(result).toBe('class1 class3');
  });

  it('handles empty strings', () => {
    const result = cn('class1', '', 'class3');
    expect(result).toBe('class1 class3');
  });

  it('handles mixed valid and invalid values', () => {
    const result = cn('class1', undefined, null, false, '', 'class2');
    expect(result).toBe('class1 class2');
  });

  it('handles single class name', () => {
    const result = cn('single-class');
    expect(result).toBe('single-class');
  });

  it('handles no arguments', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('handles only invalid arguments', () => {
    const result = cn(undefined, null, false, '');
    expect(result).toBe('');
  });

  it('merges Tailwind classes correctly', () => {
    const result = cn('px-4 py-2', 'px-6');
    expect(result).toBe('py-2 px-6');
  });

  it('handles conditional classes', () => {
    const isActive = true;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toBe('base-class active-class');
  });

  it('handles conditional classes with false condition', () => {
    const isActive = false;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toBe('base-class');
  });
});
