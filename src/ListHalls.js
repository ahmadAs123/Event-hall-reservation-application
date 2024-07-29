import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList,ScrollView ,StyleSheet, TouchableOpacity } from 'react-native';
import { collection, getDocs, query, where } from "firebase/firestore";
import { FontAwesome } from '@expo/vector-icons';
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
          <View style={styles.ratingContainer}>
          <FontAwesome name="star" size={20} color="gold" />
          <Text style={styles.ratingText}>4.5</Text>
        </View>
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
  const filter = route.params.filter;
  const sortOrder =route.params.sortOrder 
  console.log(route.params)
  console.log(searchValue)


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
      if(post.city===searchValue){
      hallsData.push({  //push all the posts data that fulfill the if statment
        id: index.toString(),
        name: post.hallName,
        location: post.place,
        image: post.images && post.images.length > 0 ? post.images[0] : null,
        cost: post.costPerHour, 
        capacity: post.capacity,
        // rating: post.rating
      });
    }
    });
});
        const sortedHallsData = applySorting(hallsData, filter ,sortOrder);

        setHallsData(sortedHallsData);
        setLoading(false); 

      } catch (err) {
        console.error('Error while fetching data:', err);
      }
    };

    fetchData(); 
  }, [searchValue,filter ,sortOrder]); 

  const applySorting = (data, filter, sortOrder) => {
    const keys = Object.keys(filter).filter(key => filter[key]);
    if (keys.length === 0) return data;
  
    return data.sort((a, b) => {
      for (let key of keys) {
        const order = sortOrder[key];
        const factor = order === 'asc' ? 1 : -1;
  
        if (a[key] < b[key]) return -1 * factor;
        if (a[key] > b[key]) return 1 * factor;
      }
      return 0;
    });
  };

  
  if (loading) { // checking if the state loading true to present the loading screen
    return(<LoadingPage/>)
  }


  return (

   
     <View style={{ flex: 0 }}>
      {hallsData.length === 0 ? (
      <Text style={styles.Empty_HallsText}>There are no halls in this area !</Text>
       ) : (
      
      <FlatList 
        data={hallsData}
        renderItem={({ item }) => <ListItem item={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.flatListContent}

      />
    )}
    </View>

  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,

  },
  flatListContent: {
    flexGrow :1,
    paddingBottom: 50
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
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 5,
    alignItems: 'center',
  },
  
  ratingText: {
    marginLeft: 5,
    color: 'gray',
    fontSize: 16,
  },
  
});

export default ListHalls;
