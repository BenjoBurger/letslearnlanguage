import ThemedView from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import AppButton from '../../components/NWButton';
import { useAuth } from '../../hooks/useAuth';

export default function AddLesson() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  const save = () => {
    if (!title) return Alert.alert('Please enter a title');
    // placeholder: save lesson via services
    Alert.alert('Lesson saved', `Title: ${title}`);
    router.back();
  };

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontSize: 20, textAlign: 'left' }}>Add Lesson</Text>
        <AppButton outline borderColor="#999" title="Back" onPress={() => router.back()} />
      </View>
      <Text style={{ marginBottom: 8 }}>Author: {user?.displayName ?? 'Unknown'}</Text>
      <TextInput
        placeholder="Lesson title"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12 }}
      />
      <TextInput
        placeholder="Lesson content"
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={6}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12, minHeight: 100 }}
      />
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <Button title="Save" onPress={save} />
        </View>
      </View>
    </ThemedView>
  );
}
