import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView, FlatList,StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, query,getDoc,doc } from 'firebase/firestore'; 
import { db } from '../config';
import SearchFeild from '../component/SearchFeild';
import { Icon } from 'react-native-elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ClientProfile from './ClientPages/ClientProfile';
import ClientReservations from './ClientPages/ClientReservations';
import ClientChat from './ClientPages/ClientChat';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';


const types = ["All Categories", "Weddings", "Educational", "Food Hall", "Condolence Tents"];

const HomePageComponent = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [choosenType, setChoosenType] = useState("All Categories");
  const [fetchedhalls, setFetchedHalls] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHalls(choosenType); 
    setRefreshing(false);
  };
  
  const pressbutt = (item) => {
    navigation.navigate("SelectedHall",  item.name );

  };

  useEffect(() => {
    fetchHalls("All Categories");
  }, []);

  const fetchAverageRating = async (hallName) => {
    try {
      const ratingRef = doc(db, 'ratings', hallName); 
      const docSnapshot = await getDoc(ratingRef);
  
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        return data.averageRate ? parseFloat(data.averageRate.toFixed(1)) : 0; 
      } else 
        return 0; 
    } catch (error) {
      console.error("Error while fetching rating:", error);
      return 0; 
    }
  };
  

  
  const fetchHalls = async (type) => {
    setLoading(true);
    try {
      const hallsData = [];
      const q = query(collection(db, 'users'));
      const querySnapshot = await getDocs(q);
  
      for (const doc of querySnapshot.docs) {
        const userData = doc.data();
        const userPosts = userData['posted halls'] || [];
  
        for (const post of userPosts) {
          if (type === "All Categories" || post.type === type) {
            const avgRating = await fetchAverageRating(post.hallName);
            hallsData.push({
              id: post.hallName, // Use hallName as id
              name: post.hallName,
              location: post.city,
              image: post.images && post.images.length > 0 ? post.images[0] : null,
              averageRating: avgRating, 
            });
          }
        }
      }
  
      setFetchedHalls(hallsData);
    } catch (err) {
      console.error('Error while fetching data:', err);
    } finally {
      setLoading(false);
    }
  };
  

  const SelectType = (type) => {
    setChoosenType(type);
    fetchHalls(type);
  };

  const Logout = async () => {
    try {
      await auth.signOut();
      setLoading(true);
      navigation.navigate('StartPage');
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false); // return false state 
    }
  };

  return (
    <View style={{ flex: 0 }}>
      <View style={styles.TopContainer}>
        <SearchFeild />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.countryRow}>
          {types.map((type, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => SelectType(type)}
              style={[
                styles.countryButton,
                choosenType === type && { backgroundColor: '#00e4d0' }
              ]}
            >
              <Text style={[styles.place, choosenType === type && { color: 'white' }]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {loading ? (
        <View style={styles.loadCont}>
          <ActivityIndicator size="large" color="#00e4d0" />
        </View>
      ) : (
        <FlatList
          data={fetchedhalls}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.Container}>
              <TouchableOpacity onPress={() => pressbutt(item)}>
                <View style={styles.Post}>
                  <Image source={{ uri: item.image }} style={styles.img} />
                  <View style={styles.text}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.loc}>{item.location}</Text>
                    <View style={styles.ratingCont}>
                    <FontAwesome name="star" size={20} color="gold" />
                    <Text style={styles.rateTxt}>{item.averageRating.toFixed(1)}</Text>
                    </View>
                  </View>  
                </View>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.flatListContent}
          ListEmptyComponent={<Text style={styles.noHallsText}>No halls available</Text>}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      )}
      {/* <TouchableOpacity onPress={Logout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const HomePage = () => {
  const Tab = createBottomTabNavigator();
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 57,
          backgroundColor: "#00e4d0",
        },
        tabBarLabelStyle: {
          color: "white",
          fontSize: 13,
        }
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomePageComponent}
        options={{
          tabBarIcon: () => (
            <Icon name="home" type="AntDesign" color={"white"} size={27} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="MyReservations"
        component={ClientReservations}
        options={{
          tabBarIcon: () => (
            <Entypo name="briefcase" color={"white"} size={23} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ClientChat}
        options={{
          tabBarIcon: () => (
            <Icon name="chat" color={"white"} size={23} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ClientProfile}
        options={{
          tabBarIcon: () => (
            <Icon name="account-circle" type="MaterialIcons" color={"white"} size={26} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    marginTop: 250,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#00e4d0',
    borderRadius: 10,
    alignItems: 'center',
  },
  NavBar: {
    marginTop: 259,    
  },
  loadCont: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    top:300
  },
  TopContainer: {
    width: 400,
    marginTop: 5,
    height: 60,
  },
  countryButton: {
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'white',
    paddingHorizontal: 11,
    paddingVertical: 9,
    paddingRight: 7,
    backgroundColor: '#f5f5f5', 
    marginRight: 4, 
    height:42
  },
  flatListContent: {
    flexGrow :1,
    paddingBottom: 120
  },
  place: {
    fontSize: 16,
    color: '#333',
  },
  logoutButtonText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 23,
  },
  countryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    height: 50,
    paddingTop: 1,
  },
  hallItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  hallName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  hallLocation: {
    fontSize: 16,
    color: '#555',
  },
  noHallsText: {
    textAlign: 'center',
    marginVertical: 270,
    fontSize: 18,
    color: '#999',
  },
  Post: {
    paddingHorizontal: 135,
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
  Container: {
    flex: 1,

  },
  text:{
    fontSize: 13,
    top:-10
  },

 img: {
      height: 95,
      marginRight: 10,
      width: 100,
      position:"absolute"
    },

    loc: {
      color: 'gray',
      fontSize: 16,
    },

    rateTxt: {
      color: 'gray',
      marginLeft: 6,
      fontSize: 17,
    },

    ratingCont: {
      flexDirection: 'row',
      top:4,
      alignItems: 'center',
    },
  
    name: {
      fontWeight: 'bold',
      fontSize: 17,
    },
});

export default HomePage;
