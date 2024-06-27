import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet ,Image } from 'react-native';
import { db } from "../../config";
import { collection, getDocs , query, where, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { MaterialIcons } from '@expo/vector-icons'; 

const ClientReservations = () => {
  const [ALL_res, setAll_Res] = useState([]);
  const [user, setUser] = useState(null); // for shuring that user is authenticated

  useEffect(() => { //getting the halls that the user reserved
    const auth = getAuth();
    //set the user status 
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribeAuth(); // Unsubscribe on unmount
    };
  }, []);
  useEffect(() => {
    if (user) { //if the user authenticated 
      const uid = user.uid;
      const resColl = collection(db, 'reservations');
      const q = query(resColl, where('userId', '==', uid));
      const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => { //to get all halls reservations
        const UserRes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAll_Res(UserRes);
      });

      return () => {
        unsubscribeSnapshot(); 
      };
    } else {
      setAll_Res([]); 
    }
  }, [user]);
// function for deleting the reservation from the db and the list
const dltRes = async (id) => {
    try {
      await deleteDoc(doc(db, 'reservations', id)); //deleting or cacelling the reservation  from the lest
    } catch (error) {
      alert("Error while deleting: " + error.message);
    }
  };

  const renderItem = ({ item }) => {// for showing the list and its details
    const SColor = item.status === 'accepted' ? 'green' : item.status === 'rejected' ? 'red' : 'black'; //for styling the status feild 
    const SIcon = item.status === 'accepted' ? 'check-circle' : item.status === 'rejected' ? 'cancel' : 'info';
    return (
      
      <View style={styles.ResList}>
        <View style={styles.cardCont}>
          <Image
            source={{ uri: item.images && item.images.length > 0 ? item.images[0] : null }}
            style={styles.ResImg}
          />
          <View style={styles.dtlsCont}>
            <Text style={[styles.ResText, { fontWeight: 'bold' ,fontSize:20}]}>{item.hallName}</Text>
            <Text style={styles.ResText}>  Date: {item.date}</Text>
            <Text style={styles.ResText}>  Shift: {item.shift}</Text>
            <View style={styles.statusContainer}>
            <Text style={styles.ResText}>  Status: </Text>
              <Text style={[styles.ResText, { color: SColor, fontWeight: 'bold', fontSize: 19 }]}>
               {item.status}
              </Text>
              <MaterialIcons name={SIcon} size={22} color={SColor} style={{marginLeft: 5}} />
            </View>
        <TouchableOpacity onPress={() => dltRes(item.id)} style={styles.dltButt}>
          <Text style={styles.dltButttxt}>Cancel</Text>
        </TouchableOpacity>
          </View>
        </View>
      </View>
      
    );
  };

  return (
    <View style={styles.cont}>
      <Text style={styles.header}>My Reservations</Text> 
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
    backgroundColor:'white'
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
    padding: 8,
    width:100,
    marginTop: 30,
    right:'27%'
  },
  ResText: {
    fontSize: 17,
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
    width: 130,
    height: 130,
    borderRadius: 5,
    resizeMode: 'cover',
    top:-20
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  header: {
    fontSize: 23,
    fontWeight: 'bold',
    top:-3
  },
  
});

export default ClientReservations;
