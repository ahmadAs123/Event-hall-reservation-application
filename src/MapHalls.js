import React from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapHalls = () => {
  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
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

export default MapHalls;
