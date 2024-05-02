import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, View, Text, Dimensions, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRoute } from '@react-navigation/native'; 
import { collection, getDocs, query, where } from "firebase/firestore";
import {db} from "../config"; // Import Firestore instance



const { width: Width, height: Height } = Dimensions.get('window');


const SelectedHall = () => {
  const [hallsData, setHallsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const route = useRoute(); 
  const HallName  = route.params; 
  const scrollViewRef = useRef(null);

  // const Imgs = [
  //   require("../assets/weddingHall3.jpg"),
  //   require("../assets/weddingHall2.jpg"),
  //   require("../assets/weddingHall1.jpg"),
  //   require("../assets/weddingHall.jpg"),
  // ];

  useEffect(() => {
    const fetchData = async () => { //fetching the data from firebase database 
      try {
        const hallsData = [];
        const q = collection(db, 'users'); 
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc => {
          const userData = doc.data(); 
          const userPosts = userData['posted halls'] || [];

          userPosts.forEach((post, index) => { 
            if (post.hallName === HallName) { //if the name matched with hall named that in data then take the information ot the hall
              hallsData.push({
                id: index.toString(),
                Capacity: post.capacity,
                name: post.hallName,
                location: post.place,
                images: post.images && post.images.length > 0 ? post.images : [], // if there is images push else make it empty 
                type: post.type
              });
            }
          
          });
        });
        setHallsData(hallsData);
        // console.log("Length of selected hall images:", hallsData[0]?.images?.length);
      } catch (err) {
        console.error('Error while fetching data:', err);
      }
    };

    fetchData();

    
  }, [HallName]);

  const imageContainerHeight = Height * 0.3;

  const Reservation = () => { //func when the reserve button pressed
    console.log("Reservation button pressed");
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: imageContainerHeight }}> 
        <ScrollView horizontal pagingEnabled ref={scrollViewRef} >    
        {hallsData.map((hall, index) => (  //for scrolling the fetched images
            hall.images.map((img, Index) => (
              <Image
                key={Index}source={{ uri: img }} style={{ width: Width, height: '100%' }}
              />
            ))
          ))}
        </ScrollView>
      </View>

      {hallsData.map((hall, index) => (
      <View  key={hall.id} style={{ padding: 100 }}>
     
        <View style={styles.Name}>
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>{hall.name}</Text>
        </View>
 
        <View style={styles.Details}>
          <View style={styles.row}>
            <Text style={styles.lbl}>Type:</Text>
            <View style={styles.ansCon}>
              <Text style={styles.answer}>{hall.type}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.lbl}>Location:</Text>
            <View style={styles.ansCon}>
              <Text style={styles.answer}>{hall.location}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.lbl}>Available Days:</Text>
            <View style={styles.ansCon}>
              <Text style={styles.answer}></Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.lbl}>Capacity:</Text>
            <View style={styles.ansCon}>
              <Text style={styles.answer}>{hall.Capacity}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.lbl}>Parking:</Text>
            <View style={styles.ansCon}>
              <Text style={styles.answer}>Yes</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.lbl}>Rating:</Text>
            <View style={styles.ansCon}>
              <Text style={styles.answer}>4.5</Text>
            </View>
          </View>
        </View>
       

        <View style={styles.button}>
          <TouchableOpacity onPress={Reservation}>
            <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}>Reserve </Text>
          </TouchableOpacity>
        </View>
        
      </View>
      ))}
    </View>
    
  );
};

const styles = StyleSheet.create({
  Name: {
    paddingLeft: 65,
    marginBottom: 5,
    right: 30,
    top: -70,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center"
  },
  
  Details: {
    justifyContent: "center",
    top: -28,
  },

  row: {
    
    alignItems: 'center',
    flexDirection: 'row',
    right:15
  },
  
  ansCon: {
    flex: 1,
  },

  lbl: {
    fontSize: 16,
    width: 110, 
    marginBottom:18
    
  },

  button: {
    backgroundColor: '#00e4d0',
    height: 50,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: '#00e4d0',
    marginTop: 30,
    left: 23
  },
  
  answer: {
    fontSize: 15,
    left:50,
    marginBottom:15
  },
});

export default SelectedHall;
