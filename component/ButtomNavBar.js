
import React, { useState, useEffect} from "react";
import { Icon } from 'react-native-elements'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapHalls from "../src/MapHalls";
import ListHalls from "../src/ListHalls";

const Tab = createBottomTabNavigator();

function ButtomNavBar({ searchValue }) {

    return (
      <Tab.Navigator >
       
        <Tab.Screen
          name="List"
          initialParams={{searchValue}} 
          component={ListHalls}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="list" type="feather" color={color} size={size} />
            ),
          }}
        />
         <Tab.Screen
          name="Map"
          component={MapHalls}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="map" type="feather" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }


  export default ButtomNavBar 