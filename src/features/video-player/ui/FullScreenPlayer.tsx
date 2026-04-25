import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';

interface Props {
  uri: string;
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
