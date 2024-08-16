import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, TextInput, RefreshControl, Alert,ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, query, orderBy, where, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config';
import { getAuth } from 'firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importing Icon library

const AdminChat = () => {
  const [halls, setHalls] = useState([]);
  const [filteredHalls, setFilteredHalls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const currentUser = auth.currentUser;
// Navigating to ChatDetails with params
  const handleHallPress = (hall) => {
    navigation.navigate('ChatDetails', { user: hall, role: 'admin', image: hall.imageURL });
  };

  const fetchHallsWithLastMessage = async (isRefreshing = false) => {
    if (!isRefreshing) {
      setLoading(true);
    }
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
        let lastNuser = ''; // the  user that chat with  admin

        if (!messagesSnapshot.empty) {
          for (const messageDoc of messagesSnapshot.docs) {  // Find the  user who is not the current user and chat with admin
            const messData = messageDoc.data();
            if (messData.user?._id !== currentUser.uid) {
              console.log(messData.user?.name)
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
      setFilteredHalls(usersArray);
    } catch (error) {
      console.log('Error while fetching users chatting:', error);
    }
    finally {
      if (!isRefreshing) {
        setLoading(false);
      }
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHallsWithLastMessage();
  }, [currentUser]);

  useEffect(() => {
    const filtered = halls.filter(hall =>
      hall.lastUser.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHalls(filtered);
  }, [searchTerm, halls]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHallsWithLastMessage().finally(() => setRefreshing(false));
  };

  const Deletechat = async (hallId) => {
    try {
      await deleteDoc(doc(db, 'HallsMessages', hallId));
      setHalls(halls.filter(hall => hall._id !== hallId));
      setFilteredHalls(filteredHalls.filter(hall => hall._id !== hallId));
    } catch (error) {
      console.error('Error while  deleting chat:', error);
    }
  };

  const DeleteMess = (hallId) => {
    Alert.alert(
      'Delete Chat',
      'Are you sure you want to delete this chat?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => Deletechat(hallId),
          style: 'destructive',
        },
      ],
      { cancelable: true } 
    );
  };
  const handleRefresh = () => {
    setRefreshing(true);
    fetchHallsWithLastMessage(true);
  };

  return ( //rendering the list of users using flat list
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ):(
      <FlatList
        data={filteredHalls}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleHallPress(item)}>
            <View style={styles.cardContent}>
              <Image
                source={{ uri: item.imageURL }}
                style={styles.userImage}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>{item.lastUser}</Text>
                <Text style={styles.hallName}>{item.name.split('_')[0]}</Text>
              </View>
              <TouchableOpacity onPress={() => DeleteMess(item._id)}>
                <Icon name="more-vert" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 15,
    marginLeft: 10,
  },
  searchContainer: {
    backgroundColor: '#00e4d4',
    paddingHorizontal: 19,
    width: '105%',
    top: -10,
    paddingVertical: 11,
    marginBottom: 6,
    right: 9,
  },
  searchBar: {
    height: 43,
    backgroundColor: 'white',
    borderRadius: 30,
    paddingLeft: 17,
    top:1
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginRight: 10,
  },
  card: {
    backgroundColor: 'white',
    marginBottom: 9,
    borderRadius: 11,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  hallName: {
    fontSize: 16,
    color: '#888',
  },
});

export default AdminChat;
