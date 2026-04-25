import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from '@shared/design-system';
import { Spacing } from '@shared/design-system/tokens';
import { Txt } from './Txt';

interface Props {
  message?: string;
}

export function LoadingSpinner({ message }: Props) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.bgBase }]}>
      <ActivityIndicator size="large" color={theme.accent} />
      {message && <Txt variant="caption">{message}</Txt>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing[4],
  },
});
