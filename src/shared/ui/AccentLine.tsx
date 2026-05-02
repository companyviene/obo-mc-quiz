import { Platform, StyleSheet, View } from 'react-native';
import { useTheme } from '@shared/design-system';
import { Radius, Size, Spacing } from '@shared/design-system/tokens';

// Web uses a CSS linear-gradient for the warm tri-color accent line.
// Native falls back to a flat color (expo-linear-gradient is not installed).

interface Props {
  color?: string;
  width?: number;
}

export function AccentLine({ color, width = Spacing[8] }: Props) {
  const theme = useTheme();
  const resolvedColor = color ?? theme.accent;
  const [hope, science, cosmos] = theme.moduleShades;

  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          styles.line,
          {
            width,
            // @ts-expect-error — web-only style property
            background: `linear-gradient(90deg, ${hope} 0%, ${science} 50%, ${cosmos} 100%)`,
          },
        ]}
      />
    );
  }

  return <View style={[styles.line, { backgroundColor: resolvedColor, width }]} />;
}

const styles = StyleSheet.create({
  line: {
    height: Size.accentLineHeight,
    borderRadius: Radius.full,
    marginBottom: Spacing[5],
  },
});
