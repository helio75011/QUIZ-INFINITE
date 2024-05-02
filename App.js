import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import HomeTest from './screens/HomeTest';
import HomeScreen from './screens/HomeScreen';
import QuizScreen from './screens/QuizScreen';
import Response from './screens/Response';
import InfiniteQuizScreen from './screens/InfiniteQuizScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Welcome' }} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="InfiniteQuiz" component={InfiniteQuizScreen} />
        <Stack.Screen name="Response" component={Response} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;