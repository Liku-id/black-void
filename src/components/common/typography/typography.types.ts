// Typography component types
export type TypographyType = 'heading' | 'body';

// Font size - dynamic custom sizes
export type TypographySize = number;

// Color tokens for typography - using simple color names
export type TypographyColor =
  | 'text-white'
  | 'text-black'
  | 'text-red'
  | 'text-green';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  type?: TypographyType;
  size?: TypographySize;
  color?: TypographyColor;
  children: React.ReactNode;
}
