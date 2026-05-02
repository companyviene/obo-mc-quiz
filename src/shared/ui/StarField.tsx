import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const LOGO_YELLOW = '#F5C020';
const LOGO_GREEN  = '#3EA84E';
const LOGO_BLUE   = '#2872C8';
const COLORS = [LOGO_YELLOW, LOGO_GREEN, LOGO_BLUE] as const;

// Bubbles spread across a 1000×800 canvas (same aspect as a typical screen).
// The SVG fills the parent with preserveAspectRatio="xMidYMid slice" so all
// positions are visible regardless of device size.
const BUBBLES: { cx: number; cy: number; r: number; opacity: number; color: 0 | 1 | 2 }[] = [
  // top band
  { cx: 50,  cy: 40,  r: 9,  opacity: 0.30, color: 0 },
  { cx: 190, cy: 20,  r: 6,  opacity: 0.22, color: 1 },
  { cx: 320, cy: 55,  r: 14, opacity: 0.28, color: 2 },
  { cx: 480, cy: 15,  r: 7,  opacity: 0.20, color: 0 },
  { cx: 620, cy: 50,  r: 12, opacity: 0.32, color: 1 },
  { cx: 760, cy: 25,  r: 8,  opacity: 0.24, color: 2 },
  { cx: 870, cy: 60,  r: 11, opacity: 0.28, color: 0 },
  { cx: 970, cy: 10,  r: 6,  opacity: 0.18, color: 1 },
  // upper-mid band
  { cx: 120, cy: 150, r: 8,  opacity: 0.22, color: 2 },
  { cx: 260, cy: 130, r: 15, opacity: 0.30, color: 0 },
  { cx: 420, cy: 160, r: 6,  opacity: 0.20, color: 1 },
  { cx: 560, cy: 120, r: 11, opacity: 0.26, color: 2 },
  { cx: 700, cy: 155, r: 9,  opacity: 0.24, color: 0 },
  { cx: 840, cy: 135, r: 13, opacity: 0.30, color: 1 },
  { cx: 950, cy: 160, r: 7,  opacity: 0.18, color: 2 },
  // mid band
  { cx: 30,  cy: 280, r: 10, opacity: 0.26, color: 1 },
  { cx: 170, cy: 260, r: 7,  opacity: 0.20, color: 2 },
  { cx: 340, cy: 295, r: 16, opacity: 0.28, color: 0 },
  { cx: 500, cy: 270, r: 8,  opacity: 0.22, color: 1 },
  { cx: 650, cy: 290, r: 12, opacity: 0.28, color: 2 },
  { cx: 790, cy: 260, r: 6,  opacity: 0.18, color: 0 },
  { cx: 920, cy: 285, r: 9,  opacity: 0.24, color: 1 },
  // lower-mid band
  { cx: 80,  cy: 420, r: 13, opacity: 0.28, color: 2 },
  { cx: 230, cy: 400, r: 6,  opacity: 0.18, color: 0 },
  { cx: 390, cy: 435, r: 10, opacity: 0.24, color: 1 },
  { cx: 540, cy: 410, r: 15, opacity: 0.30, color: 2 },
  { cx: 690, cy: 430, r: 7,  opacity: 0.20, color: 0 },
  { cx: 810, cy: 405, r: 11, opacity: 0.26, color: 1 },
  { cx: 960, cy: 425, r: 8,  opacity: 0.22, color: 2 },
  // bottom band
  { cx: 40,  cy: 560, r: 9,  opacity: 0.22, color: 0 },
  { cx: 160, cy: 540, r: 14, opacity: 0.28, color: 1 },
  { cx: 300, cy: 570, r: 6,  opacity: 0.18, color: 2 },
  { cx: 460, cy: 550, r: 11, opacity: 0.24, color: 0 },
  { cx: 610, cy: 575, r: 16, opacity: 0.30, color: 1 },
  { cx: 750, cy: 545, r: 7,  opacity: 0.20, color: 2 },
  { cx: 890, cy: 565, r: 10, opacity: 0.26, color: 0 },
  // very bottom
  { cx: 100, cy: 700, r: 12, opacity: 0.24, color: 1 },
  { cx: 280, cy: 720, r: 8,  opacity: 0.20, color: 2 },
  { cx: 450, cy: 695, r: 14, opacity: 0.26, color: 0 },
  { cx: 620, cy: 715, r: 6,  opacity: 0.18, color: 1 },
  { cx: 780, cy: 700, r: 9,  opacity: 0.22, color: 2 },
  { cx: 930, cy: 720, r: 13, opacity: 0.24, color: 0 },
];

interface Props {
  opacity?: number;
}

export function StarField({ opacity = 1 }: Props) {
  return (
    <View style={[styles.container, { opacity }]} pointerEvents="none">
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 1000 800"
        preserveAspectRatio="xMidYMid slice"
        style={StyleSheet.absoluteFillObject}
      >
        {BUBBLES.map((b, i) => (
          <Circle
            key={i}
            cx={b.cx}
            cy={b.cy}
            r={b.r}
            fill={COLORS[b.color]}
            opacity={b.opacity}
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
