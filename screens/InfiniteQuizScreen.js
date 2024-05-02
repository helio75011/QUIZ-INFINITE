import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

const InfiniteQuizScreen = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
      const data = await response.json();
      setQuestions(prevQuestions => [...prevQuestions, ...data.results]);
    } catch (error) {
      console.error('Failed to fetch questions', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    
    // Check if nearing the end of the current question list
    if (nextIndex >= questions.length - 1) {
      fetchQuestions();  // Fetch more questions
    }
  };

  if (isLoading && questions.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {questions.length > 0 ? (
          <>
            <Text style={styles.question}>
              {questions[currentQuestionIndex].question.replace(/&quot;/g, '"').replace(/&#039;/g, "'")}
            </Text>
            {questions[currentQuestionIndex].options.map((option, idx) => (
              <Button key={idx} title={option} onPress={handleNextQuestion} />
            ))}
          </>
        ) : (
          <Text>No questions loaded.</Text>
        )}
      </ScrollView>
      <Button title="Next Question" onPress={handleNextQuestion} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default InfiniteQuizScreen;