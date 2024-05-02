import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';

const API_URL = "https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple";

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setQuestions(data.results.map((q) => ({
          question: q.question,
          options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
          answer: q.correct_answer
        })));
      } catch (error) {
        alert('Failed to fetch questions!');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = (option) => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert("Quiz Completed!");
      setCurrentQuestionIndex(0); // Recommencer le quiz
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.questionSection}>
        <Text style={styles.questionText}>
          {questions[currentQuestionIndex].question.replace(/&quot;/g, '"').replace(/&#039;/g, "'")}
        </Text>
      </View>
      <View style={styles.optionsSection}>
        {questions[currentQuestionIndex].options.map((option, index) => (
          <Button
            key={index}
            title={option.replace(/&quot;/g, '"').replace(/&#039;/g, "'")}
            onPress={() => handleAnswer(option)}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  questionSection: {
    margin: 20,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  optionsSection: {
    marginTop: 20,
    width: '100%',
  },
});

export default App;