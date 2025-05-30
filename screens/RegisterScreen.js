import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterScreen({ navigation }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const { signIn } = useAuth();

  const validateInputs = () => {
    let valid = true;
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Accept either a valid email or a username (at least 3 chars, no spaces)
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
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      valid = false;
    }

    return valid;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    setLoading(true);

    // Registration logic here (simulate API call)
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Registration Successful', 'You can now log in!');
    }, 1000);
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
            <Text style={styles.title}>Create New Account</Text>

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
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#cbd5e1" />
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm Password"
                placeholderTextColor="#cbd5e1"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setConfirmPasswordError('');
                }}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={24} color="#cbd5e1" />
              </TouchableOpacity>
            </View>
            {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Already have an account? Log in</Text>
            </TouchableOpacity>
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
  title: {
    fontSize: 24,
    marginBottom: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
  errorText: {
    color: '#ff6961',
    marginTop: -10,
    marginBottom: 10,
    fontSize: 13,
    textAlign: 'left',
    width: '100%',
  },
  input: {
    height: 50,
    backgroundColor: '#1e40af',
    marginBottom: 10,
    borderRadius: 8,
    paddingHorizontal: 15,
    borderColor: '#3b82f6',
    borderWidth: 1,
    color: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e40af',
    borderColor: '#3b82f6',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    height: 50,
  },
  passwordInput: {
    flex: 1,
    color: '#fff',
  },
  button: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
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
