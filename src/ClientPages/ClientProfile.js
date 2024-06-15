import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5 } from '@expo/vector-icons';
import profileImage from '../../assets/image.png'; 
import { auth, db ,storage } from '../../config'; 
import { collection, query, where, getDocs ,doc,updateDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import {  uploadBytes } from 'firebase/storage';

const ClientProfile = () => {
  const navigation = useNavigation();
  const [fname, setFName] = useState('');
  const [lname, setLName] = useState('');
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [id, setId] = useState('');


  
  
  // Fetching the data 
  
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;
        const usersCollRef = collection(db, 'users');
        const q = query(usersCollRef, where('userId', '==', uid)); //searching on the user that authintecated right now
        try {
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const docSnap = querySnapshot.docs[0];
            const Data = docSnap.data();
            setFName(Data.firstName);
            setLName(Data.lastName)
            setEmail(Data.email);
+           setLocation(Data.address || 'No address yet');
            setPhone(Data.phone);
            setId(Data.userId)
            if (Data.imageURL) {
              setImage(Data.imageURL); // Set image 
            }
          } 
        } catch (error) {
          console.error('Failed while fetching the  data:', error);
        }
      }
    };

    useEffect(() => {
      fetchUserData();
    }, []);


  useEffect(() => { //mmake sure to be updated every change happened
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUserData();
    });
    return unsubscribe;
  }, [navigation]);


  const chooseImg = async () => { //chossing image from galary and update it in firebase
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        const ImageURLs = [];
        for (const asset of result.assets) {
          const response = await fetch(asset.uri);
          const blob = await response.blob();
          const filename = asset.uri.substring(asset.uri.lastIndexOf('/') + 1);
          const storageRef = ref(storage, `images/${filename}`);
          await uploadBytes(storageRef, blob); 
          const URL = await getDownloadURL(storageRef); 
          ImageURLs.push(URL);
        }

          const user = auth.currentUser;
          setImage(ImageURLs[0]); 
          const usersRef = collection(db, 'users'); //update the image 
          const q = query(usersRef, where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0]; 
            const userRef = doc(db, 'users', userDoc.id);
            await updateDoc(userRef, { imageURL: ImageURLs[0] }); 
          } 
        } 
      
    } catch (error) {
      console.error('Error while pikking image:', error);
    }
  };

  const Logout = async () => {
    try {
      await auth.signOut();
      navigation.navigate('StartPage');
    } catch (error) {
      alert(error);

    } 
  };
  return (
    <View style={styles.container}>
      <View style={styles.cont}>
        <TouchableOpacity onPress={chooseImg}>
          <View style={styles.ImgCon}>
            {image ? (
              <Image source={{ uri: image }} style={styles.profileImage} />
            ) : (
              <Image source={profileImage} style={styles.profileImage} />
            )}
            <View style={styles.ed_Icn}>
              <MaterialIcons name="edit" size={20} color="#00e4d4" />
            </View>
          </View>
        </TouchableOpacity>
        <Text style={styles.name}>{fname +" "+ lname}</Text> 
      </View>
            <TouchableOpacity style={styles.editButt} onPress={()=> navigation.navigate('EditProfile' ,{fname,lname,email,phone,location,id })}>
          <Text style={styles.editTxt}>Edit</Text>
        </TouchableOpacity>
      <View style={styles.section}>
        <Text style={styles.T_name}>Personal Details</Text>
        <View style={styles.card}>
          <MaterialIcons name="email" size={21} color="#00e4d4" />
          <Text style={styles.Txt}>{email}</Text>
        </View>
        <View style={styles.card}>
          <MaterialIcons name="phone" size={21} color="#00e4d4" />
          <Text style={styles.Txt}>{phone}</Text>
        </View>
        <View style={styles.card}>
          <MaterialIcons name="location-on" size={21} color="#00e4d4" />
          <Text style={styles.Txt}>{location}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.T_name}></Text>
         <Text style={styles.points}>My Points</Text>
         <Text style={styles.pointstxt}>200</Text>
         <FontAwesome5 name="coins" size={25} color="gold" style={styles.coin} />
      </View>
      <View style={styles.logout}>
      <TouchableOpacity onPress={Logout}>
        <MaterialIcons name="logout" size={30} color="#666" />
          <Text style={{right:10}}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  logout: {
    alignItems: 'center',
    justifyContent:'center',
    padding: 33,
    left:11
  },
  points: {
    fontSize: 20,
    fontWeight: "bold",
    top: 3
  },

  coin: {
    top: -46,
    left: 280,
  },

  cont: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },


  pointstxt: {
    left: 230,
    fontSize: 20,
    fontWeight: "bold",
    top: -20
  },


  ImgCon: {
    marginBottom: 16,
    position: 'relative',  
  },


  profileImage: {
    width: 100,
    borderRadius: 50,
    height: 100,
  },


  ed_Icn: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    backgroundColor: 'gray',
    borderRadius: 52,
    padding: 6,
  },

  
  name: {
    fontWeight: 'bold',
    fontSize: 21,
    marginBottom: 6,
  },

  editButt: {
    position: 'absolute',
    top: 20,
    right: 20,
  },

  T_name: {
    fontSize: 17,
    marginBottom: 9,
    fontWeight: 'bold',

  },

  section: {
    backgroundColor: '#fff',
    marginTop: 19,
    marginHorizontal: 21,
    borderRadius: 11,
    marginBottom: 11,
    padding: 18,
    elevation: 3,

  },

 
  editTxt: {
    color: '#007bff',
    fontSize: 18,
  },
 
  Txt: {
    marginLeft: 11,
    color: 'black',
    fontSize: 17,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

});

export default ClientProfile;
