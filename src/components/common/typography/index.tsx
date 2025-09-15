import { cn } from '@/utils/utils';
import type { TypographyProps } from './typography.types';

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
  10: 'text-[10px]',
  12: 'text-[12px]',
  14: 'text-[14px]',
  16: 'text-[16px]',
  18: 'text-[18px]',
  20: 'text-[20px]',
  22: 'text-[22px]',
  24: 'text-[24px]',
  26: 'text-[26px]',
  30: 'text-[30px]',
  32: 'text-[32px]',
  40: 'text-[40px]',
  41: 'text-[41px]',
  44: 'text-[44px]',
  64: 'text-[64px]',
};

export function Typography({
  as: Tag = 'p',
  type = 'body',
  size = 16,
  color,
  className,
  children,
  dangerouslySetInnerHTML,
  ...props
}: TypographyProps) {
  const font = type === 'heading' ? 'font-bebas' : 'font-onest';

  const textSize = sizeClassMap[size] ?? 'text-[16px]';

  if (dangerouslySetInnerHTML) {
    return (
      <Tag
        className={cn(font, textSize, color, className)}
        dangerouslySetInnerHTML={dangerouslySetInnerHTML}
        {...props}
      />
    );
  }

  return (
    <Tag className={cn(font, textSize, color, className)} {...props}>
      {children}
    </Tag>
  );
}
