import { View, Text , TouchableOpacity,TextInput,StyleSheet,ActivityIndicator,StatusBar} from 'react-native'
import React,{useState, useEffect} from 'react'
import { useNavigation } from '@react-navigation/native'
import {auth} from  '../config'
import {signInWithEmailAndPassword} from "firebase/auth";
import { db } from '../config'; // Import your Firestore instance
import { collection,query,where ,doc,getDocs} from 'firebase/firestore';

const Login = () => {
  const navigation=useNavigation()
  const[email ,setEmail]= useState('')
  const [loading, setLoading] = useState(false); 
  const[password ,setPassword]= useState('')
  const [error, setError] = useState('');

 
  const loginpress = async (email, password) => {
    try {
      if ( !email || !password) {
        setError("Please fill in all the fields!");
        return; 
      }
      setLoading(true); 
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Get the user document from Firestore
    const userDocRef = collection(db, 'users');
    // const userDocSnap = await getDoc(userDocRef);

    // if (userDocSnap.exists()) {
    //   const userData = userDocSnap.data();
    //   // Check the type field to determine the user role
    //   if (userData.type === 'Client') {
    //     alert("You are logged in as a client");
    //   } else if (userData.type === 'Admin') {
    //     alert("You are logged in as an admin");
    //   } else {
    //     alert("Unknown user type");
    //   }
    // } 
    // else {
    //   alert("User document does not exist");
    // }
    const querySnapshot = await getDocs(query(userDocRef, where("email", "==", email)));

    // Check if the user document exists
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const userType = userData.type;
        if(userData.type =='Admin')
        navigation.navigate("AdminPage");
        else if(userData.type =='Worker')
        navigation.navigate("Tasks");
        else
        navigation.navigate("HomePage");

      });
    } else {
      alert("User document does not exist");
    }

    }
     catch (error) {
      alert("The email or the password is incorrect ! ,please try agian");
    }
    finally {
      setLoading(false); 
    }
  };

  
  useEffect(() => {
    return navigation.addListener('focus', () => {
      setEmail('');
      setPassword('');
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
     <StatusBar backgroundColor="#00e4d0" barStyle="light-content" />
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
      {loading ? (
          <ActivityIndicator color="white" /> 
        ) : (
          <Text style={{fontWeight:'bold', fontSize:20, color: 'white'}}>Submit</Text>  
          )}
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