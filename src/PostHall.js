import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Button, Modal, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../config';
import { collection, updateDoc, doc, getDoc, query, where, arrayUnion, getDocs } from "firebase/firestore";
import { db } from "../config";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const storage = getStorage();

const PostHall = ({ navigation }) => {
  const [hallName, setHallName] = useState('');
  const [type, setType] = useState('');
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


  
  const pickImg = async () => { // pick image from the gallary phone
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        multiple: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const ImageURLs = [];
        for (const asset of result.assets) {
          const response = await fetch(asset.uri);
          const blob = await response.blob();
          const filename = asset.uri.substring(asset.uri.lastIndexOf('/') + 1);
          const storageRef = ref(storage, filename);
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
        <Text style={{ fontWeight: 'bold', fontSize: 35, textAlign: 'center' }}>Post Hall</Text>
        <View style={{ marginTop: 18 }}></View>

        <TextInput       // the feilds of the post hall 
          style={styles.TextInput}
          placeholder="Hall Name"
          value={hallName}
          onChangeText={text => setHallName(text)}
        />

        <TextInput
          style={styles.TextInput}
          placeholder="Type"
          value={type}
          onChangeText={text => setType(text)}
        />

        <TextInput
          style={styles.TextInput}
          placeholder="Place"
          value={place}
          onChangeText={text => setPlace(text)}
        />

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

      {/* choosing pictures from galary */}
        <TouchableOpacity onPress={pickImg} style={styles.picButt}>  
          <Text style={styles.buttonText}>Select Pictures</Text>
        </TouchableOpacity>

      
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
});

export default PostHall;
