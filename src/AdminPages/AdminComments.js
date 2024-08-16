import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { getAuth } from "firebase/auth";
import { Ionicons } from '@expo/vector-icons';

const AdminComments = () => {
  const [comments, setComments] = useState({});
  const [userImage, setUserImage] = useState({});
  const [noComments, setNoComments] = useState(false);
  const [loading, setLoading] = useState(true);
  const defaultProfileImage = require('../../assets/image.png');

  useEffect(() => {//fetching the comments 
    const fetchComments = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        const userId = user.uid;
        
        const usersCol = collection(db, 'users');
        const userQuery = query(usersCol, where('userId', '==', userId));
        const userSnapshot = await getDocs(userQuery);
        let postedHalls = [];
        
        userSnapshot.forEach(userDoc => {
          const userData = userDoc.data();
          postedHalls = userData['posted halls'] || [];
        });

        if (postedHalls.length === 0) {
          setNoComments(true);
          setLoading(false);
          return;
        }

        const hallNames = postedHalls.map(hall => hall.hallName);

        const ratingsCol = collection(db, 'ratings');
        const ratingsQuery = query(ratingsCol, where('hallName', 'in', hallNames));  
        const ratingsSnapshot = await getDocs(ratingsQuery);
        const commentForHall = {};

        ratingsSnapshot.forEach(doc => {
          const data = doc.data();
          const hallName = data.hallName;
          if (data.comments && data.comments.length > 0) {
            commentForHall[hallName] = data.comments;
          }
        });

        if (Object.keys(commentForHall).length === 0) {
          setNoComments(true);
        } else {
          setComments(commentForHall);
        }

        // Fetch profile images separately
        const userImageMap = {};
        for (const hallName in commentForHall) {
          const comments = commentForHall[hallName];
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
                userImageMap[comment.user] = userDoc.data().imageURL || defaultProfileImage;
              });
            } else {
              userImageMap[comment.user] = defaultProfileImage;
            }
          }
        }
        setUserImage(userImageMap);
      } catch (error) {
        console.error('Error while fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00bfa5" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.cont}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Comments</Text>
        <Ionicons name="chatbubble" size={27} color="#00bfa5" style={styles.icon} />     
         </View>
      {noComments ? (
        <View style={styles.noCommentsContainer}>
          <Text style={styles.noCommentsText}>There are no comments.</Text>
        </View>
      ) : (
        Object.keys(comments).map(hallName => (
          <View key={hallName} style={styles.Section}>
            <Text style={styles.Title}>{hallName}</Text>
            {comments[hallName].map((comment, index) => (
              <View key={index} style={styles.Card}>
                <Image
                  source={userImage[comment.user] !== defaultProfileImage ? { uri: userImage[comment.user] } : defaultProfileImage}
                  style={styles.Img}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.Name}>{comment.user}</Text>
                  <Text style={{ fontSize: 14, color: '#555' }}>{comment.text}</Text>
                </View>
              </View>
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  pageTitle: { 
    color: 'black',
    marginLeft: 9, 
    fontSize: 26,
    fontWeight: 'bold',
  },
  icon: {
    left:10,
    top:2
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
  noCommentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCommentsText: {
    fontSize: 18,
    color: '#555',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AdminComments;
