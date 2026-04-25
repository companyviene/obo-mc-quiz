import { Text, type TextProps, type TextStyle } from 'react-native';
import { textStyles, useTheme, type ThemeColors } from '@shared/design-system';

type Variant = keyof typeof textStyles;

interface Props extends TextProps {
  variant?: Variant;
  style?: TextStyle | TextStyle[];
}

const TEXT_COLOR_MAP: Record<Variant, keyof ThemeColors> = {
  brand: 'accent',
  h1: 'textPrimary',
  h2: 'textPrimary',
  h3: 'textPrimary',
  body: 'textSecondary',
  bodyMedium: 'textPrimary',
  caption: 'textMuted',
  label: 'textMuted',
};

export function Txt({ variant = 'body', style, ...rest }: Props) {
  const theme = useTheme();
  const color = theme[TEXT_COLOR_MAP[variant]] as string;

  return <Text style={[textStyles[variant], { color }, style]} {...rest} />;
}
