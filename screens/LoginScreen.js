import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { signIn } = useAuth();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const validateInputs = () => {
    let valid = true;
    setEmailError('');
    setPasswordError('');

    if (!identifier.trim()) {
      setEmailError('Please enter your username or email');
      valid = false;
    } else if (!/^[\w.@+-]+$/.test(identifier) || identifier.length < 3) {
      setEmailError('Enter a valid username (min 3 chars, no spaces) or email');
      valid = false;
    }

    if (!password) {
      setPasswordError('Please enter your password');
      valid = false;
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      // Simulate API call delay
      setTimeout(() => {
        setLoading(false);
        signIn({ id: '1', email: identifier });
      }, 1000);
    } catch (err) {
      setEmailError('An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#3366FF" />
      <View style={{ flex: 1, position: 'relative' }}>
        <ImageBackground
          source={{ uri: 'https://images.pexels.com/photos/13332158/pexels-photo-13332158.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
          style={[StyleSheet.absoluteFill, { flex: 1 }]}
          resizeMode="cover"
        >
          <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.3)' }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <Animated.View style={[styles.animatedView, { opacity: fadeAnim }]}>
              <Text style={styles.title}>OBJECT RECOGNITION LOGIN</Text>

              <TextInput
                style={styles.input}
                placeholder="Username or Email"
                placeholderTextColor="#cbd5e1"
                value={identifier}
                onChangeText={(text) => {
                  setIdentifier(text);
                  setEmailError('');
                }}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  placeholderTextColor="#cbd5e1"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError('');
                  }}
                  secureTextEntry={!showPassword}
                  textContentType="password"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  accessibilityRole="button"
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color="#cbd5e1"
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

              <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.7 }]}
                onPress={handleLogin}
                disabled={loading}
                accessibilityRole="button"
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Log In</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                accessibilityRole="button"
              >
                <Text style={styles.link}>Don't have an account? Create one</Text>
              </TouchableOpacity>
            </Animated.View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    backgroundColor: '#3366FF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  animatedView: {
    width: '100%',
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
  input: {
    height: 50,
    backgroundColor: '#1e40af',
    borderRadius: 8,
    paddingHorizontal: 15,
    borderColor: '#3b82f6',
    borderWidth: 1,
    color: '#fff',
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e40af',
    borderColor: '#3b82f6',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    color: '#fff',
  },
  errorText: {
    color: '#ff6961',
    marginTop: -5,
    marginBottom: 10,
    fontSize: 13,
    textAlign: 'left',
    width: '100%',
  },
  button: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  link: {
    color: '#bbdefb',
    textAlign: 'center',
    fontSize: 14,
  },
});
