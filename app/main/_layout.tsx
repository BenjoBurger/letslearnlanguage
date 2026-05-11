import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="add-lesson" />
      <Stack.Screen name="quiz" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
