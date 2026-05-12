import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import AppButton from '../../components/NWButton';
import ThemedView from '../../components/ThemedView';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

export default function AddLesson() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const save = async () => {
    if (!question.trim()) return Alert.alert('Error', 'Please enter a question');
    if (!answer.trim()) return Alert.alert('Error', 'Please enter an answer');
    if (!user?.id) return Alert.alert('Error', 'You must be signed in to add a lesson');

    setSaving(true);
    try {
      const { error } = await supabase.from('lessons').insert({
        question: question.trim(),
        answer: answer.trim(),
        created_by: user.id,
      });

      if (error) {
        Alert.alert('Error', `Could not save lesson: ${error.message}`);
        return;
      }

      Alert.alert('Success', 'Lesson saved successfully');
      router.back();
    } catch (err) {
      Alert.alert('Error', `Could not save lesson: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontSize: 20, textAlign: 'left' }}>Add Lesson</Text>
        <AppButton outline borderColor="#999" title="Back" onPress={() => router.back()} />
      </View>
      <Text style={{ marginBottom: 8 }}>Author: {user?.displayName ?? 'Unknown'}</Text>
      <TextInput
        placeholder="Question"
        value={question}
        onChangeText={setQuestion}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12 }}
      />
      <TextInput
        placeholder="Answer"
        value={answer}
        onChangeText={setAnswer}
        multiline
        numberOfLines={6}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12, minHeight: 100 }}
      />
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <Button title={saving ? 'Saving...' : 'Save'} onPress={save} disabled={saving} />
        </View>
      </View>
    </ThemedView>
  );
}
