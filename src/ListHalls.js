import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList,ScrollView ,StyleSheet, TouchableOpacity } from 'react-native';
import { collection, getDocs, query, where } from "firebase/firestore";
import StarRating from 'react-native-star-rating'; // Import the star rating component
import { useNavigation } from '@react-navigation/native'
import {db} from "../config"; // Import Firestore instance
import LoadingPage from '../component/LoadingPage';

const ListItem = ({ item }) => {

  const navigation=useNavigation()
  const pressbutt = ( ) => {
    navigation.navigate("SelectedHall" , item.name);
  }

  return (   // creating container 
    <View style={styles.Container}>   
    <TouchableOpacity onPress={pressbutt}>
      <View style={styles.Post}> 
       <Image source={{ uri: item.image }} style={styles.img} />
        <View style={styles.text}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.loc}>{item.location}</Text>
        </View>
        <View style={styles.stars}>
          <StarRating
            starSize={20}
            maxStars={5}
            emptyStarColor="gold"
          />
          </View>
      </View>
    </TouchableOpacity>
    </View>
  );
};


const ListHalls = ({ route }) => {
  const [hallsData, setHallsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchValue = route.params.searchValue;

  const SelectCountry = (place ) => {
    console.log("Selected ", place );
  };

  const countries = ["Jerusalem", "Tel Aviv", "Haifa" , "Bet hanina" , "kufar akkab"]; 

  useEffect(() => {

    const fetchData = async () => { //function that fetch the data from the firebase 
      try {
        const hallsData = [];
        const q = collection(db, 'users'); 
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc => {
      const userData = doc.data(); 
    const userPosts = userData['posted halls'] || []; //get all the posted halls data

     userPosts.forEach((post, index) => {      
      if(post.place===searchValue){
      hallsData.push({  //push all the posts data that fulfill the if statment
        id: index.toString(),
        name: post.hallName,
        location: post.place,
        image: post.images && post.images.length > 0 ? post.images[0] : null
      
      });
    }
    });
});

        setHallsData(hallsData);
        setLoading(false); 

      } catch (err) {
        console.error('Error while fetching data:', err);
      }
    };

    fetchData(); 
  }, [searchValue]); 


  if (loading) { // checking if the state loading true to present the loading screen
    return(<LoadingPage/>)
  }


  return (

   
     <View style={{ flex: 1 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.countryRow}>
          {countries.map((place, index) => (
            <TouchableOpacity key={index} onPress={() => SelectCountry(place)}>
              <View style={styles.countryButton}>
                <Text style={styles.palce}>{place}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {hallsData.length === 0 ? (
      <Text style={styles.Empty_HallsText}>There are no halls in this area !</Text>
       ) : (
      <FlatList 
        data={hallsData}
        renderItem={({ item }) => <ListItem item={item} />}
        keyExtractor={item => item.id}
      />
    )}
    </View>

  );
};

const styles = StyleSheet.create({
  Container: {
    
  },
  Empty_HallsText: {
    justifyContent: 'center',
    flex: 1,
    textAlign: 'center',
    marginBottom:50,
    alignItems: 'center',
    fontSize: 18,

  },
  Post: {
    paddingHorizontal: 10,
    flex:1,
    alignItems: 'center',
    paddingVertical: 25,
    borderColor: 'white',
    borderWidth: 1,
    flexDirection: 'row',
    margin: 4,
    top:3,
    backgroundColor:"white"
  },

  stars: {
    top:30,
    right:152,

  },

  countryRow: {
    flexDirection: 'row',
   justifyContent: 'space-around',
   backgroundColor: 'white',
   height:55,
   paddingTop:8
 },

 countryButton: {
   borderRadius: 100,
   borderWidth: 2,
   borderColor: 'white',
   paddingHorizontal: 10,
   paddingVertical: 6,
   paddingRight:7,
   backgroundColor: '#f5f5f5', 
   marginRight: 4, 
 },

 
text:{
  fontSize: 13,
},
  
  loc: {
    color: 'gray',
    fontSize: 16,
  },

  img: {
    height: 95,
    marginRight: 10,
    width: 100,
    position:"absolute"
  },

  text: {
    flex: 1,
    left:120,
    top: -10,
  },

  name: {
    fontWeight: 'bold',
    fontSize: 17,
  },
});

export default ListHalls;
