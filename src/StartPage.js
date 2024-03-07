import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config';


const Start = () => {
  const navigation = useNavigation();

  const signInWithGoogle = async () => {
  
  };

  return (
    <View style={styles.container}>
    <View style={styles.boxcontainer}>
    <Text style = {{fontWeight:'bold',fontSize :33,marginTop:-10,  textAlign: 'center'}}>Welcome to Evento </Text>
      <Text style={styles.Text}>the best for you</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Sign in via Email</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={signInWithGoogle}>
        <Text style={styles.buttonText}>Sign in via Gmail</Text>
      </TouchableOpacity>
    </View>
    </View>

  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  
  boxcontainer: {
    width: 350,
    height: 350,
    justifyContent: 'center',
    paddingTop:20,
    paddingBottom:20,
    bottom:40,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 30,
  },

  
  Text: {
    fontSize: 17,
    marginBottom: 30,
    marginTop: 30,
    paddingLeft: 80,
    
  },
 
  buttonText: {
    fontSize: 16,
    fontWeight:'bold',
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'center',

  },

  button: {
    backgroundColor: '#00e4d0',
    paddingVertical: 9,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 25,
    justifyContent: 'center',
    alignItems: 'center',

  },
});

export default Start;
