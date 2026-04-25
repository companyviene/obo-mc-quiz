import { StyleSheet, View } from 'react-native';
import { useTheme } from '@shared/design-system';
import { Radius, Size, Spacing } from '@shared/design-system/tokens';

interface Props {
  color?: string;
  width?: number;
}

export function AccentLine({ color, width = Spacing[8] }: Props) {
  const theme = useTheme();
  const resolvedColor = color ?? theme.accent;

  return <View style={[styles.line, { backgroundColor: resolvedColor, width }]} />;
}

const styles = StyleSheet.create({
  line: {
    height: Size.accentLineHeight,
    borderRadius: Radius.full,
    marginBottom: Spacing[5],
  },
});
