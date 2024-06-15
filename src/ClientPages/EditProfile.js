import React, { useState } from 'react';
import { View, TextInput,Text , TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { doc, getDocs, updateDoc, collection, query, where } from 'firebase/firestore';
import { db } from "../../config";  
export default function EditProfile({ route, navigation }) {
  const { fname,lname, email, phone, location, id,   } = route.params;

  const [fnameS, setFNameS] = useState(fname);
  const [lnameS, setLNameS] = useState(lname);
  const [phoneS, setPhoneS] = useState(phone);
  const [emailS, setEmailS] = useState(email);
  const [locationS, setLocationS] = useState(location);

  const Save = async () => {
    try {
      const q = query(collection(db, 'users'), where('userId', '==', id));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userRef = doc(db, 'users', userDoc.id);

        const updatedData = {
          firstName: fnameS,
          lastName:lnameS,
          phone: phoneS,
          address: locationS,
          email: emailS,

        };
        await updateDoc(userRef, updatedData);
        alert('Details saved successfully!');
        navigation.goBack();
      } 
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  return (
    <View style={styles.cont}>
      <View style={styles.feild}>
        <FontAwesome name="user" size={21} color="#00e4d0" style={{ marginRight: 11,}} />
        <Text style={styles.lbl}>First Name</Text>
        <TextInput
          style={styles.txt}
          value={fnameS}
          onChangeText={setFNameS}
        />
      </View>

      <View style={styles.feild}>
        <FontAwesome name="user" size={21} color="#00e4d0" style={{ marginRight: 11,}} />
        <Text style={styles.lbl}>Last Name</Text>
        <TextInput
          style={styles.txt}
          value={lnameS}
          onChangeText={setLNameS}
        />
      </View>



    
      <View style={styles.feild}>
        <MaterialIcons name="email" size={21} color="#00e4d0"  style={{ marginRight: 11,}} />
        <Text style={styles.lbl}>Email </Text>
        <TextInput
          style={styles.txt}
          onChangeText={setEmailS}
          value={emailS}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.feild}>
        <FontAwesome name="phone" size={21} color="#00e4d0"  style={{ marginRight: 11,}} />
        <Text style={styles.lbl}>Phone </Text>
        <TextInput
          style={styles.txt}
          onChangeText={setPhoneS}
          value={phoneS}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.feild}>
        <FontAwesome name="map-marker" size={21} color="#00e4d0"  style={{ marginRight: 11,}} />
        <Text style={styles.lbl}>Address</Text>
        <TextInput
          style={styles.txt}
          onChangeText={setLocationS}
          value={locationS}

        />
      </View>
      <TouchableOpacity style={styles.saveBut} onPress={Save}>
        <Text style={styles.sButTxt}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({

  cont:{
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },

  feild: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
 
  lbl: {
    flex: 1,
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
  },

  saveBut: {
    marginTop: 41,
    left:"37%",
    backgroundColor: '#00e4d0',
    alignItems: 'center',
    padding: 14,
    width:100,
    borderRadius: 5,
  },

  txt: {
    flex: 3,
    borderColor: '#ddd',
    fontSize: 17,
    borderRadius: 6,
    padding: 11,
    borderWidth: 2,
    backgroundColor: 'white',
  },

  sButTxt: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,

  },
});
