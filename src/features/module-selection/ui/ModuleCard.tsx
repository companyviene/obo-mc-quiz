import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { Module } from '@entities/module';
import { IconSize, Radius, Shadow, Size, Spacing, cardStyles, useTheme } from '@shared/design-system';
import { FontFamily, FontSize } from '@shared/design-system/tokens';
import { Txt } from '@shared/ui/Txt';

interface Props {
  module: Module;
  onPress: (moduleId: string) => void;
}

export function ModuleCard({ module, onPress }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();
  const accentColor = theme.moduleShades[module.accentIndex];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.bgSurface },
        pressed && cardStyles.pressed,
      ]}
      onPress={() => onPress(module.id)}
      accessibilityRole="button"
      accessibilityLabel={module.title}
    >
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
      <View style={styles.body}>
        <Txt variant="h3" numberOfLines={2}>
          {module.title}
        </Txt>
        <Txt variant="body" numberOfLines={2}>
          {module.description}
        </Txt>
        <View style={styles.footer}>
          <View style={[styles.countPill, { backgroundColor: theme.accentTint }]}>
            <Txt style={[styles.countText, { color: theme.accent }]}>
              {t('module.questionCount', { count: module.questions.length })}
            </Txt>
          </View>
          <ChevronRight size={IconSize.sm} color={theme.textMuted} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing[4],
    ...Shadow.sm,
  },
  accentBar: {
    width: Size.accentBarWidth,
  },
  body: {
    flex: 1,
    padding: Spacing[5],
    gap: Spacing[2],
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing[2],
  },
  countPill: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
  },
  countText: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize.xs,
  },
});
