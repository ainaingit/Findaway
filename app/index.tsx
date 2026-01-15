import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { useRouter } from 'expo-router';

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        console.log('Session exists:', {
          userId: user.id,
          email: user.email,
        });
        // Optionally redirect logged-in users somewhere else
        // router.replace('/home'); 
      } else {
        // No session → redirect to welcome screen
        router.replace('/auth-screen');
      }
    }
  }, [loading, user]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Checking session...</Text>
      </View>
    );
  }

  // While the redirect happens, just show a loader
  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 10 }}>Redirecting...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
