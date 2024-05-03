import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const HomeScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([{ label: "Any Category", value: "" }]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("easy");
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showDifficultyPicker, setShowDifficultyPicker] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://opentdb.com/api_category.php');
        const data = await response.json();
        const categoryList = data.trivia_categories.map(category => ({
          label: category.name,
          value: category.id.toString(),
        }));
        setCategories([{ label: "Any Category", value: "" }, ...categoryList]);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };

    fetchCategories();
  }, []);

  // Fonction pour obtenir le label de la catégorie sélectionnée
  const getCategoryLabel = (value) => {
    const category = categories.find(c => c.value === value);
    return category ? category.label : "Select Category";
  };

  // Fonction pour obtenir le label de la difficulté sélectionnée
  const getDifficultyLabel = (value) => {
    switch (value) {
      case 'easy':
        return 'Easy';
      case 'medium':
        return 'Medium';
      case 'hard':
        return 'Hard';
      default:
        return 'Select Difficulty';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Select Category and Difficulty</Text>
      <Button
        title={getCategoryLabel(selectedCategory)}
        onPress={() => setShowCategoryPicker(!showCategoryPicker)}
      />
      {showCategoryPicker && (
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue, itemIndex) => {
            if (itemValue === "") {
              navigation.navigate('InfiniteQuizScreen'); // Navigue directement avant de fermer le Picker
              setShowCategoryPicker(false);
            } else {
              setSelectedCategory(itemValue);
              setShowCategoryPicker(false); // Ferme le Picker après la sélection
            }
          }}          
          style={styles.picker}>
          {categories.map((category, index) => (
            <Picker.Item key={index} label={category.label} value={category.value} />
          ))}
        </Picker>
      )}
      <Button
        title={getDifficultyLabel(selectedDifficulty)}
        onPress={() => setShowDifficultyPicker(!showDifficultyPicker)}
      />
      {showDifficultyPicker && (
        <Picker
          selectedValue={selectedDifficulty}
          onValueChange={(itemValue, itemIndex) => {
            setSelectedDifficulty(itemValue);
            setShowDifficultyPicker(false); // Ferme le Picker après la sélection
          }}
          style={styles.picker}>
          <Picker.Item label="Easy" value="easy" />
          <Picker.Item label="Medium" value="medium" />
          <Picker.Item label="Hard" value="hard" />
        </Picker>
      )}
      <Button
        title="Start Quiz"
        onPress={() => navigation.navigate('Quiz', { difficulty: selectedDifficulty, category: selectedCategory })}
        color="#1E6738"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5'
  },
  picker: {
    width: '80%',
    height: 44,
    marginBottom: 150
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5
  }
});

export default HomeScreen;