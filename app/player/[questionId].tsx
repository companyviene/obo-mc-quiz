import { useLocalSearchParams } from 'expo-router';
import { PlayerScreen } from '@pages/player/PlayerScreen';

export default function PlayerRoute() {
  const { questionId } = useLocalSearchParams<{ questionId: string }>();
  return <PlayerScreen questionId={questionId} />;
}
