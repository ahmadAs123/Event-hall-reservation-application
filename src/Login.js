import { View, Text , TouchableOpacity,TextInput,StyleSheet} from 'react-native'
import React,{useState} from 'react'
import { useNavigation } from '@react-navigation/native'
import {auth} from  '../config'
import {
  signInWithEmailAndPassword,
  // createUserWithEmailAndPassword,
  // signOut,
  // getAuth,
  // sendPasswordResetEmail,
} from "firebase/auth";

const Login = () => {
  const navigation=useNavigation()
  const[email ,setEmail]= useState('')
  const[password ,setPassword]= useState('')
  const [error, setError] = useState('');

 
  const loginpress = async (email, password) => {
    try {
      if ( !email || !password) {
        setError("Please fill in all the fields!");
        return; 
      }
      await signInWithEmailAndPassword(auth, email, password).then( () => {
         alert("you are logged in")
         navigation.navigate('HomePage');

      });

    } catch (error) {
      alert(error.message);
      console.log(email)
      console.log(password)
    }
  };
  
  return (
    <View style={styles.container}>
    <View style={styles.boxcontainer}>
      <Text style = {{fontWeight:'bold',fontSize :35 ,  textAlign: 'center'}}>Login</Text>

      <View style={{marginTop:40}}>
      <TextInput style ={styles.TextInput} placeholder='Email' onChangeText={(email) => setEmail(email)} autoCapitalize='none' autoCorrect={false}/>
      <TextInput style ={styles.TextInput} placeholder='Password' onChangeText={(password) => setPassword(password)} autoCapitalize='none' autoCorrect={false} secureTextEntry={true} />
      </View>

      {error ? <Text style={styles.ErrorMessage}>{error}</Text> : null}

      <TouchableOpacity onPress={ ()=>navigation.navigate('ForrgotPassword')} style={{marginTop:0}}>
      <Text style={{ fontWeight: '100', fontSize: 16, textDecorationLine: 'underline', textAlign: 'right' ,fontWeight:'bold'}}> ForrgotPassword ?</Text>  
      </TouchableOpacity>
      
      <View style={{ alignItems: 'center' }}>
      <TouchableOpacity onPress={ ()=> loginpress(email ,password)} style={styles.buttons}>
      <Text style={{fontWeight:'bold', fontSize:20, color: 'white'}}>Submit</Text>  
      </TouchableOpacity>
      </View>

      <View style={{ alignItems: 'center' }}> 
      <TouchableOpacity onPress={ ()=>navigation.navigate('SignUp')} style={{marginTop:30}}>
      <Text style={{fontWeight:100, fontSize:16 }}>Don't have an account ? <Text style={{textDecorationLine: 'underline' ,fontWeight:'bold' , textAlign: 'center' , marginTop:10}}>SignUp</Text> </Text>  
      </TouchableOpacity>
       </View>
     
    </View>
    </View>
  )
}

export default Login

const styles =StyleSheet.create({
  boxcontainer:{
    width: 350,
    height: 450,
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
     } ,
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

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