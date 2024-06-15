import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, View, Text, Dimensions, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { db } from "../config";  
import { Picker } from '@react-native-picker/picker'; 
import { collection, getDocs, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 
import { FontAwesome } from '@expo/vector-icons'; // 
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore"; 


const { width: Width, height: Height } = Dimensions.get('window');

const SelectedHall = ({ navigation }) => {
  const [hallsData, setHallsData] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedShift, setSelectedShift] = useState('');
  const [availableShifts, setAvailableShifts] = useState([]);
  const [resReq, setResReq] = useState(false);
  const [rating, setRating] = useState(0);
  const [activeTab, setActiveTab] = useState('Information');
 

  const route = useRoute();
  const HallName  = route.params;
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => { //fetching the data from firebase database 
      try {
        const hallsData = [];
        const availableDates = [];
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
                type: post.type,
                availableDates: post.selectedDates 
              });
              availableDates.push(...Object.keys(post.selectedDates));
            }
          });
        });
        setHallsData(hallsData);
        setAvailableDates(availableDates);
      } catch (err) {
        console.error('Error while fetching data:', err);
      }
    };

    fetchData();
  }, [HallName]);

  const ImgContHeight = Height * 0.3;

  const DateChange = (date) => {// func when i try to change the selected date from list 
    setSelectedDate(date);
    const selectedHall = hallsData.find(hall => hall.name === HallName); // search about the date in the data to get the shifts of its date
    const shifts = selectedHall.availableDates[date];
    setAvailableShifts(shifts);
  };

  const Reservation = async (hall) => { //func when the reserve button pressed
    console.log("Reservation button pressed");
    console.log("Selected Date:", selectedDate);
    console.log("Selected Shift:", selectedShift.start, '-', selectedShift.end);
    
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const uid = user.uid;
      const resData = {
        hallName: HallName,
        shift: `${selectedShift.start} - ${selectedShift.end}`,
        location: hallsData.find(hall => hall.name === HallName).location,
        date: selectedDate,
        userId: uid,
        images: hall.images
      };

      try {
        await addDoc(collection(db, "reservations"), resData);
        console.log("Reservation data added to Firestore");
        setResReq(true);
      } catch (error) {
        console.error("Error adding reservation data to Firestore:", error);
      }
    }
  };



const Rating = ({ rating, setRating }) => {
  return (
    <View>

    <View style={{ marginVertical: 11, flexDirection: 'row', justifyContent: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => setRating(star)}
        >
          <FontAwesome
            name={star <= rating ? 'star' : 'star-o'}
            size={50}
            color="gold"
          />
        </TouchableOpacity>
      ))}
     
    </View>
    <TouchableOpacity
        style={styles.Applybutt}
        onPress={() => Submit(HallName, rating)}
      >
        <Text style={styles.Applytxt}>Submit Rating</Text>
      </TouchableOpacity>
        </View>

    
  );
};



const Submit = async (hallName, rating) => { //submit the ratevalue to the database
  try {
    const ratingRef = doc(db, 'ratings', hallName);
    const ratingSnap = await getDoc(ratingRef);

    if (ratingSnap.exists()) {
      const ratingData = ratingSnap.data(); // making average of the rate 
      const TotalRate = ratingData.totalRate + rating;
      const NumRating = ratingData.rateCount + 1;
      const AvrRating = TotalRate / NumRating;

      await updateDoc(ratingRef, {
        averageRate: AvrRating,
      });
    } else {
      await setDoc(ratingRef, {//there is no collection its the first time
        hallName: hallName,
        totalRate: rating,
        rateCount: 1,
        averageRate: rating,
      });
    }
  } catch (error) {
    console.error("Error while rating:", error);
  }
};


  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: ImgContHeight }}>
        <ScrollView horizontal pagingEnabled ref={scrollViewRef}>
          {hallsData.map((hall) => (  //for scrolling the fetched images
            hall.images.map((img, index) => (
              <Image
                key={index} source={{ uri: img }} style={{ width: Width, height: '100%' }}
              />
            ))
         ))}
        </ScrollView>
      </View>

      {hallsData.map((hall) => (
        <View key={hall.id} style={{ padding: 20 }}>
          <View style={styles.Name}>
            <Text style={{ fontSize: 22, fontWeight: "bold" }}>{hall.name}</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 3,top:10 }}>
            <TouchableOpacity
              style={[styles.tabBut, activeTab === 'Information' && {borderColor :'#00e4d0'} ]}
              onPress={() => setActiveTab('Information')}
            >
            <Text style={styles.tabButTxt}>Information</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBut, activeTab === 'Rating' && {borderColor :'#00e4d0'}]}
              onPress={() => setActiveTab('Rating')}
            >
              <Text style={styles.tabButTxt}>Rating</Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'Information' && ( //if the information button clicked
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
                <Text style={styles.lbl}>Days:</Text>
                <View style={styles.ansCon}>
                  <Picker
                    selectedValue={selectedDate}
                    onValueChange={(Val) => DateChange(Val)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select" value="" />
                    {availableDates.map(date => (
                      <Picker.Item key={date} label={date} value={date} />
                    ))}
                  </Picker>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.lbl}>Times:</Text>
                <View style={styles.ansCon}>
                  <Picker
                    selectedValue={selectedShift}
                    onValueChange={(Val) => setSelectedShift(Val)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select" value="" />
                    {availableShifts.map((shift, i) => (
                      <Picker.Item key={i} label={`${shift.start} - ${shift.end}`} value={shift} />
                    ))}
                  </Picker>
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
              <View style={styles.buttCont}>
            <View style={styles.button}>
              <TouchableOpacity  onPress={() => Reservation(hall)} disabled={resReq}>
                <Text style={{ fontWeight: 'bold', color: 'white' ,fontSize: 20}}>
                  {resReq ? 'Request sent' : 'Reserve'}
                </Text>
              </TouchableOpacity>
            </View>

            {resReq && (
              <View style={styles.chatbutt}>
                <TouchableOpacity onPress={() => navigation.navigate('ChatPage')}>
                  <Text style={{ fontWeight: 'bold', color: 'white',fontSize: 20 }}>Chat</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
            </View>
            
          )}
          {activeTab === 'Rating' && ( //if the rating button clicked
            <View>
              <Text style={{ fontSize: 20, textAlign: 'center', marginVertical: 50 }}>
                Rate this hall
              </Text>
              <Rating rating={rating} setRating={setRating} />
            </View>
          )}
          
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
    top: 7, 
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center"
  },
  Details: {
    justifyContent: "center",
    top: 35,
    marginHorizontal: '7%',
    width: '140%',
  },
  picker: {
    flex: 1,
    height: 50,
    marginRight: 8,
    left: 31,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    right: -50,
  },
  ansCon: {
    flex: 1,
  },
  lbl: {
    fontSize: 16,
    width: 90,
    marginBottom: 18,
    right: 4,
    top:6
  },
  buttCont: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#00e4d0',
    height: 50,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    right:"19.5%",
    top:14
  },
  chatbutt: {
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: '#007aff',
    height: 50,
    width: 100,
    alignItems: 'center',
    marginTop: 1,
    left: 30,
    marginLeft: 10
  },
  answer: {
    fontSize: 15,
    left: 47,
    marginBottom: 5,
  },

  tabBut: {
    alignItems: 'center',
    flex: 1,
    borderBottomWidth: 2,
    borderColor: 'transparent',
    paddingVertical: 11,
  },
 
  tabButTxt: {
    fontSize: 17,
    color: '#007aff',
  },

  Applybutt: {
    alignItems: 'center',
    backgroundColor: '#00e4d0',
    marginLeft: 124,
    width:110,
    borderRadius: 5,
    height:50,
    top:90,
    justifyContent: 'center',
    borderWidth:1

  },
  Applytxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  
});

export default SelectedHall;
