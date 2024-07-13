import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { db } from '../../config';


const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const auth = getAuth();
  const navigation = useNavigation();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchPosts = async () => {   // fucntion to fethc all the post for the admin user 
      try {
        const userQuery = query(collection(db, 'users'), where('userId', '==', currentUser.uid));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          const postedHalls = userData['posted halls'];
          setPosts(postedHalls);
        }
      } catch (error) {
        console.error('Error  while fetching posts data:', error);
      }
    };
    fetchPosts();
  }, [currentUser.uid]);




  const DeletePress = async (hall) => {
      // console.log("im here")
    try {
      Alert.alert(
        'Deleting Hall', `Are you sure you want to delete "${hall.hallName}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => { // Deleting hall from the list 
              const hallRef = doc(db, 'Halls', hall.id);
              await deleteDoc(hallRef);
              const userQuery = query(collection(db, 'users'), where('userId', '==', currentUser.uid)); // delete  hall from  posted halls
              const userSnapshot = await getDocs(userQuery);
              if (!userSnapshot.empty) { //if not empty 
                const userDoc = userSnapshot.docs[0];
                const userData = userDoc.data();
                const updatedHalls = userData.postedHalls.filter((h) => h.id !== hall.id);
                await updateDoc(userDoc.ref, { postedHalls: updatedHalls });
                setPosts(updatedHalls);
              }
            },
          },
        ],
        { cancelable: false }
      );

    } catch (error) {
      console.error('Error while deleting hall:', error);
    }
  };



  const EditPress = (hall) => {
    // console.log("im here")
    navigation.navigate('EditPost', { hall });
  };
  

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <Image source={{ uri: item.images[0] }} style={styles.Img} />
        <View style={{padding: 17}}>
          <Text style={styles.hallName}>{item.hallName}</Text>
          <View style={{ flexDirection: 'row',justifyContent: 'space-between'}}>
            <TouchableOpacity style={styles.editButt} onPress={() => EditPress(item)}>
              <Text style={styles.buttTxt}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dlteButt} onPress={() => DeletePress(item)}>
              <Text style={styles.buttTxt}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return ( // rendering the list
    <View style={styles.cont}>
      <FlatList
        data={posts}
        keyExtractor={(item, index) => `${item.hallName}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom: 32}}
      />
    </View>
  );
};

const styles = StyleSheet.create({

  cont: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    flex: 1,
  },


  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth:1
  },

  dlteButt: {
    backgroundColor: 'red',
    paddingHorizontal: 17,
    borderRadius: 5,
    paddingVertical: 9,
  },

  Img: {
    width: '100%',
    height: 220,
  },

  hallName: {
    fontWeight: 'bold',
    marginBottom: 9,
    fontSize: 19,
    color: 'black',
  },

 
  editButt: {
    backgroundColor: 'blue',
    paddingVertical: 9,
    paddingHorizontal: 17,
    borderRadius: 5,
  },



  buttTxt: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

});

export default AdminPosts;
