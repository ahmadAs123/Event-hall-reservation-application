import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../config';
import { getAuth } from 'firebase/auth';

const ClientChat = () => {
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();
  const currentUser = getAuth().currentUser;

  useEffect(() => {
    const fetchChatsWithLastMessage = async () => {
      try {
        const chatsArray = [];
        const chatsRef = collection(db, 'HallsMessages');
        const chatsSnapshot = await getDocs(chatsRef);

        for (const doc of chatsSnapshot.docs) {
          const messagesRef = collection(db, `HallsMessages/${doc.id}/messages`);
          const q = query(messagesRef, orderBy('createdAt', 'desc'));
          const messagesSnapshot = await getDocs(q);

          let lastMessageUserName = 'No messages';
          let imageURL = '';

          if (!messagesSnapshot.empty) {
            for (const messageDoc of messagesSnapshot.docs) {
              const messageData = messageDoc.data();
              // Fetch user image URL from the users collection and the Ownerid exist in one of the chats doc
              if (messageData.user && messageData.user.OwnerID) {
                const OwnerId = messageData.user.OwnerID;
                const userQuery = query(collection(db, 'users'), where('userId', '==', OwnerId));
                const userQuerySnapshot = await getDocs(userQuery);

                if (!userQuerySnapshot.empty) {
                  const userData = userQuerySnapshot.docs[0].data(); 
                  imageURL = userData.imageURL || ''; // Get the user's image URL
                  lastMessageUserName = userData.firstName + " " + userData.lastName; // Get the user's full name
                }
                break;
              }
            }
          }

          chatsArray.push({
            _id: doc.id,
            name: doc.id,
            lastUser: lastMessageUserName,
            imageURL: imageURL, 
          });
        }
        setChats(chatsArray);
        setFilteredChats(chatsArray);
        setLoading(false);
      } catch (error) {
        console.log('Error fetching chats:', error);
        setLoading(false);
      }
    };

    fetchChatsWithLastMessage();
  }, [currentUser.uid]);

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
                  <Text style={styles.hallName}>{item.name + " Hall Owner"}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
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
});

export default ClientChat;
