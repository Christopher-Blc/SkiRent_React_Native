import { StyleSheet, View} from 'react-native';
import { LoginCard } from '../components/LoginCard';

export default function App() {
  return (
    <View style={styles.screen}>
      <LoginCard></LoginCard>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#ffffff',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});