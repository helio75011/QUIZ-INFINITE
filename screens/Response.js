import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Response = ({ route, navigation }) => {
  const { questions, userAnswers } = route.params;

  return (
    <ScrollView style={styles.container}>
      {questions.map((question, index) => (
        <View key={index} style={styles.questionBlock}>
          <Text style={styles.question}>{question.question.replace(/&quot;/g, '"').replace(/&#039;/g, "'")}</Text>
          {question.options.map((option, idx) => (
            <Text key={idx} style={[
              styles.option,
              option === question.answer ? styles.correct : styles.incorrect,
              option === userAnswers[index] ? (option === question.answer ? styles.correct : styles.selectedIncorrect) : null
            ]}>
              {option.replace(/&quot;/g, '"').replace(/&#039;/g, "'")}
            </Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  questionBlock: {
    marginBottom: 20,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  option: {
    fontSize: 14,
    color: 'black',
  },
  correct: {
    color: 'green',
  },
  incorrect: {
    color: 'grey',  // Default color for options that are not selected
  },
  selectedIncorrect: {
    color: 'red',
  }
});

export default Response;