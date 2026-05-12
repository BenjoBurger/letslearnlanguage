import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, TextInput } from 'react-native';
import AppButton from '../../components/NWButton';
import ThemedText from '../../components/ThemedText';
import ThemedView from '../../components/ThemedView';
import { theme } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const onPress = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password);
    if (!mounted.current) return;
    setLoading(false);

    if (error) {
      Alert.alert('Sign up failed', error);
    } else {
      Alert.alert('Success', 'Check your email to verify your account', [
        {
          text: 'OK',
          onPress: () => router.replace('/auth/login'),
        },
      ]);
    }
  };

  const onSignIn = () => {
    router.back();
  };

  return (
    <ThemedView style={{ padding: 20, justifyContent: 'center' }}>
      <ThemedText style={{ fontSize: 28, color: theme.colors.primary, fontWeight: '700', marginBottom: 12 }}>
        Create Account
      </ThemedText>

      <ThemedText style={{ marginBottom: 16, color: theme.colors.ink }}>Join us to get started</ThemedText>

      <TextInput
        placeholder="Email"
        placeholderTextColor={'#999'}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
        style={{
          borderWidth: 1,
          borderColor: theme.colors.secondary,
          backgroundColor: '#fff',
          padding: 12,
          borderRadius: theme.radius.sm,
          marginBottom: 12,
        }}
      />

      <TextInput
        placeholder="Password (min 6 characters)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
        style={{
          borderWidth: 1,
          borderColor: theme.colors.secondary,
          backgroundColor: '#fff',
          padding: 12,
          borderRadius: theme.radius.sm,
          marginBottom: 12,
        }}
      />

      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        editable={!loading}
        style={{
          borderWidth: 1,
          borderColor: theme.colors.secondary,
          backgroundColor: '#fff',
          padding: 12,
          borderRadius: theme.radius.sm,
          marginBottom: 16,
        }}
      />

      <AppButton
        className="bg-secondary"
        title={loading ? 'Creating account...' : 'Sign up'}
        onPress={onPress}
        loading={loading}
      />

      <ThemedText style={{ marginTop: 16, textAlign: 'center', color: theme.colors.ink }}>
        Already have an account?{' '}
        <ThemedText style={{ color: theme.colors.primary, fontWeight: '600' }} onPress={onSignIn}>
          Sign in
        </ThemedText>
      </ThemedText>
    </ThemedView>
  );
}
