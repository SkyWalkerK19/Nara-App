import RequireAuth from "@/components/RequireAuth";
import { StyleSheet, Text, View } from 'react-native';

export default function Analytics() {
  return (
    <RequireAuth>
      <View style={styles.container}>
        <Text style={styles.title}>Analytics Dashboard</Text>
        <Text style={styles.subtitle}>Orders & Conversations</Text>
        
        {/* Add your analytics content here */}
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Analytics content coming soon...
          </Text>
        </View>
      </View>
    </RequireAuth>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
});