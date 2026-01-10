import { useEffect } from 'react';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../auth/AuthContext';

export default function Index() {
  const { user, role, username, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      console.log('Session existe ✅', {
        userId: user.id,
        role,
        username,
      });
    }
  }, [loading, user, role, username]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Checking session...</Text>
      </View>
    );
  }

  return (
    <View style={styles.centered}>
      {user ? (
        <Text style={styles.text}>Session active </Text>
      ) : (
        <Text style={styles.text}>No session </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
  },
});
