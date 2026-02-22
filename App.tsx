import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { ButtonRectangular } from './src/components/ButtonRectangular';
import registerNNPushToken from 'native-notify';



export default function App() {
  registerNNPushToken(33399, 'T0W3r5EfJEuT13poqfo7Pb');
  return (
    <View style={styles.screen}>
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
