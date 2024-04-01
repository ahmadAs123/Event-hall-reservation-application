import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import React from 'react';

const LoadingPage = () => {       // this is the component of rendering spinner loading 
  return (
    <View style={styles.container}>
        <ActivityIndicator size="large" color="#00e4d0" />
        <Text style={styles.loadingText}>Loading</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    fontSize: 22,
    marginTop: 11,
  },
});

export default LoadingPage;
