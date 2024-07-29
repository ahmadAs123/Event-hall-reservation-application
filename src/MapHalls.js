import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../config';

const MapHalls = ({ route }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [fetchedHalls, setFetchedHalls] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const mapRef = useRef(null);

  useEffect(() => {
    const { searchValue: newSearchValue } = route.params;
    if (newSearchValue !== searchValue) {
      setSearchValue(newSearchValue);
      fetchHalls(newSearchValue);
    }
  }, [route.params.searchValue]);

  const fetchHalls = async (searchValue) => {
    setLoading(true);
    try {
      const hallsData = [];
      const q = query(collection(db, 'users'));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const userPosts = userData['posted halls'] || [];
        userPosts.forEach((post, index) => {
          if (post.city === searchValue) {
            hallsData.push({
              id: `${doc.id}_${index}`,
              name: post.hallName,
              location: post.place,
            });
          }
        });
      });
      console.log('Fetched Halls:', hallsData);
      await convertLocToCoord(hallsData);
    } catch (err) {
      console.error('Error while fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const convertLocToCoord= async (hallsData) => {
    const updatedHalls = await Promise.all(
      hallsData.map(async (hall) => {
        try {
          const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
              q: hall.location,
              format: 'json',
            },
          });
          if (response.data && response.data.length > 0) {
            const { lat, lon } = response.data[0];
            return {
              ...hall,
              coordinates: { latitude: parseFloat(lat), longitude: parseFloat(lon) },
            };
          } 

        } catch (error) {
          console.error('Error while fetching coordinates:', error);
          return null;
        }
      })
    );
    setFetchedHalls(updatedHalls.filter(hall => hall !== null));
  };

  const navigateToHall = (hallId) => {
    console.log('Navigating to hall:', hallId);
    // must to complete here 
  };

  useEffect(() => {
    if (mapRef.current && fetchedHalls.length > 0) {
      const filteredHalls = fetchedHalls.filter(hall => hall.location.toLowerCase().includes(searchValue.toLowerCase()));
      if (filteredHalls.length > 0) {
        const { coordinates } = filteredHalls[0];
        if (coordinates) {
          mapRef.current.animateToRegion({
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }
      }
    }
  }, [fetchedHalls]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 31.7683,
          longitude: 35.2137,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {fetchedHalls.map((hall, index) => (
          <Marker
            key={index}
            coordinate={hall.coordinates || { latitude: 0, longitude: 0 }}
            title={hall.name}
            description={`Location: ${hall.location}`}
            onPress={() => navigateToHall(hall.id)}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapHalls;
