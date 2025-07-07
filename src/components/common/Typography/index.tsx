import { cn } from '@/lib/utils';
import type { TypographyProps } from './Typography.types';

/**
 * @example
 * // Basic text
 * <Typography>Hello world</Typography>
 * 
 * @example
 * // Heading
 * <Typography as="h1" type="heading" size={64}>Title</Typography>
 * 
 * @example
 * // Custom styling
 * <Typography className="text-blue-500">Blue text</Typography>
 */

// Define allowed font sizes in px
const sizeClassMap: Record<number, string> = {
  12: 'text-[12px]',
  14: 'text-[14px]',
  16: 'text-[16px]',
  24: 'text-[24px]',
  64: 'text-[64px]',
};

export function Typography({
  as: Tag = 'p',
  type = 'body',
  size = 16,
  color,
  className,
  children,
  ...props
}: TypographyProps) {
  const font = type === 'heading' ? 'font-bebas' : 'font-onest';

  // Get text size class from map, fallback to default
  const textSize = sizeClassMap[size] ?? 'text-[16px]';

  return (
    <Tag className={cn(font, textSize, color, className)} {...props}>
      {children}
    </Tag>
  );
}
