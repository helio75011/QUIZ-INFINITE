import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';

const QuizScreen = ({ route, navigation }) => {
  const { difficulty, category } = route.params;
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);

  const fetchQuestions = useCallback(async () => {
    const categoryQuery = category ? `&category=${category}` : '';
    const API_URL = `https://opentdb.com/api.php?amount=10&type=multiple&difficulty=${difficulty}${categoryQuery}`;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setQuestions(data.results.map(q => ({
            question: q.question,
            options: [...q.incorrect_answers, q.correct_answer].sort(() => 0.5 - Math.random()),
            answer: q.correct_answer
        })));
      } else {
        setError("No questions found.");
      }
    } catch (error) {
      console.error('Failed to fetch questions', error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [difficulty, category]);  // Dependencies for useCallback

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);  // useEffect depends on fetchQuestions from useCallback

  // Function to handle answer selection
  const handleAnswer = (option) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = option; // Store user's answer for the current question
    setUserAnswers(newAnswers);

    if (option === questions[currentQuestionIndex].answer) {
      setScore(prevScore => prevScore + 10);
      setCorrectAnswers(prevCount => prevCount + 1);
    }
    goToNextQuestion();
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      Alert.alert(
        "Quiz Completed!",
        `You scored ${score} points with ${correctAnswers} correct answers out of ${questions.length}.`,
        [
          { text: "OK", onPress: () => navigation.navigate('Home') },
          { text: "Review Answers", onPress: () => navigation.navigate('Response', { questions, userAnswers }) }
        ]
      );      
    }
  };

  if (isLoading) {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
        </View>
    );
  }

  if (error) {
      return (
          <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <Button title="Retry" onPress={fetchQuestions} />
          </View>
      );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Button title="Home" onPress={() => navigation.navigate('Home')} />
        <Text style={styles.questionCount}>{currentQuestionIndex + 1} of {questions.length}</Text>
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.question}>
          {questions[currentQuestionIndex].question.replace(/&quot;/g, '"').replace(/&#039;/g, "'")}
        </Text>
        {questions[currentQuestionIndex].options.map((option, index) => (
          <Button key={index} title={option.replace(/&quot;/g, '"').replace(/&#039;/g, "'")} onPress={() => handleAnswer(option)} />
        ))}
      </ScrollView>
      <Button title="Next Question" onPress={goToNextQuestion} style={styles.nextButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  questionCount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    width: '100%',
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  nextButton: {
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 20,
  }
});

export default QuizScreen;