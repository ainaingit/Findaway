import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

export default function App() {
  const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 20;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#000000', '#1a1a1a']} style={styles.background}>
        <Image
          source={require('../assets/background_findaway.jpeg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        <View style={styles.overlay}>
          {/* Top Row */}
          <View style={[styles.topRow, { marginTop: STATUSBAR_HEIGHT }]}>
            <Text style={styles.logoText}>Findaway</Text>
            <TouchableOpacity>
              <Text style={styles.skipText}>SKIP</Text>
            </TouchableOpacity>
          </View>

          {/* Center Text */}
          <View style={styles.centerText}>
            <Text style={styles.mainText}>Find your way faster, smarter, and fun!</Text>
            <Text style={styles.subText}>
              Explore places with your friends on a map that’s simple, intuitive, and friendly. Navigation has never felt this easy.
            </Text>
          </View>

          {/* Buttons stacked vertically, each button itself is a BlurView */}
          <View style={styles.buttonContainer}>
            <BlurView intensity={90} tint="dark" style={styles.blurButton}>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Get Started</Text>
              </TouchableOpacity>
            </BlurView>

            <BlurView intensity={90} tint="dark" style={styles.blurButton}>
              <TouchableOpacity style={styles.button}>
                <Ionicons name="logo-apple" size={20} color="#fff" style={{ marginRight: 10 }} />
                <Text style={styles.buttonText}>Continue with Apple</Text>
              </TouchableOpacity>
            </BlurView>

            <BlurView intensity={90} tint="dark" style={styles.blurButton}>
              <TouchableOpacity style={styles.button}>
                <Ionicons name="logo-google" size={20} color="#fff" style={{ marginRight: 10 }} />
                <Text style={styles.buttonText}>Continue with Google</Text>
              </TouchableOpacity>
            </BlurView>
          </View>

          {/* Footer */}
          <Text style={styles.footerText}>Terms of use | Privacy Policy</Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  backgroundImage: { ...StyleSheet.absoluteFillObject, opacity: 0.3 },
  overlay: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 30, paddingVertical: 20 },

  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logoText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  skipText: { color: '#aaa', fontSize: 16 },

  centerText: { alignItems: 'center', marginTop: 50 },
  mainText: { color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  subText: { color: '#ccc', fontSize: 14, textAlign: 'center', marginTop: 10, paddingHorizontal: 20 },

  buttonContainer: { flexDirection: 'column', justifyContent: 'center', marginBottom: 40 },

  blurButton: {
    borderRadius: 12,
    marginVertical: 6,
    overflow: 'hidden', // ensures blur is clipped to button shape
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },

  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },

  footerText: { color: '#888', textAlign: 'center', fontSize: 12, marginBottom: 10 },
});
