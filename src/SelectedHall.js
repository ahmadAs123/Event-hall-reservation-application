import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, View, Text, Dimensions, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRoute } from '@react-navigation/native'; 
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config"; // Import Firestore instance

const { width: Width, height: Height } = Dimensions.get('window');

const SelectedHall = () => {
  const [hallsData, setHallsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const route = useRoute(); 
  const HallName  = route.params; 
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hallsData = [];
        const q = collection(db, 'users'); 
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc => {
          const userData = doc.data(); 
          const userPosts = userData['posted halls'] || [];

          userPosts.forEach((post, index) => {      
            if (post.hallName === HallName) {
              hallsData.push({
                id: index.toString(),
                capacity: post.capacity,
                name: post.hallName,
                location: post.place,
                images: post.images || null // Ensure it's an array or null
              });
            }
          });
        });
        setHallsData(hallsData);
      } catch (err) {
        console.error('Error while fetching data:', err);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % hallsData.length;
      scrollViewRef.current.scrollTo({
        x: nextIndex * Width,
      });
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [HallName, currentIndex]);

  const imageContainerHeight = Height * 0.3;

  const Reservation = () => {
    console.log("Reservation button pressed");
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: imageContainerHeight }}>
        <ScrollView horizontal pagingEnabled ref={scrollViewRef} >
          {hallsData.map((hall, index) => (
            <Image key={index} source={{ uri: hall.images && hall.images[currentIndex] }} style={{ width: Width, height: '100%' }} />
          ))}
        </ScrollView>
      </View>

      {hallsData.map((hall, index) => (
        <View key={index} style={{ padding: 100 }}>
          <View style={styles.Name}>
            <Text style={{ fontSize: 22, fontWeight: "bold" }}>{hall.name}</Text>
          </View>

          <View style={styles.Details}>
            <View style={styles.row}>
              <Text style={styles.lbl}>Type:</Text>
              <View style={styles.ansCon}>
                <Text style={styles.answer}>Weddings</Text>
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
                <Text style={styles.answer}>{hall.capacity}</Text>
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
    right: 15
  },
  
  ansCon: {
    flex: 1,
  },

  lbl: {
    fontSize: 16,
    width: 110, 
    marginBottom: 18
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
    fontSize: 16,
    left: 50,
    marginBottom: 15
  },
});

export default SelectedHall;
