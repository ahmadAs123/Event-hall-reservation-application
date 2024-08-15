import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Button, Modal, StyleSheet,PermissionsAndroid, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Feather from 'react-native-vector-icons/Feather';
import { faCalendar, faTimesCircle , faMapMarkerAlt, faMapPin} from '@fortawesome/free-solid-svg-icons';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../config';
import { collection, updateDoc, doc, getDoc, query, where, arrayUnion, getDocs } from "firebase/firestore";
import { db } from "../config";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const storage = getStorage();

const PostHall = ({ navigation }) => {
  const [hallName, setHallName] = useState('');
  const [type, setType] = useState('');
  const [city, setCity] = useState('');
  const [points, setPoints] = useState(1000);
  const [place, setPlace] = useState('');
  const [image, setImage] = useState([]);
  const [costPerHour, setCostPerHour] = useState('');
  const [capacity, setCapacity] = useState('');
  const [selectedDates, setSelectedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showShifts, setShowShifts] = useState(false);
  const [shiftStart, setShiftStart] = useState('');
  const [shiftEnd, setShiftEnd] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showShiftsModal, setShowShiftsModal] = useState(false); 
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobOffers, setJobOffers] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [mapRegion, setMapRegion] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [filteredTypes, setFilteredTypes] = useState([]);
  const [showTypesDropdown, setShowTypesDropdown] = useState(false);
  const [showCitiesDropdown, setShowCitiesDropdown] = useState(false);

  const [cities] = useState([
    'Jerusalem', 'Tel Aviv', 'Haifa', 'Beersheba', 'Netanya',
    'Rishon LeZion', 'Petah Tikva', 'Ashdod', 'Holon', 'Bnei Brak',
    'Bat Yam', 'Kfar Saba', 'Ra\'anana', 'Herzliya', 'Nahariya',
    'Safed', 'Tiberias', 'Eilat', 'Akko (Acre)', 'Kiryat Shmona',
    'Jaffa', 'Modi\'in-Maccabim-Re\'ut', 'Hadera', 'Or Akiva',
    'Arad', 'Be\'er Sheva', 'Ramat Gan', 'Ramat Hasharon', 'Zichron Yaakov',
    'Kiryat Yam', 'Kiryat Motzkin', 'Kiryat Ata', 'Yavne', 'Lod',
    'Ramla', 'Elad', 'Givatayim', 'Giv\'at Shmuel', 'Baqa al-Gharbiyye',
    'Tira'
  ]);
  
  const [types] = useState([
   'Weddings','Educational','Food Hall','Condolence Tents'
  ]);


  const handleTextChange = (text) => {
    setCity(text);
    if (text) {
      const filtered = cities.filter(city => 
        city.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(cities);
    }
  };

  const handleTypeChange = (text) => {
    setType(text);
    if (text) {
      const filtered = types.filter(type => 
        type.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredTypes(filtered);
    } else {
      setFilteredTypes(types);
    }
  };


  const handleSelectType = (selectedType) => {
    setType(selectedType);
    setFilteredTypes([]);
    setShowTypesDropdown(false);

  };

  const handleSelectCity = (selectedCity) => {
    setCity(selectedCity);
    setFilteredCities([]);
    setShowCitiesDropdown(false);

  };


  const fetchSuggestions = async (text) => { //for fetching the suggestion from opeen street api 
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${text}`);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  useEffect(() => { // make sure that place isnt null then to fetch
    let timeoutId;
    if (place.trim() !== '') {
      timeoutId = setTimeout(() => {
        fetchSuggestions(place);
      }, 1000); 
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [place]);
  

  useEffect(() => { //requesting to access to location 
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }
      
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setMapRegion({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);
  

  const handleCurrentLocationPress = async () => { //save the location then get the suggestions 
    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    setPlace(`${latitude},${longitude}`);
    setSuggestions([]); 
    setMapRegion({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };
  


  const handleMapPress = (event) => { //getting location by map picker
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setPlace(`${latitude},${longitude}`);
    setSuggestions([]); 
    setShowMap(false);
  };

  const addJobOfferRow = () => { //adding new job offer
    setJobOffers([...jobOffers, { title: '', name: '', location: '', cost: '', phone: '' }]);
  };
  
  const updateJobOffer = (index, field, value) => {  //update the job offers 
    const newJobOffers = [...jobOffers];
    newJobOffers[index][field] = value;
    setJobOffers(newJobOffers);
  };
  
  const deleteJobOffer = (index) => {  //delete ofer 
    const newJobOffers = jobOffers.filter((_, i) => i !== index);
    setJobOffers(newJobOffers);
  };

  
  const pickImg = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }
  
      if (image.length >= 4) {
        alert('You can only select up to 4 images.');
        return;
      }
  
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        multiple: true,
        quality: 1,
      });
  
      if (!result.canceled) {
        const ImageURLs = [];
        for (const asset of result.assets) {
          if (image.length + ImageURLs.length >= 4) {
            alert('You can only select up to 4 images.');
            break;
          }
  
          console.log('Asset URI:', asset.uri); // Debug logging
          const response = await fetch(asset.uri);
          const blob = await response.blob();
          const filename = asset.uri.substring(asset.uri.lastIndexOf('/') + 1);
          console.log('Filename:', filename); // Debug logging
          const storageRef = ref(storage, `images/${filename}`);
          console.log(storageRef)
          await uploadBytes(storageRef, blob);
          const URL = await getDownloadURL(storageRef);
          ImageURLs.push(URL);
        }
  
        setImage(prevImages => [...prevImages, ...ImageURLs]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };
  

  const deleteImg = (i) => { // deleting img from the stack 
    setImage(prevImages => prevImages.filter((_, index) => index !== i));
  };

  const postHall = async () => {
    try {
      // THE DATA OF THE POST THAT WILL PuBLISH
      const P_Data = {
        hallName,
        place,
        capacity,
        costPerHour,
        selectedDates,
        images: image,
        type,
        jobOffers,
        city,
        points
      };
  // getting the uid of the user that logged in 
      const currentUser = auth.currentUser;

      if (currentUser) {
        const q = query(collection(db, 'users'), where('userId', '==', currentUser.uid));
        const docSnapS = await getDocs(q);

        const docRef = doc(db, 'users', docSnapS.docs[0].id); // find the user doc  that have the uid that logged in right now 
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {  // check if the doc existed 
          await updateDoc(docRef, { ['posted halls']: arrayUnion(P_Data) });
          setShowSuccessModal(true); 
        } 
        else {
          console.log('Document was not found');
        }
      } 

    } catch (error) {
      console.error('Error posting hall details: ', error);
    }
  };

  const selectDate = (date) => {  //slecting the dates from the calender 
    const newSelectedDate = date.dateString;
    setShowShifts(true);
    setSelectedDate(newSelectedDate); 
    setSelectedDates(prevSelectedDates => ({
      ...prevSelectedDates,
      [newSelectedDate]: [],
    }));
  };
  
  const addShift = (selectedDate) => { //adding the shifts to array and make sure thatthey are nut Null
    // console.log(shiftStart)
    // console.log(shiftEnd)
    if (shiftStart.trim() != '' && shiftEnd.trim() != '') {
      const newShift = { start: shiftStart, end: shiftEnd };
      setSelectedDates(prevSelectedDates => ({
        ...prevSelectedDates,
        [selectedDate]: [...(prevSelectedDates[selectedDate] || []), newShift],
      }));
      setShiftStart('');
      setShiftEnd('');
    }
    else{
      alert("Please fill all the feilds!")
      setShiftStart('');
      setShiftEnd('');
    }
  };


  const rmvDates_Shifts = (date) => { //function to delete the shifts and dates that already selected 
    setSelectedDates(prevSelectedDates => {
      const temp = { ...prevSelectedDates };
      delete temp[date];
      return temp;
    });
  };

  return (
    
    <View style={styles.container}>
      <View style={styles.boxcontainer}>
        <View style={{ marginTop: 18 }}></View>

        <TextInput       // the feilds of the post hall 
          style={styles.TextInput}
          placeholder="Hall Name"
          value={hallName}
          onChangeText={text => setHallName(text)}
        />

              <TextInput
                style={styles.TextInput}
                placeholder="City"
                value={city}
                onChangeText={handleTextChange}
                onFocus={() => {
                  setShowCitiesDropdown(true);
                  setFilteredCities(cities); // Show all cities on focus
                }}

              />

              {filteredCities.length > 0 && (
                <FlatList
                data={filteredCities}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.item}
                    onPress={() => handleSelectCity(item)}
                  >
                    <Text style={{fontSize: 16}}>{item}</Text>
                  </TouchableOpacity>
                )}
                style={styles.cityList}
              />
              )}
     


      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
        style={[styles.TextInput]}
          placeholder="Place"
          value={place}
          onChangeText={text => {
            setPlace(text);
            fetchSuggestions(text);
          }}
        />
  <ScrollView style={styles.suggestionsCon}>
  {suggestions.map((suggestion, index) => (
    <TouchableOpacity 
      key={index} 
      onPress={() => {
        setPlace(suggestion.display_name);
        setSuggestions([]);
      }}
    >
      <Text style={styles.suggestionText}>{suggestion.display_name}</Text>
    </TouchableOpacity>
  ))}
</ScrollView>
        
         <TouchableOpacity onPress={() => setShowMap(true)}>
        <Feather name= "map"  size={22} color="#000" style={{  right:60 , top:-8}} />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleCurrentLocationPress}>
        <Feather name ='map-pin' size={22} color="#000" style={{ right: 48 ,top:-8}} />
      </TouchableOpacity>
      </View>




      <Modal visible={showMap} animationType="slide">
      {mapRegion && (
    <MapView
      style={{ flex: 1 }}
      region={mapRegion}
      showsMyLocationButton={true}
      showsUserLocation={true} 
      onPress={handleMapPress}
    >
      {place && !isNaN(parseFloat(place.split(',')[0])) && !isNaN(parseFloat(place.split(',')[1])) && (
        <Marker 
          coordinate={{
            latitude: parseFloat(place.split(',')[0]),
            longitude: parseFloat(place.split(',')[1])
          }} 
        />
      )}
    </MapView>
  )}

      <Button title="Close" onPress={() => setShowMap(false)} />
    </Modal>


        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            style={[styles.TextInput]}
            placeholder="Available Days"
            editable={false}
          />
          <TouchableOpacity onPress={() => setShowCalendar(true)}>
            <FontAwesomeIcon icon={faCalendar} size={20} color="#000" style={{ top: -10, right: 25 }} />
          </TouchableOpacity>
          
        </View>
        <TouchableOpacity onPress={() => setShowShiftsModal(true)}>
          <Text style={ { color: 'blue' ,  left:230 ,top:-15 , textDecorationLine: 'underline' }}>Show Shifts</Text>
        </TouchableOpacity>


        <TextInput
                style={styles.TextInput}
                placeholder="Type"
                value={type}
                onChangeText={handleTypeChange}
                onFocus={() => {
                  setShowTypesDropdown(true);
                  setFilteredTypes(types); // Show all types on focus
                }}
              />
              {filteredTypes.length > 0 && (
                <FlatList
                data={filteredTypes}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.item}
                    onPress={() => handleSelectType(item)}
                  >
                    <Text style={{fontSize: 16}}>{item}</Text>
                  </TouchableOpacity>
                )}
                style={styles.TypeList}
              />
              )}


        <TextInput
          style={styles.TextInput}
          placeholder="Capacity People"
          keyboardType='numeric'
          value={capacity}
          onChangeText={text => setCapacity(text)}
        />

        <TextInput
          style={styles.TextInput}
          placeholder="Cost per Hour"
          keyboardType='numeric'
          value={costPerHour}
          onChangeText={text => setCostPerHour(text)}
        />

        <TouchableOpacity onPress={pickImg} style={styles.picButt}  >  
          <Text style={styles.buttonText}>Select Pictures</Text>
        </TouchableOpacity>

      <TouchableOpacity onPress={() => setShowJobModal(true)} style={styles.addButton}>
      <Text style={styles.buttonText}>Add Job Offers</Text>
      </TouchableOpacity>

      <Modal visible={showJobModal} animationType="slide" transparent={true}>
  <View style={styles.modalBackground}>
    <View style={styles.modalCon}>
      <Text style={styles.modalTitle}>Add Job Offer</Text>
      <ScrollView>
        {jobOffers.map((offer, index) => (
          <View key={index} style={{marginBottom: 15}}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style={[styles.TextInput, {marginBottom: 5}]}
          placeholder="Title"
          value={offer.title}
          onChangeText={text => updateJobOffer(index, 'title', text)}
        />

   
          </View>

            <View style={{alignItems: 'center' ,flexDirection: 'row'}}>
              <TextInput
                style={styles.row}
                placeholder="Name"
                value={offer.name}
                onChangeText={text => updateJobOffer(index, 'name', text)}
              />
              <TextInput
                style={styles.row}
                placeholder="Location"
                value={offer.location}
                onChangeText={text => updateJobOffer(index, 'location', text)}
              />
            
              <TextInput
                style={styles.row}
                placeholder="Phone"
                value={offer.phone}
                onChangeText={text => updateJobOffer(index, 'phone', text)}
              />
              <TouchableOpacity onPress={() => deleteJobOffer(index)} style={styles.dltButt}>
                <Text style={styles.deleteText}>X</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={addJobOfferRow}
        style={[styles.buttons, { left: 100 }]}
        >
        <Text style={styles.buttonText}>Add Job</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setShowJobModal(false)}
        style={[styles.buttons, { left: 100 ,backgroundColor:'red' }]}
        >
        <Text style={styles.buttonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>


      
{/* ability to delete images from the stack  */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {image.map((uri, i) => (
            <View key={i} style={{ position: 'relative', margin: 4 }}>
              <Image source={{ uri }} style={{ width: 60, height: 60 }} />
              <TouchableOpacity
                style={{ position: 'absolute', top: -4, right: -4 }}
                onPress={() => deleteImg(i)}
              >
                <FontAwesomeIcon icon={faTimesCircle} size={21} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity onPress={postHall} style={styles.buttons}>
            <Text style={styles.buttonText}>Post Hall</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={showCalendar} animationType="fade">
          <Calendar onDayPress={selectDate} markedDates={selectedDates} />
          <Button title="Close" onPress={() => {setShowCalendar(false); }} />
        </Modal>
{/* modal for choosing the shifts */}
        <Modal visible={showShifts} animationType="fade">
          <View style={styles.container}>
            <TextInput
              style={styles.TextInput}
              placeholder="Shift Start"
              value={shiftStart}
              onChangeText={(text) => setShiftStart(text)}
            />
            <TextInput
              style={styles.TextInput}
              placeholder="Shift End"
              value={shiftEnd}
              onChangeText={(text) => setShiftEnd(text)}
            />
            <TouchableOpacity onPress={() => addShift(selectedDate)} style={styles.buttons}>
              <Text style={styles.buttonText}>Add Shift</Text>
            </TouchableOpacity>
            <Button title="Close" onPress={() => setShowShifts(false)} />
          </View>
        </Modal>

        <Modal visible={showSuccessModal} transparent={true} animationType="fade">
          <View style={styles.Mod_BGround}>
            <View style={styles.scssMod}>
              <Text style={{marginBottom: 22,fontSize: 20,}}>Post succeeded </Text>
              <TouchableOpacity
                onPress={() => { setShowSuccessModal(false); navigation.navigate('AdminPage');}} style={styles.sucssButt}
                >
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>


{/* modal that show the dates and theshifts that are selected and ability to delete them */}
  <Modal visible={showShiftsModal} transparent={true} animationType="fade">
  <View style={styles.Mod_BGround}>
    <View style={styles.shftMod}>
      <Text style={{fontSize: 22,marginBottom:30}}>Selected Dates</Text>
      <ScrollView>
        {Object.entries(selectedDates).filter(([date, shifts]) => shifts.some(shift => shift.start.trim() !== '' && shift.end.trim() !== '')) .map(([date, shifts]) => (
            <View key={date} style={{ marginBottom: 17 }}>
              <Text style={{fontWeight:'bold',fontSize: 16}}>{date}</Text>
              {shifts.filter(shift => shift.start.trim() !== '' && shift.end.trim() !== '').map((shift, i) => (   //check if the shifts are empty to show error message 
                  <Text key={i} style={{marginLeft:8}}>{` ${shift.start} - ${shift.end}`}</Text>
                ))}
              <TouchableOpacity onPress={() => rmvDates_Shifts(date)} style={styles.rmvButt}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
      </ScrollView>
      <TouchableOpacity onPress={() => setShowShiftsModal(false)} style={styles.buttons}>
        <Text style={styles.buttonText}>Close</Text>
      </TouchableOpacity>
     
    </View>
  </View>
</Modal>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  suggestionText: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },

  TextInput: {
    width: 300,
    height: 50,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#c0c0c0',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
  },

  boxcontainer: {
    width: 359,
    height: 900,
    justifyContent: 'center',
    paddingBottom: 10,
    bottom: 40,
    backgroundColor: 'white',
    paddingHorizontal: 30,
  },

  picButt: {
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 10,
    width:170,
    borderRadius: 5,
    marginBottom: 10,
    left:65
  },

  buttons: {
    height: 50,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: '#00e4d0',
    marginTop: 29,
    top: -22,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },

  Mod_BGround: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',

  },
  scssMod: {
    width: 310,
    padding: 80,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
  },

  sucssButt: {
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00e4d0',
    borderRadius: 5,
    top:40
  },

  shftMod: {
    width: 320,
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 13,
    alignItems:'center',
    padding: 23,
    },


  rmvButt: {
    backgroundColor: 'red',
    width:80,
    height:30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
    marginTop: 9,
    marginLeft:180,
    top:-45
  },

  addButton: {
    alignItems: 'center',
    backgroundColor: 'green',
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    width: 170,
    left: 65,
  },

  modalBackground: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',

  },

  modalCon: {
    width: '99%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    maxHeight: '90%',
  },

  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 15,
  },

  row: {
    padding: 8,
    margin: 5,
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
   
  },
  
  
  dltButt: {
    backgroundColor: 'red',
    borderRadius: 3,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },

 
  suggestionsCon: {
    position: 'absolute',
    maxHeight: 160,
    width:'100%',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    zIndex: 2,
    top:55    
  },

  
  item: {
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    backgroundColor: '#f9f9f9',

  },

  

  suggestionList: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 6,
    borderColor: '#ddd',
    left: 30,
    right: 30,
    top:305,
    maxHeight:255,
    borderWidth: 2,
    zIndex: 1000, 

  },

  TypeList:{
    position: 'absolute',
    left: 30,
    borderRadius: 6,
    borderColor: '#ddd',
    borderWidth: 2,
    zIndex: 1000, 
    right: 30,
    top:460,
    maxHeight:255,
    backgroundColor: '#fff',
  
  },
  cityList: {
    borderRadius: 5,
    borderColor: '#ddd',
    position: 'absolute',
    maxHeight:256,
    backgroundColor: '#fff',
    borderWidth: 2,
    left: 30,
    right: 30,
    top:230,
    zIndex: 1000, 
  },


});

export default PostHall;
