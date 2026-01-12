import { useEffect } from 'react'
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native'
import { useAuth } from '../auth/AuthContext'

export default function Index() {
  const { user, loading } = useAuth()

  // Log session info once when user is available
  useEffect(() => {
    if (!loading && user) {
      console.log('Session exists:', {
        userId: user.id,
        email: user.email,  
      })
    }
  }, [loading, user])

  // Show loader while auth state is restoring
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Checking session...</Text>
      </View>
    )
  }

  // Show simple status for now (can later redirect or render real content)
  return (
    <View style={styles.centered}>
      {user ? (
        <Text style={styles.text}>Session active</Text>
      ) : (
        <Text style={styles.text}>No session</Text>
      )}
    </View>
  )
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
})
