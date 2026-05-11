import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import AppButton from '../../components/NWButton';
import ThemedText from '../../components/ThemedText';
import ThemedView from '../../components/ThemedView';
import UsernameOverlay from '../../components/UsernameOverlay';
import { theme } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
 

export default function MainMenu() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/auth/login');
  };

  return (
    <ThemedView style={{ padding: theme.spacing.md, justifyContent: 'center' }}>
      <ThemedText style={{ fontSize: 28, marginBottom: 18, fontWeight: '700', color: theme.colors.primary }}>
        Hello{user ? `, ${user.displayName ?? user.email}` : ''}!
      </ThemedText>

      <UsernameOverlay />

      <View style={{ marginVertical: 8 }}>
        <AppButton className="bg-secondary" title="Add Lesson" onPress={() => router.push('/main/add-lesson')} />
      </View>

      <View style={{ marginVertical: 8 }}>
        <AppButton className="bg-primary" title="Start Quiz" onPress={() => router.push('/main/quiz')} />
      </View>

      <View style={{ marginVertical: 8 }}>
        <AppButton className="bg-accent" title="Settings" onPress={() => router.push('/main/settings')} />
      </View>

      <View style={{ marginVertical: 8 }}>
        <AppButton className="bg-ink" title="Sign out" onPress={handleSignOut} />
      </View>
    </ThemedView>
  );
}
