import React from 'react';
import { View,StyleSheet,Text,TouchableOpacity ,ScrollView} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapHalls = () => {
  const SelectCountry = (place ) => {
    // Do something with the selected country
    console.log("Selected country:", place );
  };

  const countries = ["Jerusalem", "Tel Aviv", "Haifa" , "Bet hanina" , "kufar akkab"]; // Add more countries as needed

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

   
      <MapView
        style={{ flex: 200}}
        initialRegion={{
          latitude: 31.7683, // Latitude of Jerusalem
          longitude: 35.2137, // Longitude of Jerusalem
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude: 31.7683, longitude: 35.2137 }} // Jerusalem coordinates
          title="Jerusalem"
          description="Holy City"
        />
      </MapView>
    
    </View>
  );
};
const styles = StyleSheet.create({


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
   paddingHorizontal: 14,
   paddingVertical: 6,
   paddingRight:7,
   backgroundColor: '#f5f5f5', // Light gray color
   marginRight: 4, // Added margin to separate buttons

 },
text:{
  fontSize: 13,

},
  
  location: {
    color: 'gray',
    fontSize: 16,
  },

  img: {
    height: 95,
    marginRight: 10,
    width: 100,
    position:"absolute"
  },
  textContainer: {
    flex: 1,
    left:120,
    top: -10,
  },

  name: {
    fontWeight: 'bold',
    fontSize: 17,
  },
});
export default MapHalls;
