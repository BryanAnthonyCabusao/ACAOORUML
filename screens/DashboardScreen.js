import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image,
  ActivityIndicator, SafeAreaView, Modal, Pressable, Platform, StatusBar, ImageBackground
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getLoggedInUser } from '../user/userStorage';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const [imageUri, setImageUri] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bestPrediction, setBestPrediction] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const sampleResults = {
    CNN: [
      { label: 'Accuracy', confidence: 0.92 },
      { label: 'Precision', confidence: 0.05 },
      { label: 'Recall', confidence: 0.03 },
    ],
    SVM: [
      { label: 'Accuracy', confidence: 0.89 },
      { label: 'Precision', confidence: 0.08 },
      { label: 'Recall', confidence: 0.03 },
    ],
  };

  useEffect(() => {
    (async () => {
      const email = await getLoggedInUser();
      if (!email) return;
    })();
  }, []);

  const handleLogout = () => {
    setMenuVisible(false);
    signOut();
    Alert.alert('Logged out', 'You have been logged out successfully.');
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Please grant access to your photo library.');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!pickerResult.canceled && pickerResult.assets.length > 0) {
      const image = pickerResult.assets[0];
      setImageUri(image.uri);
      runObjectRecognition(image.uri);
    }
  };

  const runObjectRecognition = async (uri) => {
    try {
      setLoading(true);
      setResults(null);
      setBestPrediction(null);

      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename ?? '');
      const type = match ? `image/${match[1]}` : `image`;

      const formData = new FormData();
      formData.append('image', {
        uri,
        name: filename,
        type,
      });

      const response = await fetch('http://192.168.136.46:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.results) {
        // Check if any algorithm detected a real object that is NOT an animal or human
        let foundObject = false;
        let foundAnimalOrHuman = false;
        let best = null;
        const forbiddenLabels = ['cat', 'dog', 'rabbit', 'human', 'person', 'people', 'man', 'woman', 'boy', 'girl'];
        Object.values(data.results).forEach((predictions) => {
          predictions.forEach((p) => {
            const labelLower = p.label.toLowerCase();
            if (forbiddenLabels.some(f => labelLower.includes(f))) {
              foundAnimalOrHuman = true;
            }
            if (
              labelLower !== 'unknown' &&
              labelLower !== 'not an object' &&
              p.confidence > 0.5 &&
              !forbiddenLabels.some(f => labelLower.includes(f))
            ) {
              foundObject = true;
              if (!best || p.confidence > best.confidence) best = p;
            }
          });
        });
        if (foundAnimalOrHuman) {
          Alert.alert('Not Allowed', 'Please do not upload images of animals or humans.');
          setResults(null);
          setBestPrediction(null);
        } else if (!foundObject) {
          Alert.alert('No Object Detected', 'Please upload an image with a real (non-animal, non-human) object.');
          setResults(null);
          setBestPrediction(null);
        } else {
          setResults(data.results);
          setBestPrediction(best);
        }
      } else {
        throw new Error(data.error || 'Invalid response from server');
      }
    } catch (error) {
      console.warn('Using fallback results due to error:', error.message);
      Alert.alert('Fallback', 'Prediction failed. Showing sample results.');

      setResults(sampleResults);

      let bestSample = null;
      Object.values(sampleResults).forEach((predictions) => {
        predictions.forEach((p) => {
          if (!bestSample || p.confidence > bestSample.confidence) bestSample = p;
        });
      });
      setBestPrediction(bestSample);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, position: 'relative' }}>
        <ImageBackground
          source={{ uri: 'https://images.pexels.com/photos/13332158/pexels-photo-13332158.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
          style={[StyleSheet.absoluteFill, { flex: 1 }]}
          resizeMode="cover"
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
                <MaterialIcons name="menu" size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>DASHBOARD</Text>
            </View>

            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
              <Text style={styles.title}>WELCOME{user && user.email ? `, ${user.email}` : ''}!</Text>
              <Text style={styles.subtitle}>To Object Recognition</Text>

              <TouchableOpacity style={[styles.card, styles.violetCard]} onPress={pickImage}>
                <Text style={[styles.cardTitle, styles.violetCardText]}>Upload Image</Text>
                <Text style={[styles.cardDesc, styles.violetCardText]}>Choose an image to analyze</Text>
              </TouchableOpacity>

              {imageUri && (
                <View style={styles.imagePreview}>
                  <Image source={{ uri: imageUri }} style={styles.image} />
                  {bestPrediction && (
                    <Text style={styles.bestPredictionText}>
                      Predicted Object: {bestPrediction.label} ({(bestPrediction.confidence * 100).toFixed(2)}%)
                    </Text>
                  )}
                </View>
              )}

              {loading && <ActivityIndicator size="large" color="#bbdefb" style={{ marginVertical: 20 }} />}

              {results && (
                <View style={styles.resultsContainer}>
                  <Text style={styles.resultHeader}>Recognition Results</Text>
                  {Object.entries(results).map(([algo, res]) => (
                    <View key={algo} style={styles.algorithmResult}>
                      <Text style={styles.algorithmTitle}>{algo}</Text>
                      {res.map((item, idx) => (
                        <Text key={idx} style={styles.resultText}>
                          {item.label} - {(item.confidence * 100).toFixed(2)}%
                        </Text>
                      ))}
                    </View>
                  ))}
                </View>
              )}

              <TouchableOpacity
                style={[styles.card, styles.violetCard]}
                onPress={() => {
                  if (!results) {
                    Alert.alert('Notice', 'Please upload an image first!');
                    return;
                  }
                  navigation.navigate('Compare', { results });
                }}
              >
                <Text style={[styles.cardTitle, styles.violetCardText]}>Compare Algorithms</Text>
                <Text style={[styles.cardDesc, styles.violetCardText]}>
                  Visualize performance across models
                </Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Menu Modal */}
            <Modal
              visible={menuVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setMenuVisible(false)}
            >
              <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
                <View style={styles.menuModal}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      setMenuVisible(false);
                      Alert.alert('About', 'This app titled "A Comparative Analysis of Object Recognition" demonstrates the performance of multiple machine learning algorithms for recognizing objects in images.');
                    }}
                  >
                    <Text style={styles.menuText}>About</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      setMenuVisible(false);
                      Alert.alert('Help', 'Upload an image and the app will analyze it using different object recognition algorithms to help you compare their accuracy.');
                    }}
                  >
                    <Text style={styles.menuText}>Help</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.menuItem, styles.menuLogout]} onPress={handleLogout}>
                    <Text style={[styles.menuText, { color: '#f87171' }]}>Logout</Text>
                  </TouchableOpacity>
                </View>
              </Pressable>
            </Modal>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60 + (Platform.OS === 'android' ? StatusBar.currentHeight : 0),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e40af',
    borderBottomWidth: 1,
    borderBottomColor: '#3356cc',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  menuButton: { marginRight: 15 },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  container: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#bbdefb',
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },
  violetCard: {
    backgroundColor: '#7C4DFF',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#bbdefb',
  },
  violetCardText: {
    color: '#EDE7F6',
  },
  cardDesc: {
    fontSize: 14,
    color: '#cbd5e1',
    marginTop: 6,
  },
  imagePreview: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 260,
    height: 260,
    borderRadius: 16,
  },
  bestPredictionText: {
    marginTop: 10,
    fontSize: 16,
    color: '#ffeb3b',
    fontWeight: 'bold',
  },
  resultsContainer: {
    backgroundColor: '#283593',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  resultHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#bbdefb',
    marginBottom: 10,
    textAlign: 'center',
  },
  algorithmResult: {
    marginBottom: 10,
  },
  algorithmTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e1bee7',
    marginBottom: 4,
  },
  resultText: {
    fontSize: 14,
    color: '#c5cae9',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50,
    paddingHorizontal: 20,
  },
  menuModal: {
    backgroundColor: '#1e40af',
    borderRadius: 10,
    paddingVertical: 15,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomColor: '#3356cc',
    borderBottomWidth: 1,
  },
  menuText: {
    color: '#bbdefb',
    fontSize: 16,
  },
  menuLogout: {
    borderBottomWidth: 0,
  },
});
