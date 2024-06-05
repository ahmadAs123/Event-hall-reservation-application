import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth } from "firebase/auth";
import { db } from "../../config";
import { collection, getDocs , query , where , deleteDoc, doc  } from "firebase/firestore";

const ClientReservations = () => {
  const [ALL_res, setAll_Res] = useState([]);

  useEffect(() => { //getting the halls that the user reserved
    const fetchData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const uid = user.uid;
        const resColl = collection(db, 'reservations');
        const q = query(resColl, where('userId', '==', uid));
        const querySnapshot = await getDocs(q);
        const UserRes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAll_Res(UserRes);
      }
    };
    fetchData();
  }, []);

  

// function for deleting the reservation from the db and the list
const dltRes = async (id) => {  
  try {
    await deleteDoc(doc(db, 'reservations', id));
    setAll_Res(ALL_res.filter(res => res.id !== id));
  } catch (error) {
    alert("Error while deleting: " + error.message);  }
};



  const renderItem = ({ item }) => (  // for showing the list and its details
    <View style={styles.ResList}>
      <Text style={styles.ResText}>Hall Name: {item.hallName}</Text>
      <Text style={styles.ResText}>Location: {item.location}</Text>
      <Text style={styles.ResText}>Date: {item.date}</Text>
      <Text style={styles.ResText}>Shift: {item.shift}</Text>
      <TouchableOpacity onPress={() => dltRes(item.id)} style={styles.dltButt}>
        <Text style={styles.dltButttxt}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );


  return (
    <View style={styles.cont}>
      <FlatList
        data={ALL_res}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cont: {
    flex: 1,
    padding: 20,
  },
  dltButttxt: {
    fontWeight: 'bold',
    color: 'white',
  },


  dltButt: {
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 10,
    width:100,
    left:110,
    marginTop: 12,
  },

  ResList: {
    padding: 17,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },

  ResText: {
    fontSize: 15,
    marginBottom: 6,
  },
 

});


export default ClientReservations;
