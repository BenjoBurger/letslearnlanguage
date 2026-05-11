import React, { useEffect, useState } from 'react';
import { Alert, Modal, TextInput, View } from 'react-native';
import { theme } from '../constants/theme';
import { useAuth } from '../hooks/useAuth';
import AppButton from './NWButton';
import ThemedText from './ThemedText';
import ThemedView from './ThemedView';

export default function UsernameOverlay() {
  const { user, updateProfile } = useAuth();
  const [username, setUsername] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.displayName) setUsername(user.displayName);
  }, [user]);

  if (user?.displayName) return null;

  const onSave = async () => {
    if (!username) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }
    setSaving(true);
    const { error } = await updateProfile(username);
    setSaving(false);
    if (error) {
      Alert.alert('Error', error);
    } else {
      Alert.alert('Saved', 'Your display name has been set');
    }
  };

  return (
    <Modal 
      visible 
      transparent 
      animationType="fade"
      presentationStyle="overFullScreen"
      statusBarTranslucent
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.45)',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}
      >
        <ThemedView
          style={{
            flex: 0,
            width: '100%',
            maxWidth: 420,
            backgroundColor: '#fff',
            padding: 18,
            borderRadius: 12,
            shadowColor: '#000',
            shadowOpacity: 0.12,
            shadowRadius: 10,
            elevation: 8,
          }}
        >
          <ThemedText style={{ fontSize: 28, fontWeight: '700', marginBottom: 20 }}>Choose a display name</ThemedText>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.primary,
              backgroundColor: '#fff',
              padding: 10,
              borderRadius: theme.radius.sm,
              marginBottom: 12,
            }}
          />
          <AppButton className="bg-primary" title={saving ? 'Saving...' : 'Save username'} onPress={onSave} loading={saving} />
        </ThemedView>
      </View>
    </Modal>
  );
}
