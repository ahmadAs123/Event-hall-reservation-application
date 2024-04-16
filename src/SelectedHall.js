import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, View, Text, Dimensions, TouchableOpacity, StyleSheet, Image } from 'react-native';

const { width: Width, height: Height } = Dimensions.get('window');

const SelectedHall = () => {


  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const Imgs = [
    require("../assets/weddingHall3.jpg"),
    require("../assets/weddingHall2.jpg"),
    require("../assets/weddingHall1.jpg"),
    require("../assets/weddingHall.jpg"),
  ];

  useEffect(() => { // showing image automaticlly every 3 sec 
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % Imgs.length;
      scrollViewRef.current.scrollTo({
        x: nextIndex * Width,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const imageContainerHeight = Height * 0.3;




  const Reservation = () => { //func when the reserve button pressed
    console.log("Reservation button pressed");
  };



  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: imageContainerHeight }}>
        <ScrollView horizontal pagingEnabled ref={scrollViewRef}>
          {Imgs.map((img, i) => (
            <Image key={i} source={img} style={{ width: Width, height: '100%' }} />
          ))}
        </ScrollView>
      </View>

      <View style={{ padding: 100 }}>

        <View style={styles.Name}>
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>Royal white</Text>
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
              <Text style={styles.answer}>Jerusalem</Text>
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
              <Text style={styles.answer}>200</Text>
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
    fontSize: 16,
    left:50,
    marginBottom:15
  },
});

export default SelectedHall;
