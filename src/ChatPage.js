import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, StatusBar } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { GiftedChat } from 'react-native-gifted-chat';
import { auth, db } from '../config';
import { collection, query, getDocs, orderBy, onSnapshot, addDoc, where, doc, setDoc } from 'firebase/firestore';
import profileimage from '../assets/image.png';
import Icon from 'react-native-vector-icons/Ionicons';


const ChatPage = () => { //chat of the button chat in reservation page
  const navigation = useNavigation();
  const currentUser = auth.currentUser;
  const route = useRoute();
  const [userData, setUserData] = useState({ imageUrl:null, fullName: '' });
  const [messages, setMessages] = useState([]);
  const { hallName, OwnerId } = route.params;

  useEffect(() => {// Fetching image and name of the Owner
    const OwnerData = async () => {
      try {
        const userQuery = query(collection(db, 'users'), where('userId', '==', OwnerId));
        const userQuerySnapshot = await getDocs(userQuery);
          const userData = userQuerySnapshot.docs[0].data();
          const { firstName, lastName, imageURL } = userData;
          if (imageURL) { //there is image alresady in database
            setUserData({
              imageUrl: imageURL,
              fullName: `${firstName} ${lastName}`,
            });
          } else {
            setUserData({ // set  the default image if there is no image fetched
               imageUrl: profileimage, 
               fullName: `${firstName} ${lastName}`,
            });
          }}
           catch (error) {
           console.error('Error while fetching data:', error);
         }
    };
    OwnerData();
  }, [OwnerId]);

  useEffect(() => {  // getting the chat messages from database

    const messagesRef = collection(db, `HallsMessages/${hallName}/messages`);
    const q = query(messagesRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          _id: doc.id,
          text: data.text,
          createdAt: data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt.seconds * 1000),
          user: {
            _id: data.user._id,
            name: data.user.name,
            avatar: data.user.avatar, 
            OwnerID:OwnerId
          },
        };
      });
      setMessages(newMessages);
    });

    return unsubscribe;
  }, [hallName]);

  // function to send  messages
  const handleSend = async (newMessages = []) => {
    const { text } = newMessages[0];
    const hDocRef = collection(db, `HallsMessages/${hallName}/messages`);
    try {
      let userName = userData.fullName;
      await addDoc(hDocRef, {
        text,
        createdAt: new Date(),
        user: {
          _id: currentUser.uid,
          name: userName,
          avatar: userData.imageUrl, 
          OwnerID:OwnerId

        },
        dummy: true, //   dummy field for make the doc countable in other pages 
      });
      
      //  add dummy field if notadded
      const hallDocRef = doc(db, 'HallsMessages', hallName);
      await setDoc(hallDocRef, { dummy: true }, { merge: true });

    } catch (error) {
      console.error('Error while sending messages:', error);
    }
  };

  
  useFocusEffect( // for the bar settings
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content');
      StatusBar.setBackgroundColor('#00e4d0');
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 ,top:20}}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Image source={{ uri: userData.imageUrl }} style={styles.headerImage} />
        <Text style={styles.headerText}>{userData.fullName}</Text>
      </View>

      <GiftedChat
        messages={messages}
        onSend={handleSend}
        user={{
          _id: currentUser.uid,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    backgroundColor: '#00e4d0',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    top:20,
    alignItems: 'center',
    height:110,
    paddingHorizontal: 10,
  },

  headerText: {
    color: 'black',
    top:20,
    fontSize: 19,
    fontWeight: 'bold',
    
  },

  headerImage: {
    width: 40,
    marginRight: 10,
    borderRadius: 20,
    top:20,
    height: 40,

  },

});

export default ChatPage;
