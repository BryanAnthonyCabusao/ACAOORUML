import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const CompareScreen = ({ route }) => {
  const { results } = route.params || {};

  if (!results) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No Results to Compare</Text>
        <Text style={styles.info}>Please upload an image first in the dashboard.</Text>
      </View>
    );
  }

  // Get all unique labels from all algorithms
  const allLabels = new Set();
  Object.values(results).forEach((algoResults) => {
    algoResults.forEach(({ label }) => allLabels.add(label));
  });

  const labelList = Array.from(allLabels);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Algorithm Comparison</Text>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={[styles.cell, styles.headerCell]}>Label</Text>
          {Object.keys(results).map((algo) => (
            <Text key={algo} style={[styles.cell, styles.headerCell]}>{algo}</Text>
          ))}
        </View>
        {labelList.map((label) => (
          <View key={label} style={styles.row}>
            <Text style={styles.cell}>{label}</Text>
            {Object.keys(results).map((algo) => {
              const found = results[algo].find(item => item.label === label);
              return (
                <Text key={algo} style={styles.cell}>
                  {found ? `${(found.confidence * 100).toFixed(1)}%` : '—'}
                </Text>
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default CompareScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  info: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  table: {
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#eef',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  cell: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#333',
  },
});
