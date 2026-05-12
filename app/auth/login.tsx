import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, TextInput } from 'react-native';
import AppButton from '../../components/NWButton';
import ThemedText from '../../components/ThemedText';
import ThemedView from '../../components/ThemedView';
import { theme } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !authLoading) {
      router.replace('/main');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <ThemedView style={{ padding: 20, justifyContent: 'center' }}>
        <ThemedText style={{ fontSize: 24, color: theme.colors.primary, fontWeight: '700' }}>
          Loading...
        </ThemedText>
      </ThemedView>
    );
  }

  if (user) return null;

  const onPress = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Sign in failed', error);
    }
  };

  const onSignUp = () => {
    router.push('/auth/signup');
  };

  return (
    <ThemedView style={{ padding: 20, justifyContent: 'center' }}>
      <ThemedText style={{ fontSize: 28, color: theme.colors.primary, fontWeight: '700', marginBottom: 12 }}>
        Welcome back!
      </ThemedText>

      <ThemedText style={{ marginBottom: 16, color: theme.colors.ink }}>Sign in to your account</ThemedText>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
        style={{
          borderWidth: 1,
          borderColor: theme.colors.primary,
          backgroundColor: '#fff',
          padding: 12,
          borderRadius: theme.radius.sm,
          marginBottom: 12,
        }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
        style={{
          borderWidth: 1,
          borderColor: theme.colors.primary,
          backgroundColor: '#fff',
          padding: 12,
          borderRadius: theme.radius.sm,
          marginBottom: 16,
        }}
      />

      <AppButton
        className="bg-primary"
        title={loading ? 'Signing in...' : 'Sign in'}
        onPress={onPress}
        loading={loading}
      />

      <ThemedText style={{ marginTop: 16, textAlign: 'center', color: theme.colors.ink }}>
        Don&apos;t have an account?{' '}
        <ThemedText style={{ color: theme.colors.secondary, fontWeight: '600' }} onPress={onSignUp}>
          Sign up
        </ThemedText>
      </ThemedText>
    </ThemedView>
  );
}
