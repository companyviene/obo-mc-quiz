import { useLocalSearchParams } from 'expo-router';
import { ModuleScreen } from '@pages/module/ModuleScreen';

export default function ModuleRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ModuleScreen moduleId={id} />;
}
