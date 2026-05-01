import { useLocalSearchParams } from "expo-router";
import { PlayerScreen } from "@pages/player/PlayerScreen";

export default function PlayerRoute() {
  const { questionId, kiosk } = useLocalSearchParams<{
    questionId: string;
    kiosk?: string;
  }>();
  return <PlayerScreen questionId={questionId} kioskMode={kiosk === "1"} />;
}
