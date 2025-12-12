import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { ButtonRectangular } from './src/components/ButtonRectangular';
import { LoginCard } from './src/components/LoginCard';


export default function App() {
  return (
    <View style={styles.screen}>
      <LoginCard></LoginCard>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#525252ff',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
