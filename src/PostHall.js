import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView ,Button ,Modal} from 'react-native';
import { Calendar } from 'react-native-calendars'; 
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import * as ImagePicker from 'expo-image-picker';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const PostHall = () => {
  const [hallName, setHallName] = useState('');
  const [place, setPlace] = useState('');
  const [time, setTime] = useState('');
  const [image, setImage] = useState([]);
  const [emptyDays, setEmptyDays] = useState('');
  const [costPerHour, setCostPerHour] = useState('');
  const [capacity, setCapacity] = useState('');
  const [selectedDay, setSelectedDay] = useState([]); // to store the availbale dates
  const [showCalendar, setShowCalendar] = useState(false); // State to control calendar modal visibility

  const  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      multiple: true, 
      quality: 1,
    });

    if (!result.canceled) {
      setImage(prevImages => [...prevImages, ...result.assets.map(asset => asset.uri)]);
    }
  }


  const DeleteImage = (i) => {
    setImage(prevImages => prevImages.filter((_, index) => index !== i));
  };
  


  const handlePostHallDetails = () => {
  };

  const select_date = (date) => {
    const Date = date.dateString;
    if (selectedDay.includes(Date)) { // check if is the date already picked and was  clicked on it  then remove it 
      setSelectedDay(selectedDay.filter(date => date !== Date));
    } else { // if not then insert it to the array of the dates
      setSelectedDay([...selectedDay, Date]);
    }

  };

  return (
    <View style={styles.container}>
    <View Style={styles.boxcontainer}>
    <Text style = {{fontWeight:'bold',fontSize :35 ,  textAlign: 'center'}}>Post Hall</Text>
    <View style={{marginTop:40}}></View>

      <TextInput                                            // the feilds of the post hall  
        style={styles.TextInput}
        placeholder="Hall Name"
        value={hallName}
        onChangeText={text => setHallName(text)}
      />


      <TextInput
        style={styles.TextInput}
        placeholder="Place"
        value={place}
        onChangeText={text => setPlace(text)}
      />



        <TextInput
        style={styles.TextInput}
        placeholder="Time"
        value={time}
        onChangeText={text => setTime(text)}
        keyboardType='numeric'

      />



      <View style={{ flexDirection: 'row', alignItems: 'center' }}> 
          <TextInput
            style={[styles.TextInput]}
            placeholder="Available Days"
            value={selectedDay.join(', ')} 
            editable={false}
          />
          <TouchableOpacity onPress={() => setShowCalendar(true)}>
            <FontAwesomeIcon icon={faCalendar} size={20} color="#000" style={{top:-10 ,right:25 }} />
          </TouchableOpacity>
        </View>



   <TextInput
        style={styles.TextInput}
        placeholder="Capacity People"
        value={capacity}
        keyboardType='numeric'
        onChangeText={text => setCapacity(text)}
      />



      <TextInput
        style={styles.TextInput}
        placeholder="Cost per Hour"
        keyboardType='numeric'
        value={costPerHour}
        onChangeText={text => setCostPerHour(text)}
      />
   

      <TouchableOpacity onPress={pickImage} style={styles.pictureButton}>
        <Text style={styles.buttonText}>selecte Pictures</Text>
      </TouchableOpacity>
      
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {image.map((uri, index) => (
       <View key={index} style={{ position: 'relative', margin: 5 }}>
        <Image source={{ uri }} style={{ width: 60, height: 60, borderRadius: 5 }} />
        <TouchableOpacity

        style={{ position: 'absolute', top: -4, right: -4 }}
        onPress={() => DeleteImage(index)}
      >
        <FontAwesomeIcon icon={faTimesCircle} size={20} color="red" />
      </TouchableOpacity>
    </View>
  ))}
      </View>

      <View style={{ alignItems: 'center' }}> 
      <TouchableOpacity onPress={handlePostHallDetails} style={styles.buttons}>
        <Text style={styles.buttonText}>Post Hall</Text>
      </TouchableOpacity>
      </View>


      <Modal visible={showCalendar} animationType="fade">   
      <Calendar onDayPress={select_date} 
       markedDates={selectedDay.reduce((object, date) => {
        object[date] = { selectedColor: 'skyblue' , selected: true};
        return object;
      }, {})} 
      />

      <Button title="Close" onPress={() => setShowCalendar(false)} />
    </Modal>
</View>
</View>
  
  );
};

const styles = {
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  TextInput:{
    width: 300,
    height: 50,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#c0c0c0',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    },

    boxcontainer:{
        width: 350,
        height: 450,
        justifyContent: 'center',
        paddingTop:20,
        paddingBottom:20,
        bottom:40,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.35,
        shadowRadius: 15,
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 30,
  } ,
  
  pictureButton: {
    alignItems: 'center',
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttons: {
    height: 50,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: '#00e4d0',
    marginTop:25,
    top:-24
  },
 
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
};

export default PostHall;
