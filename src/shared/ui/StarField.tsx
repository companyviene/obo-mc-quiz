import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '@shared/design-system';

// Fixed seed so the star positions are deterministic (no layout thrash on re-render).
const STARS: { cx: number; cy: number; r: number; opacity: number }[] = [
  { cx: 8,   cy: 14,  r: 1.2, opacity: 0.55 },
  { cx: 23,  cy: 5,   r: 0.8, opacity: 0.40 },
  { cx: 37,  cy: 19,  r: 1.0, opacity: 0.50 },
  { cx: 52,  cy: 8,   r: 0.6, opacity: 0.35 },
  { cx: 68,  cy: 22,  r: 1.4, opacity: 0.60 },
  { cx: 80,  cy: 4,   r: 0.8, opacity: 0.45 },
  { cx: 91,  cy: 16,  r: 1.0, opacity: 0.40 },
  { cx: 15,  cy: 34,  r: 0.6, opacity: 0.30 },
  { cx: 44,  cy: 38,  r: 1.2, opacity: 0.50 },
  { cx: 60,  cy: 30,  r: 0.8, opacity: 0.38 },
  { cx: 76,  cy: 42,  r: 1.0, opacity: 0.45 },
  { cx: 5,   cy: 48,  r: 0.7, opacity: 0.32 },
  { cx: 29,  cy: 52,  r: 1.4, opacity: 0.55 },
  { cx: 87,  cy: 58,  r: 0.6, opacity: 0.28 },
  { cx: 55,  cy: 60,  r: 0.9, opacity: 0.42 },
];

const TILE_W = 100;
const TILE_H = 70;

interface Props {
  opacity?: number;
}

export function StarField({ opacity = 1 }: Props) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { opacity }]} pointerEvents="none">
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${TILE_W} ${TILE_H}`}
        preserveAspectRatio="xMidYMid repeat"
        style={StyleSheet.absoluteFillObject}
      >
        {STARS.map((s, i) => (
          <Circle
            key={i}
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill={theme.accent}
            opacity={s.opacity}
          />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
});
