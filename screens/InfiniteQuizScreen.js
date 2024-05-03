import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const InfiniteQuizScreen = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=1&type=multiple');
      const json = await response.json();
      setQuestions(questions => [...questions, ...json.results]);
    } catch (error) {
      console.error('Failed to fetch questions', error);
    }
    setIsLoading(false);
  };

  const handleAnswer = (answer) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    setIsAnswered(false);
    setSelectedAnswer(null);

    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      fetchQuestions(); // Fetch more questions if at the end of the list
    }
  };

  if (isLoading && questions.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No questions loaded.</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answers = [currentQuestion.correct_answer, ...currentQuestion.incorrect_answers].sort(
    () => Math.random() - 0.5
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ backgroundColor: 'purple', paddingBottom: 8 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 2 }}>{`Question ${currentQuestionIndex + 1}`}</Text>
        <Text style={{ fontSize: 18, marginBottom: 4 }}>{currentQuestion.question.replace(/&quot;/g, '"').replace(/&#039;/g, "'")}</Text>
      </View>
      <View style={{ backgroundColor: 'white', marginTop: -4, borderRadius: 10, padding: 16 }}>
        {answers.map((answer, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => handleAnswer(answer)}
            style={{
              padding: 16,
              borderRadius: 8,
              margin: 8,
              backgroundColor: selectedAnswer === answer
                ? answer === currentQuestion.correct_answer
                  ? 'green'
                  : 'red'
                : 'blue',
            }}
          >
            <Text style={{ color: 'white' }}>{answer}</Text>
          </TouchableOpacity>
        ))}
        {isAnswered && (
          <TouchableOpacity
            onPress={handleNextQuestion}
            style={{ backgroundColor: 'purple', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 }}
          >
            <Text style={{ color: 'white' }}>Next Question</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default InfiniteQuizScreen;
