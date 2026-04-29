import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';

interface Props {
  uri: string;
}

type OrientationExtended = ScreenOrientation & {
  lock?: (orientation: string) => Promise<void>;
  unlock?: () => void;
};

function lockLandscape(): void {
  if (Platform.OS !== 'web') return;
  const orientation = (typeof screen !== 'undefined' ? screen.orientation : null) as OrientationExtended | null;
  orientation?.lock?.('landscape-primary')?.catch(() => {});
}

function unlockOrientation(): void {
  if (Platform.OS !== 'web') return;
  const orientation = (typeof screen !== 'undefined' ? screen.orientation : null) as OrientationExtended | null;
  orientation?.unlock?.();
}

export function FullScreenPlayer({ uri }: Props) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
    p.play();
  });

  useEffect(() => {
    if (Platform.OS !== 'web') {
      StatusBar.setHidden(true);
    }
    return () => {
      if (Platform.OS !== 'web') {
        StatusBar.setHidden(false);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture={false}
        contentFit="contain"
        nativeControls
        onFullscreenEnter={lockLandscape}
        onFullscreenExit={unlockOrientation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
  },
  video: {
    flex: 1,
  },
});
