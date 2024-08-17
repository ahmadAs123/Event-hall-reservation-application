import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet ,Image ,RefreshControl } from 'react-native';
import { db } from "../../config";
import { getDoc, doc, updateDoc, deleteDoc, collection, query, where, getDocs ,onSnapshot} from "firebase/firestore";
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { MaterialIcons } from '@expo/vector-icons'; 
import { Alert } from 'react-native';

const ClientReservations = () => {
  const navigation = useNavigation(); 
  const [ALL_res, setAll_Res] = useState([]);
  const [user, setUser] = useState(null); // for shuring that user is authenticated
  const [refreshing, setRefreshing] = useState(false); 

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

  const calculatePayment = (shift, cost ,isDis) => {
    const [startTime, endTime] = shift.split('-').map(time => parseInt(time.split(':')[0], 10));
    
    const duration = endTime - startTime;
    const discount = isDis ? (duration * cost * 0.1) : 0;
    const payment = (duration * cost) - discount;
    
    return payment.toFixed(2); 
  };

  useEffect(() => {
    if (user) {
      const uid = user.uid;
      const resColl = collection(db, 'reservations');
      const q = query(resColl, where('userId', '==', uid));
      const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
        const UserRes = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const cost = data.Cost || 0;
          const isDis= data.discount
          const payment = calculatePayment(data.shift, cost, isDis);
          return { id: doc.id, OwnerId: data.OwnerID, ...data, payment };
        });
        setAll_Res(UserRes);
        setRefreshing(false);
      });
  
      return () => {
        unsubscribeSnapshot();
      };
    } else {
      setAll_Res([]);
    }
  }, [user]);
  


 const onRefresh = () => {
  setRefreshing(true);
  if (user) {
    const uid = user.uid;
    const resColl = collection(db, 'reservations');
    const q = query(resColl, where('userId', '==', uid));
    const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
      const UserRes = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const cost = data.Cost || 0;
        const isDis =data.discount;
        const payment = calculatePayment(data.shift, cost ,isDis);
        return { id: doc.id, OwnerId: data.OwnerID, ...data, payment };
      });
      setAll_Res(UserRes);
      setRefreshing(false);
    });

    return () => {
      unsubscribeSnapshot();
    };
  } else {
    setAll_Res([]);
  }
}




// function for deleting the reservation from the db and the list
const dltRes = async (item) => {
  try {
    if (item.status === 'rejected') {
      await deleteDoc(doc(db, 'reservations', item.id));
    }
    if (item.status === 'accepted' ||item.status === 'pending') {
      const userQuery = query(collection(db, 'users'), where('userId', '==', user.uid));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        let currentPoints = userDoc.data().points || 0;
        if(currentPoints>0){
          currentPoints -= 10;
        await updateDoc(doc(db, 'users', userDoc.id), { points: currentPoints });
        }
        else{
          await updateDoc(doc(db, 'users', userDoc.id), { points: 0 });
        }
        
      } else {
        alert("User not found");
        return;
      }
    }

    await deleteDoc(doc(db, 'reservations', item.id));
    Alert.alert("Done","Reservation deleted successfully");
  } catch (error) {
    alert("Error while deleting: " + error.message);
  }
  };



  const confirmDelete = (item) => {
    if (item.status === 'rejected') {
      dltRes(item);
      return;
    }
    let message;

    if (item.status === 'accepted' || item.status === 'pending') {
    message = "This will deduct 10 points from your account. Are you sure you want to delete?";
    } 
    Alert.alert(
      "Delete Reservation",
     message,
      [
        {
          text: "Close",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => dltRes(item),
          style: "destructive"
        }
      ]
    );
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
            <Text style={[styles.ResText, { fontWeight: 'bold', color: 'green' ,left: 9}]}>Bill: {item.payment}$</Text>
            <View style={styles.statusContainer}>
            <Text style={styles.ResText}>  Status: </Text>
              <Text style={[styles.ResText, { color: SColor, fontWeight: 'bold', fontSize: 19 }]}>
               {item.status}
              </Text>
              <MaterialIcons name={SIcon} size={22} color={SColor} style={{marginLeft: 5}} />
            </View>
            <View style={styles.buttCont}>
            <TouchableOpacity onPress={() => confirmDelete(item)} style={styles.dltButt}>
            <Text style={styles.dltButttxt}>Cancel</Text>
              </TouchableOpacity>
              {item.status === 'accepted' && (
                <TouchableOpacity onPress={() =>navigation.navigate('ChatPage', {OwnerId: item.OwnerID,hallName: item.hallName,})} style={styles.chatButt}>
                  <FontAwesome name="comments" size={21} color="white" />
                  <Text style={{fontWeight:'bold' ,color: 'white'}}>Chat</Text>
                </TouchableOpacity>
              )}
          </View>
        </View>
      </View>
      </View>
    );
  };

  return (
    <View style={styles.cont}>
    <View style={styles.headerContainer}>
        <Text style={styles.header}>My Reservations</Text>
        <FontAwesome name="list" size={24} color="#555555" style={styles.headerIcon} />
      </View>
      <FlatList
       style={{ flex: 1 }}
        data={ALL_res}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>There are no reservations</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cont: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2', 
  },
  dltButttxt: {
    fontWeight: 'bold',
    color: 'white',
  },
  ResList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderRadius: 10, 
    backgroundColor: '#fff', 
    marginBottom: 16, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3, 
  },
  dltButt: {
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 8,
    width:100,
    marginTop: 30,
    right:'65%'
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

  buttCont: {
    flexDirection: 'row',
    alignItems: 'center',
  },
    
  header: {
    fontSize: 23,
    fontWeight: 'bold',
    top:-3
  },
  chatButt: {
    marginLeft:-5, 
    backgroundColor: 'blue',
    width: 70,
    marginTop:30,
    borderRadius: 6,
    alignItems: 'center',
    height:37,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16, 
  },
  header: {
    fontSize: 23,
    fontWeight: 'bold',
  },
  headerIcon: {
    marginLeft: 7, 
    top:3
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',


  },
  emptyText: {
    fontSize: 18,
    color: '#555555',
    textAlign: 'center', // Ensure the text is centered within its container

  },
});

export default ClientReservations;
