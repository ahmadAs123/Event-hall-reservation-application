import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
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
            const [latitude, longitude] = post.place.split(',').map(Number);
            hallsData.push({
              id: `${doc.id}_${index}`,
              name: post.hallName,
              coordinates: { latitude, longitude },
            });
          }
        });
      });
      setFetchedHalls(hallsData);
    } catch (err) {
      console.error('Error while fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const navigateToHall = (hallName) => {
    navigation.navigate('SelectedHall',  hallName ); 
  };

  useEffect(() => {
    if (mapRef.current && fetchedHalls.length > 0) {
      const filteredHalls = fetchedHalls.filter(hall => hall.name.toLowerCase().includes(searchValue.toLowerCase()));
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
            description={`Location: ${hall.coordinates.latitude}, ${hall.coordinates.longitude}`}
            onPress={() => navigateToHall(hall.name)}
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
