import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const AdminComments = () => {
  const [comments, setComments] = useState({});
  const [userImage, setUserImage] = useState({});
  const defaultProfileImage = require('../../assets/image.png');

  useEffect(() => { //fetching the comments 
    const fetchComments = async () => {
      try {
        const ratingsCol = collection(db, 'ratings');
        const querySnapshot = await getDocs(ratingsCol);
        const commentforhall = {};

        querySnapshot.forEach(doc => {
          const data = doc.data();
          const hallId = doc.id;
          if (data.comments && data.comments.length > 0) { // check if there is comments 
            commentforhall[hallId] = data.comments;
          }
        });
        setComments(commentforhall);

        // Fetching profile images  
        const usersCol = collection(db, 'users');
        const userImage = {};
        for (const hallId in commentforhall) {
          const comments = commentforhall[hallId];
          for (const comment of comments) {
            const [firstName, ...lastNameParts] = comment.user.split(' ');
            const lastName = lastNameParts.join(' ');
            const userQuery = query(
              usersCol,
              where('firstName', '==', firstName),
              where('lastName', '==', lastName)
            );
            const userSnapshot = await getDocs(userQuery);
            if (!userSnapshot.empty) {
              userSnapshot.forEach(userDoc => {
                userImage[comment.user] = userDoc.data().imageURL || defaultProfileImage;
              });
            } else {
              userImage[comment.user] = defaultProfileImage;
            }
          }
        }
        setUserImage(userImage);
      } catch (error) {
        console.error('Error while fetching comments:', error);
      }
    };

    fetchComments();
  }, []);

  return (
    <ScrollView style={styles.cont}>
      <Text style={styles.pageTitle}>Comments</Text>
      {Object.keys(comments).map(hallId => (
        <View key={hallId} style={styles.Section}>
          <Text style={styles.Title}>{hallId}</Text>
          {comments[hallId].map((comment, index) => (
            <View key={index} style={styles.Card}>
              <Image 
                source={userImage[comment.user] !== defaultProfileImage ? { uri: userImage[comment.user] }: defaultProfileImage
                } 
                style={styles.Img} 
              />
              <View style={{ flex: 1}}>
                <Text style={styles.Name}>{comment.user}</Text>
                <Text style={{ fontSize: 14, color: '#555'}}>{comment.text}</Text>
              </View>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  
  pageTitle: { 
    color: 'black',
    marginBottom: 21,
    left:11,
    fontSize: 26,
    fontWeight: 'bold',
  },

  Section: {
    marginBottom: 19,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 11,
  },

  cont: {
    backgroundColor: '#f5f5f5',
    padding: 11,
    flex: 1,
  },

  Title: {
    marginBottom: 11,
    color: '#00bfa5',
    fontSize: 20,
    fontWeight: 'bold',
  },

  Card: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    position: 'relative',
  },

  Name: {   
    fontSize: 17,
    color: 'black',
    fontWeight: 'bold',
  },

  Img: {
    width: 55,
    height: 55,
    borderRadius: 20,
    marginRight: 12,
  },
});

export default AdminComments;
