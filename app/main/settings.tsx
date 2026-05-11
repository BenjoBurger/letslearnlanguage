import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, TextInput, View } from 'react-native';
import AppButton from '../../components/NWButton';
import ThemedText from '../../components/ThemedText';
import ThemedView from '../../components/ThemedView';
import { theme } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';

export default function SettingsScreen() {
  const { user, updateEmail, updatePassword, signOut } = useAuth();
  const router = useRouter();
  const mounted = useRef(true);
  const [username, setUsername] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleUpdateEmail = async () => {
    if (!email || email === user?.email) {
      Alert.alert('Error', 'Please enter a new email address');
      return;
    }
    setSaving(true);
    const { error } = await updateEmail(email);
    if (!mounted.current) return;
    setSaving(false);
    if (error) {
      Alert.alert('Error', error);
    } else {
      Alert.alert('Success', 'Email updated. Check your inbox for confirmation.');
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please enter and confirm your new password');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    setSaving(true);
    const { error } = await updatePassword(newPassword);
    if (!mounted.current) return;
    setSaving(false);
    if (error) {
      Alert.alert('Error', error);
    } else {
      Alert.alert('Success', 'Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/auth/login');
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ThemedView style={{ flex: 1, padding: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <ThemedText style={{ fontSize: 24, fontWeight: '700' }}>Settings</ThemedText>
          <AppButton outline borderColor={theme.colors.primary} title="Back" onPress={() => router.back()} style={{ paddingVertical: 8, paddingHorizontal: 12 }} />
        </View>

        {/* Display Name */}
        <ThemedText style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Display Name</ThemedText>
        <ThemedView style={{ flex: 0, marginBottom: 20, backgroundColor: '#fff', borderRadius: 8, padding: 12 }}>
          <TextInput
            placeholder="Display name"
            value={username}
            editable={false}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.primary,
              backgroundColor: '#f5f5f5',
              padding: 10,
              borderRadius: theme.radius.sm,
              color: '#999',
            }}
          />
          <ThemedText style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
            Display name cannot be changed after creation
          </ThemedText>
        </ThemedView>

        {/* Email */}
        <ThemedText style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Email</ThemedText>
        <ThemedView style={{ flex: 0, marginBottom: 12, backgroundColor: '#fff', borderRadius: 8, padding: 12 }}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={true}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.primary,
              backgroundColor: '#fff',
              padding: 10,
              borderRadius: theme.radius.sm,
            }}
          />
        </ThemedView>
        <AppButton
          className="bg-primary"
          title={saving ? 'Updating...' : 'Update Email'}
          onPress={handleUpdateEmail}
          loading={saving}
        />

        {/* Password */}
        <ThemedText style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, marginTop: 20 }}>
          Change Password
        </ThemedText>
        <ThemedView style={{ flex: 0, marginBottom: 12, backgroundColor: '#fff', borderRadius: 8, padding: 12 }}>
          <TextInput
            placeholder="New password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            style={{
              borderWidth: 1,
              borderColor: theme.colors.primary,
              backgroundColor: '#fff',
              padding: 10,
              borderRadius: theme.radius.sm,
              marginBottom: 10,
            }}
          />
          <TextInput
            placeholder="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={{
              borderWidth: 1,
              borderColor: theme.colors.primary,
              backgroundColor: '#fff',
              padding: 10,
              borderRadius: theme.radius.sm,
            }}
          />
        </ThemedView>
        <AppButton
          className="bg-primary"
          title={saving ? 'Updating...' : 'Update Password'}
          onPress={handleUpdatePassword}
          loading={saving}
        />

        {/* Sign Out */}
        <AppButton
          outline
          borderColor={theme.colors.primary}
          title="Sign Out"
          onPress={handleSignOut}
          style={{ marginTop: 20, marginBottom: 30 }}
        />
      </ThemedView>
    </ScrollView>
  );
}
