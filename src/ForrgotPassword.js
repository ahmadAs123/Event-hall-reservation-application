import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { auth } from '../config';
import {sendPasswordResetEmail} from "firebase/auth";
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    try {
      if(!email){
        setError("Please fill the feild!");
        return; 
      }
       
      await sendPasswordResetEmail(auth ,email);
      setMessage('Password reset email sent. Please check your inbox.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <View style={styles.container}>
    <View style={styles.boxcontainer}>
    <Text style = {{fontWeight:'bold',fontSize :35 ,  textAlign: 'center' }}>Forggot password</Text>
      <TextInput
        style={styles.TextInput}
        placeholder="Enter your email"
        onChangeText={(email) => setEmail(email)}
        autoCapitalize='none' 
        autoCorrect={false}
        
      />
      {error ? <Text style={styles.ErrorMessage}>{error}</Text> : null}

  <View style={{ alignItems: 'center' }}>
      <TouchableOpacity style={styles.buttons} onPress={handleResetPassword}>
        <Text style={{fontWeight:'bold', fontSize:16 ,color:'white'}}>Reset Password</Text>
      </TouchableOpacity>
      </View>
    </View>
    </View>

  );
};

const styles =StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top:30,
  },

  boxcontainer:{
    width: 350,
    height: 450,
    justifyContent: 'center',
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
     } ,

     ErrorMessage: {
      color: 'red',
      textAlign: 'center',
      bottom:20,
      fontSize:17,
      paddingTop:10
    },
    


    TextInput:{
    width: 300,
    height: 50,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#c0c0c0',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    marginTop:70
    },

  


    buttons: {
      marginTop: 50,
      height: 50,
      width: 150,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 50,
      backgroundColor: '#00e4d0',
      marginTop:25,
    }
  
})

export default ForgotPassword;
