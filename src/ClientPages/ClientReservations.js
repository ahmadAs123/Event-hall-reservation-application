import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet ,Image } from 'react-native';
import { getAuth } from "firebase/auth";
import { db } from "../../config";
import { collection, getDocs , query , where , deleteDoc, doc  } from "firebase/firestore";
import { onSnapshot } from 'firebase/firestore';

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
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const UserRes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAll_Res(UserRes);
      });
      
      return () => unsubscribe(); 
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



const renderItem = ({ item }) => { // for showing the list and its details
  return (
    <View style={styles.ResList}>
      <View style={styles.cardCont}>
        <Image
          source={{ uri: item.images && item.images.length > 0 ? item.images[0] : null }}
          style={styles.ResImg}
        />
        <View style={styles.dtlsCont}>
          <Text style={styles.ResText}>Hall Name: {item.hallName}</Text>
          <Text style={styles.ResText}>Location: {item.location}</Text>
          <Text style={styles.ResText}>Date: {item.date}</Text>
          <Text style={styles.ResText}>Shift: {item.shift}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => dltRes(item.id)} style={styles.dltButt}>
        <Text style={styles.dltButttxt}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  
  ResList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingVertical: 16,
    borderBottomColor: 'black',
  },

  
 
  dltButt: {
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 10,
    width:100,
    left:110,
    marginTop: 30,
  },
 
  ResList: {
    padding: 15,
    borderBottomColor: 'gray',
    borderBottomWidth: 2,
  },

  ResText: {
    fontSize: 15,
    marginBottom: 6,
  },
  cardCont: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  dtlsCont: {
    marginLeft: 45,
    top:7
  },

  ResImg: {
    width: 120,
    height: 120,
    borderRadius: 5,
    resizeMode: 'cover',
    marginTop: 4,
  },

});


export default ClientReservations;
