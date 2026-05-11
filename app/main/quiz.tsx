import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import AppButton from '../../components/NWButton';

const sampleQuestions = [
  { id: '1', q: 'What is hello in Spanish?', options: ['Hola', 'Bonjour', 'Ciao'], answer: 0 },
  { id: '2', q: 'Select the English word for "gato"', options: ['Dog', 'Cat', 'Bird'], answer: 1 },
];

export default function Quiz() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const router = useRouter();

  const question = sampleQuestions[index];

  const choose = (i: number) => {
    if (i === question.answer) setScore((s) => s + 1);
    if (index + 1 < sampleQuestions.length) setIndex(index + 1);
    else {
      router.replace('/main');
      // show score via alert
      // but keeping simple, console log
      console.log('Score:', score + (i === question.answer ? 1 : 0));
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontSize: 18 }}>Quiz</Text>
        <AppButton outline borderColor="#999" title="Back" onPress={() => router.back()} style={{ paddingVertical: 8, paddingHorizontal: 12 }} />
      </View>
      <Text style={{ marginBottom: 8 }}>{question.q}</Text>
      {question.options.map((opt, i) => (
        <TouchableOpacity key={i} onPress={() => choose(i)} style={{ padding: 12, borderWidth: 1, borderColor: '#ddd', marginBottom: 8 }}>
          <Text>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
