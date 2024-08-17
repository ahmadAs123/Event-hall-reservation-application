import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Image, TextInput,Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, query, orderBy, where ,deleteDoc,doc } from 'firebase/firestore';
import { db } from '../../config';
import { getAuth } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons'; 

const ClientChat = () => {
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();
  const currentUser = getAuth().currentUser;
  const [refreshing, setRefreshing] = useState(false);


 
    const fetchChatsWithLastMessage = async (isRefreshing = false) => {
      if (!isRefreshing) {
        setLoading(true);
      }
      try {
        const chatsArray = [];
        const chatsRef = collection(db, 'HallsMessages');
        const chatsSnapshot = await getDocs(chatsRef);
  
        for (const doc of chatsSnapshot.docs) {
          const messagesRef = collection(db, `HallsMessages/${doc.id}/messages`);
          const messagesQuery = query(messagesRef, orderBy('createdAt', 'desc'));
          const messagesSnapshot = await getDocs(messagesQuery);
  
          let lastMessageUserName = '';
          let imageURL = '';
  
          if (!messagesSnapshot.empty) {
            for (const messageDoc of messagesSnapshot.docs) {
              const messageData = messageDoc.data();
              const user = messageData.user;
  
              // Check if the user's _id matches the current user's uid
              if (user._id === currentUser.uid && user.OwnerID) {
                console.log ("the user id" + user._id)      
                // Fetch user image URL from the users collection if the OwnerID exists in one of the chat messages
                const OwnerId = user.OwnerID;
                const userQuery = query(collection(db, 'users'), where('userId', '==', OwnerId));
                const userQuerySnapshot = await getDocs(userQuery);
    
                if (!userQuerySnapshot.empty) {
                  const userData = userQuerySnapshot.docs[0].data();
                  imageURL = userData.imageURL || ''; // Get the user's image URL
                  lastMessageUserName = userData.firstName + " " + userData.lastName; // Get the user's full name
                }
                chatsArray.push({
                  _id: doc.id,
                  name: doc.id,
                  lastUser: lastMessageUserName,
                  imageURL: imageURL,
                });
                break;
              }
            }
          }
  
         
        }
  
        setChats(chatsArray);
        setFilteredChats(chatsArray);
      } catch (error) {
        console.log('Error fetching chats:', error);
      }
      finally {
        if (!isRefreshing) {
          setLoading(false);
        }
        setRefreshing(false);
      }
    };
  
    useEffect(() => {
      fetchChatsWithLastMessage();
    }, [currentUser.uid]);

  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchChatsWithLastMessage(true);
  };

  const Deletechat = async (hallId) => {
    try {
      await deleteDoc(doc(db, 'HallsMessages', hallId));
      setChats(chats.filter(chat => chat._id !== hallId));
      setFilteredChats(filteredChats.filter(chat => chat._id !== hallId));
    } catch (error) {
      console.error('Error while deleting chat:', error);
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


  useEffect(() => {
    const filtered = chats.filter(chat =>
      chat.lastUser.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredChats(filtered);
  }, [searchTerm, chats]);

  const handleChatPress = (chat) => {
    navigation.navigate('ChatDetails', { user: chat, role: 'client', image: chat.imageURL });
  };

  return (
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
      ) : filteredChats.length === 0 ? (
        <View style={styles.noChatsContainer}>
          <Text style={styles.noChatsText}>There are no chat messages yet</Text>
        </View>
      ) : (
        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => handleChatPress(item)}>
              <View style={styles.cardContent}>
                <Image
                  source={item.imageURL ? { uri: item.imageURL } : require('../../assets/image.png')}
                  style={styles.userImage}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.userName}>{item.lastUser}</Text>
                  <Text style={styles.hallName}>{item.name.split('_')[0] + " Hall Owner"}</Text>
                </View>
              <TouchableOpacity onPress={() => DeleteMess(item._id)} style={styles.menuButton}>
              <MaterialIcons name="more-vert" size={24} color="black" />
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
    width:'105%',
    top:-10,
    paddingVertical: 11,
    marginBottom: 6,
    right:9

  },
  searchBar: {
    height: 43,
    backgroundColor: 'white', 
    borderRadius: 30,
    paddingLeft: 17,
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

  noChatsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noChatsText: {
    fontSize: 18,
    color: '#888',
  },
  
});

export default ClientChat;
