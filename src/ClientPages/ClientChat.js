import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../config';
import { getAuth } from 'firebase/auth';

const ClientChat = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
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
              if (messageData.user?._id !== currentUser.uid) {
                lastMessageUserName = messageData.user?.name || 'Unknown';

                // Fetch user image URL from the users collection
                const userQuery = query(collection(db, 'users'), where('userId', '==', messageData.user?._id));
                const userQuerySnapshot = await getDocs(userQuery);
                if (!userQuerySnapshot.empty) {
                  const userData = userQuerySnapshot.docs[0].data();
                  imageURL = userData.imageURL || ''; // Get the user's image URL
                }
                break;
              }
            }
          }

          chatsArray.push({
            _id: doc.id,
            name: doc.id,
            lastUser: lastMessageUserName,
            imageURL: imageURL, // Add the image URL to the object
          });
        }
        setChats(chatsArray);
        setLoading(false);
      } catch (error) {
        console.log('Error fetching chats:', error);
        setLoading(false);
      }
    };

    fetchChatsWithLastMessage();
  }, [currentUser.uid]);

  const handleChatPress = (chat) => {
    navigation.navigate('ChatDetails', { user: chat, role: 'client', image: chat.imageURL }); // Pass imageURL
  };

  return (
    <View style={styles.container}>
        <FlatList
          data={chats}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.chatItem} onPress={() => handleChatPress(item)}>
              <View style={styles.chatItemContent}>
                <Image
                  source={item.imageURL ? { uri: item.imageURL } : require('../../assets/image.png')} // Use placeholder if no image URL
                  style={styles.userImage}
                />
                <View>
                  <Text style={styles.userName}>{item.lastUser}</Text>
                  <Text style={styles.hallName}>{item.name + " Hall Owner"}</Text>
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

  },
  chatItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  chatItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginRight: 10,
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
