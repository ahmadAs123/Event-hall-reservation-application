import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { auth } from '../config';

const HomePage = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.navigate('StartPage');
    } catch (error) {
      console.log('Error logging out: ', error);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = {
  logoutButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#00e4d0',
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#fff',
  },
};

export default HomePage
