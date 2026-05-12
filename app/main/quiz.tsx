import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AppButton from '../../components/NWButton';
import ThemedText from '../../components/ThemedText';
import ThemedView from '../../components/ThemedView';
import { theme } from '../../constants/theme';
import { supabase } from '../../lib/supabase';

type Lesson = {
  id: string;
  question: string;
  answer: string;
};

const shuffle = <T,>(items: T[]) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
};

export default function Quiz() {
  const [mode, setMode] = useState<'loading' | 'select' | 'quiz' | 'result'>('loading');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<Lesson[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [showReveal, setShowReveal] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadLessons = async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('id, question, answer')
        .order('created_at', { ascending: true });

      if (error) {
        Alert.alert('Error', `Could not load lessons: ${error.message}`);
        setLessons([]);
        setSelectedLessonIds([]);
        setMode('select');
        return;
      }

      const loadedLessons = (data ?? []) as Lesson[];
      setLessons(loadedLessons);
      setSelectedLessonIds(loadedLessons.map((lesson) => lesson.id));
      setMode('select');
    };

    loadLessons();
  }, []);

  const selectedLessons = useMemo(
    () => lessons.filter((lesson) => selectedLessonIds.includes(lesson.id)),
    [lessons, selectedLessonIds]
  );

  const currentQuestion = quizQuestions[currentIndex];

  const selectAllLessons = () => setSelectedLessonIds(lessons.map((lesson) => lesson.id));

  const clearAllLessons = () => setSelectedLessonIds([]);

  const toggleLesson = (lessonId: string) => {
    setSelectedLessonIds((current) =>
      current.includes(lessonId) ? current.filter((id) => id !== lessonId) : [...current, lessonId]
    );
  };

  const startQuiz = () => {
    if (!selectedLessons.length) {
      Alert.alert('Select at least one lesson', 'Choose one or more lessons before starting the quiz.');
      return;
    }

    const nextQuestions = shuffle(selectedLessons);
    setQuizQuestions(nextQuestions);
    setCurrentIndex(0);
    setScore(0);
    setAnswerText('');
    setShowReveal(false);
    setWasCorrect(false);
    setMode('quiz');
  };

  const normalizeAnswer = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ');

  const submitAnswer = () => {
    if (!currentQuestion) return;
    if (!answerText.trim()) {
      Alert.alert('Enter an answer', 'Type your answer before submitting.');
      return;
    }

    const isCorrect = normalizeAnswer(answerText) === normalizeAnswer(currentQuestion.answer);
    if (isCorrect) {
      setScore((current) => current + 1);
    }
    setWasCorrect(isCorrect);
    setShowReveal(true);
  };

  const goNext = () => {
    const nextIndex = currentIndex + 1;

    if (nextIndex >= quizQuestions.length) {
      setMode('result');
      return;
    }

    setCurrentIndex(nextIndex);
    setAnswerText('');
    setShowReveal(false);
    setWasCorrect(false);
  };

  if (mode === 'loading') {
    return (
      <ThemedView style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
        <ThemedText style={{ fontSize: 20, fontWeight: '700', color: theme.colors.primary }}>
          Loading lessons...
        </ThemedText>
      </ThemedView>
    );
  }

  if (mode === 'select') {
    return (
      <ThemedView style={{ flex: 1, padding: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: '700' }}>Choose lessons</Text>
          <AppButton outline borderColor="#999" title="Back" onPress={() => router.back()} style={{ paddingVertical: 8, paddingHorizontal: 12 }} />
        </View>

        <Text style={{ marginBottom: 12, color: theme.colors.ink }}>
          Select the lessons you want to be quizzed on. All lessons are selected by default.
        </Text>

        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
          <View style={{ flex: 1 }}>
            <AppButton outline borderColor={theme.colors.primary} title="Select All" onPress={selectAllLessons} />
          </View>
          <View style={{ flex: 1 }}>
            <AppButton outline borderColor="#999" title="Clear All" onPress={clearAllLessons} />
          </View>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 16 }}>
          {lessons.length === 0 ? (
            <Text style={{ color: theme.colors.ink }}>No lessons available yet.</Text>
          ) : (
            lessons.map((lesson) => {
              const selected = selectedLessonIds.includes(lesson.id);
              return (
                <TouchableOpacity
                  key={lesson.id}
                  onPress={() => toggleLesson(lesson.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 12,
                    borderRadius: theme.radius.sm,
                    borderWidth: 1,
                    borderColor: selected ? theme.colors.primary : '#ddd',
                    backgroundColor: selected ? '#fff4f7' : '#fff',
                    marginBottom: 10,
                  }}
                >
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      borderWidth: 2,
                      borderColor: selected ? theme.colors.primary : '#bbb',
                      backgroundColor: selected ? theme.colors.primary : '#fff',
                      marginRight: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {selected ? <Text style={{ color: '#fff', fontWeight: '700' }}>✓</Text> : null}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.ink }}>{lesson.question}</Text>
                    <Text style={{ marginTop: 4, color: '#666' }}>Answer: {lesson.answer}</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>

        <AppButton
          className="bg-primary"
          title={`Start Quiz (${selectedLessonIds.length})`}
          onPress={startQuiz}
          disabled={!selectedLessons.length}
        />
      </ThemedView>
    );
  }

  if (mode === 'result') {
    return (
      <ThemedView style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
        <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 12 }}>Quiz complete</Text>
        <Text style={{ fontSize: 20, marginBottom: 24 }}>
          Final score: {score} / {quizQuestions.length}
        </Text>

        <AppButton
          className="bg-primary"
          title="Try Again"
          onPress={() => {
            setMode('select');
            setCurrentIndex(0);
            setScore(0);
          }}
          style={{ marginBottom: 12 }}
        />
        <AppButton outline borderColor="#999" title="Back to Home" onPress={() => router.replace('/main')} />
      </ThemedView>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>
          Quiz {currentIndex + 1}/{quizQuestions.length}
        </Text>
        <AppButton outline borderColor="#999" title="Back" onPress={() => router.back()} style={{ paddingVertical: 8, paddingHorizontal: 12 }} />
      </View>

      <Text style={{ marginBottom: 12, fontSize: 20, fontWeight: '600' }}>{currentQuestion.question}</Text>
      <Text style={{ marginBottom: 16, color: '#666' }}>Type your answer below.</Text>

      <TextInput
        value={answerText}
        onChangeText={setAnswerText}
        placeholder="Your answer"
        editable={!showReveal}
        style={{
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: theme.radius.sm,
          backgroundColor: '#fff',
          padding: 12,
          marginBottom: 12,
        }}
      />

      {!showReveal ? (
        <AppButton className="bg-primary" title="Submit Answer" onPress={submitAnswer} />
      ) : (
        <View style={{ marginTop: 4 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8, color: wasCorrect ? '#16a34a' : '#dc2626' }}>
            {wasCorrect ? 'Correct' : 'Incorrect'}
          </Text>
          <Text style={{ marginBottom: 6 }}>Your answer: {answerText.trim()}</Text>
          <Text style={{ marginBottom: 16 }}>Correct answer: {currentQuestion.answer}</Text>
          <AppButton className="bg-primary" title={currentIndex + 1 >= quizQuestions.length ? 'Finish Quiz' : 'Next Question'} onPress={goNext} />
        </View>
      )}
    </ThemedView>
  );
}
