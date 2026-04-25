import {
  AlertTriangle,
  CheckCircle,
  Cloud,
  Download,
  type LucideIcon,
} from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { VideoStatus } from '@entities/video';
import { IconSize, useTheme, type ThemeColors } from '@shared/design-system';
import { FontFamily, FontSize, Radius, Size, Spacing } from '@shared/design-system/tokens';
import { Txt } from './Txt';

interface Props {
  status: VideoStatus;
  progress?: number;
}

type StatusConfig = {
  icon: LucideIcon;
  textKey: keyof ThemeColors;
  bgKey: keyof ThemeColors;
  labelKey: string | null;
};

const STATUS_CONFIG: Record<VideoStatus, StatusConfig> = {
  [VideoStatus.Cached]: {
    icon: CheckCircle,
    textKey: 'statusOk',
    bgKey: 'statusOkBg',
    labelKey: 'offline.cached',
  },
  [VideoStatus.Downloading]: {
    icon: Download,
    textKey: 'statusWarn',
    bgKey: 'statusWarnBg',
    labelKey: null,
  },
  [VideoStatus.Remote]: {
    icon: Cloud,
    textKey: 'statusNeutral',
    bgKey: 'statusNeutralBg',
    labelKey: null,
  },
  [VideoStatus.Error]: {
    icon: AlertTriangle,
    textKey: 'statusError',
    bgKey: 'statusErrorBg',
    labelKey: null,
  },
};

export function OfflineBadge({ status, progress }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  const color = theme[config.textKey] as string;

  const label =
    status === VideoStatus.Downloading && progress !== undefined
      ? `${Math.round(progress * 100)}%`
      : config.labelKey
        ? t(config.labelKey as Parameters<typeof t>[0])
        : null;

  return (
    <View style={[styles.badge, { backgroundColor: theme[config.bgKey] as string }]}>
      <Icon size={IconSize.xs} color={color} />
      {label && <Txt style={[styles.label, { color }]}>{label}</Txt>}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
    paddingHorizontal: Spacing[2],
    paddingVertical: Size.badgePaddingVertical,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  label: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize.xs,
  },
});
