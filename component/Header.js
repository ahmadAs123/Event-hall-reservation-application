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
    justifyContent: 'center', 
    alignItems: 'center',
    marginLeft: 15,
  },
  logo: {
    width: 100, 
    height: 100,
    marginRight: 10,
  },
});

export default Header;
