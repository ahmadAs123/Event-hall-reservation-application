import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList,ScrollView ,StyleSheet, TouchableOpacity,StatusBar } from 'react-native';
import { collection, getDocs, query, where ,doc ,getDoc } from "firebase/firestore";
import { FontAwesome ,Foundation } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'
import {db} from "../config"; // Import Firestore instance
import LoadingPage from '../component/LoadingPage';

const fetchAverageRating = async (hallName) => {
  try {
    const ratingRef = doc(db, 'ratings', hallName);
    const docSnapshot = await getDoc(ratingRef);

    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      return data.averageRate ? parseFloat(data.averageRate.toFixed(1)) : 0;
    } else {
      return 0;
    }
  } catch (error) {
    console.error("Error while fetching rating:", error);
    return 0;
  }
};


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
          <Text style={styles.loc}>{item.city}</Text>
          <View style={styles.ratingContainer}>
          <FontAwesome name="star" size={20} color="gold" />
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
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
    const fetchData = async () => {
      try {
        const hallsData = [];
        const q = collection(db, 'users');
        const querySnapshot = await getDocs(q);
        
        for (const doc of querySnapshot.docs) {
          const userData = doc.data();
          const userPosts = userData['posted halls'] || [];

          for (const post of userPosts) {
            if (post.city === searchValue) {
              const rating = await fetchAverageRating(post.hallName);  // Fetch the rating for each hall
              
              hallsData.push({
                id: post.hallName,  // Use hallName as id
                name: post.hallName,
                location: post.place,
                image: post.images && post.images.length > 0 ? post.images[0] : null,
                cost: post.costPerHour,
                capacity: post.capacity,
                city: post.city,
                rating: rating || 0 // Use the fetched rating or 0 if not found
              });
            }
          }
        }

        const sortedHallsData = applySorting(hallsData, filter, sortOrder);
        setHallsData(sortedHallsData);
        setLoading(false);
      } catch (err) {
        console.error('Error while fetching data:', err);
      }
    };

    fetchData();
  }, [searchValue, filter, sortOrder]);

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
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#00e4d0" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Search Results</Text>
        <Foundation name="results" size={24} color="black" style={styles.resultIcon} />

      </View>

      {/* Content */}
      {hallsData.length === 0 ? (
        <Text style={styles.Empty_HallsText}>There are no halls in this area!</Text>
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

 

  header: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row', // Use this if you want horizontal layout

  },
  headerText: {
    fontSize: 25,
    fontWeight: 'bold',
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
    marginTop: 10,
    alignItems: 'center',
  },
  
  ratingText: {
    marginLeft: 5,
    color: 'gray',
    fontSize: 16,
  },
  resultIcon: {
    left:8,
    top:6
  },
  
});

export default ListHalls;
