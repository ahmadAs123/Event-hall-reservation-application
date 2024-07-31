import { View, Text , TouchableOpacity,TextInput,StyleSheet,ActivityIndicator} from 'react-native'
import { Picker } from '@react-native-picker/picker';
import React,{useState} from 'react'
import { useNavigation } from '@react-navigation/native'
import {auth} from  '../config'
import { collection, addDoc } from "firebase/firestore";
import { db } from "../config"; 
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { Ionicons } from '@expo/vector-icons'; 

const SignUp = () => {
  const navigation=useNavigation()
  const[email ,setEmail]= useState('')
  const[FirstName ,setFName]= useState('')
  const[LastName ,setLName]= useState('')
  const [Type, setType] = useState('Client');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const[phone ,setPhone]= useState('')
  const[password ,setPassword]= useState('')

  const PasswordVis= () => {
    setShowPass(!showPass);
  };


  const signuppress = async (
    FirstName,
    LastName,
    phone,
    email,
    password,
    Type,
    ) => {
    try {
      if (!FirstName || !LastName || !phone || !email || !password) {
        setError("Please fill in all the fields!");
        return; 
      }
      setLoading(true); 
      const userCredential= await createUserWithEmailAndPassword(auth,email,password)
      const user = userCredential.user;

      const usersCollectionRef = collection(db, "users"); // Get reference to the users collection
      await addDoc(usersCollectionRef, {
        userId: user.uid,
        firstName: FirstName,
        lastName: LastName,
        phone: phone,
        email: email,
        type: Type,
      });
     alert("you singup succefully!  ")
     navigation.navigate('Login');
    //   });

    } catch (error) {
      alert(error.message);
    }
    finally {
      setLoading(false); 
    }
  };



  return (
    <View style={styles.container}>
    <View style={styles.boxcontainer}>
    <Text style = {{fontWeight:'bold',fontSize : 35,  textAlign: 'center'}}>SignUp</Text>

    <View style={{marginTop:40}}>
    <TextInput style ={styles.TextInput} placeholder='FirstName' onChangeText={(FirstName) => setFName(FirstName)} autoCapitalize='none' autoCorrect={false}/>
    <TextInput style ={styles.TextInput} placeholder='LastName' onChangeText={(LastName) => setLName(LastName)} autoCapitalize='none' autoCorrect={false}/>
    <TextInput style ={styles.TextInput} placeholder='PhoneNumber' onChangeText={(phone) => setPhone(phone)}    keyboardType='numeric' value={phone}/>
    <TextInput style ={styles.TextInput} placeholder='Email' onChangeText={(email) => setEmail(email)} autoCapitalize='none' autoCorrect={false}/>
    <TextInput style ={styles.TextInput} placeholder='Password' onChangeText={(password) => setPassword(password)} autoCapitalize='none' autoCorrect={false} secureTextEntry={!showPass} value={password}  />
    <TouchableOpacity onPress={PasswordVis} style={styles.eye}>
        <Ionicons name={showPass? 'eye-off' : 'eye'} size={24} color='black' />
      </TouchableOpacity>

      <View style={styles.Box}>
      <Text style={styles.title}>SignUp as :</Text>
      <View style={styles.pickerContainer}>
      <Picker
        selectedValue={Type}
        style={{ height: 35, width: '100%', marginBottom: 12 }}
        onValueChange={(itemValue) =>{console.log('Selected Type:', itemValue); // Add this line to check the selected Type
        setType(itemValue)
    }
       }>
        <Picker.Item label="Admin" value="Admin" />
        <Picker.Item label="Client" value="Client" />
        <Picker.Item label="Worker" value="Worker" />

      </Picker>
      </View>
    </View>
    </View>
    {error ? <Text style={styles.ErrorMessage}>{error}</Text> : null}
     
    <View style={{ alignItems: 'center' }}>
    <TouchableOpacity onPress={ ()=> signuppress(FirstName,LastName,phone,email ,password,Type)} style={styles.buttons}>
    {loading ? (
          <ActivityIndicator color="white" /> 
        ) : (
          <Text style={{fontWeight:'bold', fontSize:20, color: 'white'}}>Submit</Text>  
          )}
    </TouchableOpacity>

    </View>

    <TouchableOpacity onPress={ ()=> navigation.navigate('Login')} style={{marginTop:20}}>
    <Text style={{fontWeight:100, fontSize:16 , textAlign: 'center' }}>have already an account ? <Text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}> SignIn</Text> </Text>  

    </TouchableOpacity>

    </View>
  </View>
  )
}

export default SignUp



const styles =StyleSheet.create({
  
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top:30,
  },

  Box: {
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  boxcontainer:{
    width: 350,
    height: 670,
    justifyContent: 'center',
    paddingTop:40,
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
      bottom:20,
      textAlign: 'center',
      fontSize:17,
      top:10,
    
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
    },

  
    eye: {
      top: '68.5%',
      position: 'absolute',
      right: 1,
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