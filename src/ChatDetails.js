import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { useRoute } from '@react-navigation/native';
import { View, Text, Image, StyleSheet,StatusBar  ,TouchableOpacity} from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, where, getDocs } from 'firebase/firestore';
import { db } from '../config';
import { useNavigation ,useFocusEffect  } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const ChatDetails = () => {
  const navigation = useNavigation(); 
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const route = useRoute();
  const [messages, setMessages] = useState([]);
  const { user, role, image } = route.params; // Get the user and the kind of the user and image profile

  const Avatar = (props) => {
    const avatar = props.currentMessage.user._id === currentUser.uid ? currentUser.photoURL : image; // Use the passed image for other users
    return (
      <Image
        source={{ uri: avatar }} 
        style={{
          height: 41,
          width: 41,
          borderRadius: 21,
        }}
      />
    );
  };

  const rendBubble = (props) => { //changing the style of the bubble
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            top: 12,
            marginBottom: 11,
          }}}
      />
    )
  };

  useEffect(() => {
    let unsubscribe;
    const fetchMess = async () => { //function for fetching the messages from the firestore

      try {
        const messCollRef = collection(db, `HallsMessages/${user.name}/messages`);
        const message = query(messCollRef, orderBy('createdAt', 'desc'));
        unsubscribe = onSnapshot(message, snapshot => {
          const NewMess = snapshot.docs.map(async doc => {
            const data = doc.data();
            let Name = ''; 
            if (data.user?._id !== currentUser.uid) {  // Fetching  name of the user that contact with me from users collection
              try {
                const userQuery = query(collection(db, 'users'), where('userId', '==', data.user._id));
                const userQuerySnapshot = await getDocs(userQuery);

                userQuerySnapshot.forEach(userDoc => {
                  const userData = userDoc.data();
                  Name = `${userData.firstName} ${userData.lastName}`;
                });
              } catch (error) {
                console.error('Error while fetching name of the user :', error);
              } 
            }

            return {
              _id: doc.id,
              createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
              text: data.text,
              user: {
                _id: data.user?._id,
                name: Name,
              },
              senderName: Name,
            }
          });
          Promise.all(NewMess).then(resultMessages => {
            setMessages(resultMessages);
          });
        });
      } catch (error) {
        console.error('Error setting up snapshot listener:', error);
      }
    };

    fetchMess();

    return () => { // Cleaning function because the onSnapshot function
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user.name, currentUser.uid]);

  useFocusEffect( //for the status bar to make it in the same color of the header 
    useCallback(() => {
      StatusBar.setBackgroundColor('#00e4d0');
      StatusBar.setBarStyle('light-content');      
    }, [])
  );


  const onSend = useCallback(async (newMessages = []) => {
    const message = newMessages[0];
    let Name = role === 'admin' ? 'Admin' : 'Client';  //the kind of the user

    try {
      const userQuery = query(collection(db, 'users'), where('userId', '==', currentUser.uid)); // Fetching  name of the user that contact with me from users collection
      const userQuerySnapshot = await getDocs(userQuery);
      userQuerySnapshot.forEach(userDoc => {
        const userData = userDoc.data();
        Name = `${userData.firstName} ${userData.lastName}`;
      });
    } catch (error) {
      console.error('Error while fetching user name:', error);
    }

    const newMess = {
      _id: `${currentUser.uid}-${Date.now()}`, // Generating ID for the message using the curr timestamp
      createdAt: serverTimestamp(),
      text: message.text,
      user: {
        _id: currentUser.uid,
        name: Name,
      },
    };

    setMessages(previousMessages => GiftedChat.append(previousMessages, [{
      ...newMess,
      senderName: Name,
    }]));

    try {
      await addDoc(collection(db, `HallsMessages/${user.name}/messages`), {
        ...newMess,
        user: {
          _id: currentUser.uid,
          name: Name,
        },
      });
    } catch (error) {
      console.error('Error while sending the message:', error);
    }
  }, [role, user.name, currentUser]);

 
  return (
    <View style={{ flex: 1 }}>

      <View style={styles.header}>
    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 1,left:7}}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Image source={{ uri: image }} style={styles.headerImage} />
        <Text style={styles.headerText}>{user.lastUser}</Text>
      </View>

      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <GiftedChat
          messages={messages}
          onSend={newMessages => onSend(newMessages)}
          user={{
            _id: currentUser.uid,
          }}
          renderBubble={(props) => rendBubble(props)}
          renderUsernameOnMessage={true}
          renderAvatar={Avatar}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00e4d0',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical:40,
    top:0,
    paddingTop: StatusBar.currentHeight || 0, // Ensure header starts below the StatusBar
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 25,
    left:15
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChatDetails;
