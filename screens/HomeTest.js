import React, { useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const HomeTest = () => {
  const [selectedCategory, setSelectedCategory] = useState();
  const [showPicker, setShowPicker] = useState(false);

  const categories = [
    { label: 'Technologie', value: 'tech' },
    { label: 'Science', value: 'science' },
    { label: 'Art', value: 'art' },
    { label: 'Musique', value: 'music' },
    { label: 'Sports', value: 'sports' }
  ];

  return (
    <View style={styles.container}>
      <Button title="Afficher les catégories" onPress={() => setShowPicker(!showPicker)} />
      {showPicker && (
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue)}
          style={styles.picker}
        >
          {categories.map(category => (
            <Picker.Item key={category.value} label={category.label} value={category.value} />
          ))}
        </Picker>
      )}
      {selectedCategory && <Text>Catégorie sélectionnée: {selectedCategory}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    width: 200,
    height: 44,
  }
});

export default HomeTest;
