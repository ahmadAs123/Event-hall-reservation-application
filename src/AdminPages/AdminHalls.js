import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet ,StatusBar} from 'react-native';
import LoadingPage from '../../component/LoadingPage';
import { doc, updateDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Icon from 'react-native-vector-icons/MaterialIcons';
import {db} from "../../config"



const AdminHalls = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  
  useEffect(() => {
    const fetchReq = async () => {
      try {
        const auth = getAuth();
        const Admin = auth.currentUser;
        const Uid = Admin.uid;
        const q = query(collection(db, "users"), where("userId", "==", Uid));
        const UserSnapshot = await getDocs(q);
        const Doc = UserSnapshot.docs[0];
        const Data = Doc.data();
        const Halls = Data['posted halls'];

        const Hallreq = [];

        for (const hall of Halls) { // search about all reservations halls of its user 
          const Rquery = query(collection(db, "reservations"), where("hallName", "==", hall.hallName),where("status", "==", "pending"));
          const Rsnapshot = await getDocs(Rquery);
          Rsnapshot.forEach(async (resDoc) => {
            const resData = resDoc.data();
            if (!Rsnapshot.empty) {
              Hallreq.push({
                id: resDoc.id,
                shift: resData.shift,
                day: resData.date,
                hallImage: hall.images[0] ,
                hallName: resData.hallName,
                userName: resData.Name,
              });

            }
          });
        }
        setRequests(Hallreq); // Set state once with all fetched data
        setLoading(false);
      } catch (error) {
        console.error("Error  while fetching fetching  the hall requests:", error);
        setLoading(false);
      }
    };
    fetchReq();
  }, []);      
  

  const ReStatus = async (id, status) => { // function for updating status
    try {
      const reservationRef = doc(db, "reservations", id);  
      await updateDoc(reservationRef, { status });
      setRequests(prevRequests => prevRequests.filter(request => request.id !== id));
    } catch (error) {
      alert(error)
    }
  };

  const handleReject = (id) => { // for updtate status to rejected 
    ReStatus(id, 'rejected');
  };
  
  const handleAccept = (id) => { // for updtate status to accepted
    ReStatus(id, 'accepted');
  };
  

  const renderRequest = ({ item }) => ( // for rendering the list and its details
    <View style={styles.reqCont}>
      <Image source={{ uri: item.hallImage }} style={styles.Img} />
      <View style={{flex: 1}}>
        <Text style={styles.Name}>{item.hallName}</Text>
        <Text  style={styles.data}>{`User: ${item.userName}`}</Text>
        <Text  style={styles.data}>{`Day: ${item.day}`}</Text>
        <Text  style={styles.data}>{`Shift: ${item.shift}`}</Text>
      </View>
      <View style={styles.icon}>
        <TouchableOpacity onPress={() => handleAccept(item.id)}>
          <Icon name="check-circle" size={31} color="green" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleReject(item.id)}>
          <Icon name="cancel" size={31} color="red" />
        </TouchableOpacity> 
      </View>
    </View>
  );

  if (loading) { //  for presenting the loading page
    return(<LoadingPage/>)
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
            <StatusBar backgroundColor="#00e4d0" barStyle="light-content" />
      <Text style={styles.label}>Halls Requests</Text>
      {requests.length === 0 ? (//if there is no requsets 
        <View style={styles.Cont}>
          <Text style={styles.Text}>Threre is no requests ! </Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={item => item.id}
          renderItem={renderRequest}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  reqCont: {
    flexDirection: 'row',             
    backgroundColor: 'white',                 
    shadowColor: '#000',                    
    elevation: 6,                      // for Android
    alignItems: 'center',
    borderRadius: 9,                   
    padding: 15,      
    shadowRadius: 3,                                 
    marginBottom: 11,  
  },
  Text: {
    color: '#555',
    fontSize: 17,  
  },

  Img: {
    width: 90,
    marginRight: 11,
    borderRadius: 6,
    height: 90,
  },
  Cont: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#333',
    top:4,
    left:7
  },

  icon: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    left:2,
    marginRight:2
  },
  Name: {
    fontWeight: 'bold',
    fontSize: 22,
    top:-5
  },
  data:{
    left:12,
  }

});
export default AdminHalls;
