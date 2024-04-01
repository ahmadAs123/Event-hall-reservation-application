import { View, Image, StyleSheet } from 'react-native';
import React from 'react';

const Header = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/Logo.png')} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginLeft: 15,
  },
  logo: {
    width: 85, 
    height: 85,
    marginRight: 10,
  },
});

export default Header;
