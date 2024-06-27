import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../config';
import { getAuth } from 'firebase/auth';


const AdminChat = () => {
  const [halls, setHalls] = useState([]);
  const navigation = useNavigation();
  const auth = getAuth();
  const currentUser = auth.currentUser;

    // Navigating to ChatDetails with params
    const handleHallPress = (hall) => {
      navigation.navigate('ChatDetails', { user: hall, role: 'admin' , image: hall.imageURL})};


  useEffect(() => {
    const fetchHallsWithLastMessage = async () => {
      try {
        const usersArray = [];
        const hallsRef = collection(db, 'HallsMessages');
        const hallsSnapshot = await getDocs(hallsRef);

        // Loop  on docs 
        for (const doc of hallsSnapshot.docs) {
          const messagesRef = collection(db, `HallsMessages/${doc.id}/messages`);
          const q = query(messagesRef, orderBy('createdAt', 'desc'));
          const messagesSnapshot = await getDocs(q);

          let imageURL = ''; 
          let lastNuser = '';  // the  user that chat with  admin
      
          if (!messagesSnapshot.empty) {
            for (const messageDoc of messagesSnapshot.docs) {  // Find the  user who is not the current user and chat with admin
              const messData = messageDoc.data();
              if (messData.user?._id !== currentUser.uid) {
                lastNuser = messData.user?.name;
                const userQuery = query(collection(db, 'users'), where('userId', '==', messData.user?._id)); // Fetching image URL 
                const userQuerySnapshot = await getDocs(userQuery);
                if (!userQuerySnapshot.empty) {
                  const userData = userQuerySnapshot.docs[0].data();
                  imageURL = userData.imageURL || ''; 
                }
                break; 
              }}}

          usersArray.push({
            _id: doc.id,
            name: doc.id,
            imageURL: imageURL, 
            lastUser: lastNuser,
          });
        }
        setHalls(usersArray);
      } catch (error) {
        console.log('Error while fetching users chating:', error);
      }
    };

    fetchHallsWithLastMessage();
  }, [currentUser]); 





  return ( //rendering the list of users using flat list 
    <View style={styles.container}> 
        <FlatList
          data={halls}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.hallItm} onPress={() => handleHallPress(item)}>
              <View style={styles.hallItmCont}>
                <Image
                  source={{ uri: item.imageURL } }
                  style={styles.userImg}
                />
                <View>
                  <Text style={styles.UName}>{item.lastUser}</Text>
                  <Text style={styles.hallName}>{item.name + " Hall"}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 17,
  },

  hallItmCont: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  hallItm: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
 
  hallName: {
    color: '#888',
    fontSize: 17,
  },
  userImg: {
    width: 61,
    borderRadius: 50,
    marginRight: 10,
    height: 61,
  },


  UName: {
    fontSize: 18,
    fontWeight: 'bold',
  },

});

export default AdminChat;
