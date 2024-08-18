import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, View, Text, Dimensions, TouchableOpacity, StyleSheet, Image ,TextInput,Linking } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { db } from "../config";  
import { Picker } from '@react-native-picker/picker'; 
import { collection, getDocs, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 
import { FontAwesome } from '@expo/vector-icons'; // 
import { doc, getDoc, updateDoc, setDoc ,query,where} from "firebase/firestore"; 
import { onSnapshot } from "firebase/firestore";
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper';  
import { Modal, TouchableWithoutFeedback } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';  // If it's not already imported
import { CheckBox } from 'react-native-elements'; // If you haven't already imported it
import Icon from 'react-native-vector-icons/Feather';



const { width: Width, height: Height } = Dimensions.get('window');

const SelectedHall = () => {
  const [hallsData, setHallsData] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedShift, setSelectedShift] = useState('');
  const [availableShifts, setAvailableShifts] = useState([]);
  const [resReq, setResReq] = useState(false);
  const [rating, setRating] = useState(0);
  const [activeTab, setActiveTab] = useState('Information');
  const [status, setStatus] = useState('pending');
  const [comment, setComment] = useState('');
  const [fname, setFname] = useState('');
  const [shiftsStatus, setShiftsStatus] = useState({});
  const [organizingEvent, setOrganizingEvent] = useState('I know already');
  const [modalVisible, setModalVisible] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const [jobOffers, setJobOffers] = useState([]);
  const [comments, setComments] = useState([]);
  const [commModVisible, setCommModVisible] = useState(false);
  const [fullImage, setFullImage] = useState(false);
  const [selImage, setSelImage] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [usePoints, setUsePoints] = useState(false);

  const route = useRoute();
  const HallName  = route.params;
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();  


  const convertLocToCoord = async (hallLocation) => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: hallLocation,
          format: 'json',
        },
      });
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setCoordinates({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
      } else {
        console.error('No coordinates found for this location.');
      }
    } catch (error) {
      console.error('Error while fetching coordinates:', error);
    }
  };

  useEffect(() => {
    if (hallsData.length > 0) {
      console.log(hallsData[0])
      convertLocToCoord(hallsData[0].place);
    }
  }, [hallsData]);
  
  const ImageClick = (imageUrl) => {
    setSelImage(imageUrl);
    setFullImage(true);
  };


  const renderFullImg= () => (
    <Modal
      visible={fullImage}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setFullImage(false)}
    >

      <TouchableWithoutFeedback onPress={() => setFullImage(false)}>
        <View style={styles.fullScrMod}>
          <Image source={{ uri: selImage }} style={styles.fullScrImg} />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  const fetchComments = async (hallName) => { //fetching commemnts for specific hall
    try {
      const ratingRef = doc(db, 'ratings', hallName);
      const ratingSnap = await getDoc(ratingRef);
      if (ratingSnap.exists()) {
        const ratingData = ratingSnap.data();
        setComments(ratingData.comments || []);
        setCommModVisible(true);
      } else {
        console.log('No comments found !');
      }
    } catch (error) {
      console.error('Error while fetching comments:', error);
    }
  };

  const renderJobOffers = () => {
    return jobOffers.map((offer, index) => (
      <View key={index} style={styles.card}>
        <Text style={styles.cardTitle}>{offer.title}</Text>
        <View style={styles.infoRow}>
          <FontAwesome name="user" size={20} color="black" style={{marginRight: 10,}} />
          <Text style={styles.cardText}>{offer.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome name="map-marker" size={20} color="black" style={{marginRight: 10,}} />
          <Text style={styles.cardText}>{offer.location}</Text>
        </View>
        <TouchableOpacity onPress={() => Linking.openURL(`tel:${offer.phone}`)}>
          <View style={styles.infoRow}>
            <FontAwesome name="phone" size={20} color="black" style={{left:20,marginRight:15}} />
            <Text style={[styles.cardText, styles.phoneLink]}>{offer.phone}</Text>
          </View>
        </TouchableOpacity>
      </View>
    ));
  };
  
  
  const fetchJobOffers = async () => {
    try {
      const hallsData = [];
      const usersQuery = collection(db, 'users');
      const usersSnapshot = await getDocs(usersQuery);
  
      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        const userPosts = userData['posted halls'] || [];
  
        userPosts.forEach(post => {
          if (post.hallName === HallName) {
            hallsData.push({
              jobOffers:post.jobOffers,
              userId: post.userId,       
              hallName: post.hallName,
              location: post.place,
              images: post.images || [],  
            });
          }
        });
      });
  
      if (hallsData.length > 0) {
        const { jobOffers } = hallsData[0];
        setJobOffers(jobOffers); 
      } else {
        console.error('No halls found matching');
      }
    } catch (error) {
      console.error('Error while fetching job offers:', error);
    }
  };
  
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
                location: post.city,
                images: post.images && post.images.length > 0 ? post.images : [], // if there is images push else make it empty 
                type: post.type,
                availableDates: post.selectedDates ,
                Id :userData.userId ,
                cost: post.costPerHour,
                place: post.place
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

// console.log(hallsData[0].Id)
  const ImgContHeight = Height * 0.23;
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {  // Clearing the  shifts  if there is no user authenticated to programm
      setShiftsStatus({}); 
      return;
    }
    const uid = user.uid;
    const q = query(
      collection(db, "reservations"),
      where("hallName", "==", HallName),
    );
    const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
      const newShiftsStatus = {};
      querySnapshot.forEach((doc) => {
        const reservationData = doc.data();
        const shiftKey = `${reservationData.date}-${reservationData.shift}`;
        newShiftsStatus[shiftKey] = reservationData.status;
      });
      setShiftsStatus(newShiftsStatus);
    }, (error) => {
      console.error('Error fetching reservations:', error);
    });
  
    return () => {//cleanup function
      unsubscribeSnapshot(); 
    };
  }, [HallName]);
  

  const DateChange = (date) => { // function for changing the selected  date from the list
    setSelectedDate(date);
    const selectedHall = hallsData.find(hall => hall.name === HallName);
    const shifts = selectedHall.availableDates[date] || [];
  
    // Filter all the accepted shifts from the database collection 
    const filteredShifts = shifts
      .map(shift => {
        const shiftKey = `${date}-${shift.start} - ${shift.end}`;
        const status = shiftsStatus[shiftKey];
        return { ...shift, status, label: `${shift.start} - ${shift.end}` };
      })
      .filter(shift => shift.status !== 'accepted' && shift.status !== 'pending' ); // Remove accepted shifts and pending
    setAvailableShifts(filteredShifts);
  };
  
  
  const Reservation = async (hall) => {
    console.log("Selected Date:", selectedDate);
    console.log("Selected Shift:", selectedShift.start, '-', selectedShift.end);
    
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const uid = user.uid;
      try {
        let firstName = '';
        let lastName = '';
        const q = query(collection(db, "users"), where("userId", "==", uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          firstName = userData.firstName;
          lastName = userData.lastName;
          currentPoints = userData.points
        });


      if (usePoints && currentPoints < 30) {
        Alert.alert("Insufficient Points", "You do not have enough points to use this feature.");
        return;
      }


        const fullName = `${firstName} ${lastName}`;
        setFname(fullName);
        // Check if there is  existing reservation before to use it 
        const reservationQuery = query(
          collection(db, "reservations"),
          where("hallName", "==", HallName),
          where("date", "==", selectedDate),
          where("shift", "==", `${selectedShift.start} - ${selectedShift.end}`),
          where("userId", "==", uid)
        );
        const reservationSnapshot = await getDocs(reservationQuery);
        if (!reservationSnapshot.empty) {
          // If reservation already exists use it to make update to the status 
          reservationSnapshot.forEach(async (doc) => {
            const reservationId = doc.id;
            await updateDoc(doc.ref, { status });
          });
        } else {
          // If the reservation is new and there is no  existing reservation before
          const resData = {
            hallName: HallName,
            shift: `${selectedShift.start} - ${selectedShift.end}`,
            location: hallsData.find((hall) => hall.name === HallName).location,
            date: selectedDate,
            userId: uid,
            images: hall.images,
            Name: fullName,
            status: status,
            OwnerID:hallsData[0].Id,
            Cost:parseInt(hallsData[0].cost,10),
            discount:usePoints
          };

          try{
            await addDoc(collection(db, "reservations"), resData);
            setResReq(true);
            Alert.alert("Success", "Your Reservation request has been sent!");
            // navigation.goBack();
          } 
          catch (error) {
            console.error("Error adding reservation data to Firestore:", error);
          }
          }
          if (usePoints) {
            if (currentPoints >= 30) {
                const newPoints = currentPoints - 20;

                const updatePromises = querySnapshot.docs.map((doc) =>
                    updateDoc(doc.ref, { points: newPoints })
                );
                
                await Promise.all(updatePromises);
                
            } 
        }
        else{
          const newPoints = currentPoints + 10;

          const updatePromises = querySnapshot.docs.map((doc) =>
              updateDoc(doc.ref, { points: newPoints })
          );
          
          await Promise.all(updatePromises);
        }
    
        } catch (error) {
        console.error("Error while fetching user data:", error);
      }
    }
    setSelectedShift('');
  };


const Rating = ({ rating, setRating }) => {
  var n = ''
  return (
    <View >
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
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
    <TextInput
        placeholder="Write Your Comment..."
        textAlignVertical="top"  
        onChangeText={(val)=>n = val}
        onEndEditing={()=>setComment(n)}
        style={styles.commentInput}
        defaultValue={comment}   
      />
      <TouchableOpacity
  style={styles.CommentsButton}
  onPress={() => fetchComments(HallName)}>
  <FontAwesome name="comment" size={21} color="white" />
  <Text style={styles.ButtCommentsText}> Comments</Text>
</TouchableOpacity>

<Modal
  visible={commModVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setCommModVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Comments</Text>
      {comments.length > 0 ? (
        <ScrollView>
          {comments.map((comment, index) => (
            <View key={index} style={styles.commentItem}>
              <Text style={{fontWeight: 'bold'}}>{comment.user}</Text>
              <Text style={{marginTop: 5}}>{comment.text}</Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text>No comments available !</Text>
      )}
      <TouchableOpacity
        style={styles.closeCButton}
        onPress={() => setCommModVisible(false)}
      >
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

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
  const auth = getAuth();
  const user = auth.currentUser;
  const uid = user.uid;
  try {
    // console.log("The rating with parameters:");
    // console.log("Name is", fname);
    // console.log("Rating is", rating);
    const reservationsRef = collection(db, 'reservations');
    const q = query(reservationsRef, where('userId', '==', uid), where('hallName', '==', hallName));
    const querySnapshot = await getDocs(q);
     if (querySnapshot.empty) {
      Alert.alert("Error", "You must reserve the hall before submitting a rating.");
      return;
    }
    const ratingRef = doc(db, 'ratings', hallName);
    const ratingSnap = await getDoc(ratingRef);

    if (ratingSnap.exists()) {
      const ratingData = ratingSnap.data(); // making average of the rate
      const TotalRate = ratingData.totalRate + rating;
      const NumRating = ratingData.rateCount + 1;
      const AvrRating = TotalRate / NumRating;

      await updateDoc(ratingRef, {
        totalRate: TotalRate,
        rateCount: NumRating,
        averageRate: AvrRating,
        comments: [...ratingData.comments, { user: fname, text: comment }],
      });
    } else {
      await setDoc(ratingRef, {//there is no collection its the first time
        hallName: hallName,
        totalRate: rating,
        rateCount: 1,
        averageRate: rating,
        comments: [{ user: fname, text: comment }]
      });
    }
    Alert.alert("Success", "Your rating has been submitted!");
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
            <TouchableOpacity key={index} onPress={() => ImageClick(img)}>
              <Image
                key={index} source={{ uri: img }} style={{ width: Width, height: '100%' }}
              />
            </TouchableOpacity>
            ))
         ))}
        </ScrollView>
      </View>
      
      {renderFullImg()}

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
                  <Text style={[styles.answer ,{top:13}]}>{hall.location} </Text>
                  <TouchableOpacity  
                   onPress={() => setMapVisible(true)}
                  >
               <Icon name="map-pin" size={25} color="red" style={{left:130 ,top:-15}}  />
            </TouchableOpacity>
                </View>
              </View>

              <Modal
              visible={mapVisible}
              animationType="slide"
              transparent={false}
              onRequestClose={() => setMapVisible(false)}
            >
              <MapView
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: coordinates ? coordinates.latitude : 37.78825, // Default location if coordinates are not set
                  longitude: coordinates ? coordinates.longitude : -122.4324,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                {coordinates && (
                  <Marker
                    coordinate={coordinates}
                    title={hallsData.length > 0 ? hallsData[0].name : 'Hall'}
                    description={hallsData.length > 0 ? hallsData[0].location : 'Location'}
                  />
                )}
              </MapView>
              <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setMapVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            </Modal>

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
                enabled={true} // make sure that the list to be abled to open
              >
                <Picker.Item label="Select" value="" />
                {availableShifts.map((shift, i) => {
                  const shiftKey = `${selectedDate}-${shift.start} - ${shift.end}`;
                  const status = shiftsStatus[shiftKey];
                  const isDisabled = status === 'pending' || status === 'accepted';
                  return (
                    <Picker.Item
                      key={i}
                      style={{ color: isDisabled ? 'gray' : 'black' }}
                      value={shift}
                      label={shift.label}
                      enabled={!isDisabled} //for not showing  the  pending and  accepted shifts 
                    />
                  );
                })}
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
                <Text style={styles.lbl}>Cost/Hour:</Text>
                <View style={styles.ansCon}>
                  <Text style={styles.answer}>{hall.cost}</Text>
                </View>
              </View>
              
              <View style={styles.row}>
            <Text style={[styles.lbl, {  marginBottom: 10 , top:-15 }]}>Organize:</Text>
            <View style={[styles.ansCon, { flexDirection: 'column' }]}>
            <RadioButton.Group
                onValueChange={value => {
                  setOrganizingEvent(value);
                  if (value === "I dont know") {
                    setModalVisible(true);
                    fetchJobOffers();
                  }
                }}
                value={organizingEvent}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <RadioButton value="I dont know" />
                  <Text>I don't know</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <RadioButton value="I know already" />
                  <Text>I know already</Text>
                </View>
              </RadioButton.Group>
              
              <View style={{ flexDirection: 'row', marginTop: 10 ,alignItems: 'center', right:105}}>
              <CheckBox
                checked={usePoints}
                onPress={() => setUsePoints(!usePoints)}
                containerStyle={{ padding: 0, margin: 0, marginRight: 10 }}
              />
              <Text>Use 30 points for 10% discount</Text>
            </View>
            </View>
            
          </View>
              <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={styles.modalOverlay}>
                  <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={{ flex: 1 }} />
                  </TouchableWithoutFeedback>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Job Offers</Text>
                    {jobOffers.length > 0 ? (
                      <ScrollView style={{width: '100%',}}>
                        {renderJobOffers()}
                      </ScrollView>
                    ) : (
                      <Text>No job offers available</Text>
                    )}
                  </View>
                </View>
              </Modal>

              <View style={styles.buttCont}>
            <View style={styles.button}>
              <TouchableOpacity  onPress={() => Reservation(hall)} disabled={resReq}>
                <Text style={{ fontWeight: 'bold', color: 'white' ,fontSize: 20}}>
                  {resReq ? 'Request sent' : 'Reserve'}
                </Text>
              </TouchableOpacity>
            </View>


    </View>  
    </View>
            
          )}
          {activeTab === 'Rating' && ( //if the rating button clicked
            <View>
              <Text style={{ fontSize: 20, textAlign: 'center', marginVertical: 35 ,top:10}}>
                Rate Us
              </Text>
              <Rating rating={rating} setRating={setRating} comment={comment} setComment={setComment} />
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
    left: 30,
    marginLeft: 10,
    top:-35
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
    color: 'black',
    fontWeight:"300"
  },

  Applybutt: {
    alignItems: 'center',
    backgroundColor: '#00e4d0',
    marginLeft: 100,
    width:150,
    height:50,
    top:50,
    borderRadius: 50,
    justifyContent: 'center',

  },
  Applytxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },

  commentInput: {
    borderRadius: 6,
    marginHorizontal: 20,
    padding:10,
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 10,
    top:25,
    backgroundColor: 'white',
    height: 122,
   
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

  },

  modalContent: {
    flex: 1,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 40,
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  card: {
    marginVertical: 11,
    width: '100%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 11,
    
  },
  
  phoneLink: {
    color: '#007aff', 
    textDecorationLine: 'underline',
  },

  cardTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  cardText: {
    fontSize: 17,
    marginLeft: 11,
  },

  CommentsButton: {
    flexDirection: 'row',
    borderRadius: 51,
    justifyContent: 'center',
    top:41,
    alignItems: 'center',
    backgroundColor: '#007aff',
    padding: 11,
  },

  ButtCommentsText: {
    fontSize: 17,
    color: 'white',
    marginLeft: 5,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  closeText: {
    color: 'white',
    fontSize: 17,
  },

  fullScrMod: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%', 
    minHeight: '50%', 
  },
  
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  commentItem: {
    backgroundColor: '#f9f9f9',
    marginBottom: 11,
    padding: 15,
    borderRadius: 11,
  },

  closeCButton: {
    position: 'absolute',
    bottom: 20,
    left: '60%',
    transform: [{ translateX: -50 }],
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,

  },


  fullScrImg: {
    width: '100%',
    resizeMode: 'contain',
    height: '100%',
   
  },

  map: {
    flex: 1,
  },

  closeButton: {
    position: 'absolute',
    bottom: 20,
    left: '56%',
    transform: [{ translateX: -50 }],
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  
 
});

export default SelectedHall;
