import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@shared/design-system';
import { Txt } from '@shared/ui/Txt';

export default function NotFoundScreen() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: t('notFound.title') }} />
      <View style={[styles.container, { backgroundColor: theme.bgBase }]}>
        <Txt variant="h2">{t('notFound.title')}</Txt>
        <Link href="/" style={styles.link}>
          <Txt style={[styles.linkText, { color: theme.accent }]}>{t('notFound.backHome')}</Txt>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  link: { marginTop: 8 },
  linkText: { fontSize: 16 },
});
