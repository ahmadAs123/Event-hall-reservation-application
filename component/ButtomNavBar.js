
import React, { useState, useEffect} from "react";
import { Icon } from 'react-native-elements'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapHalls from "../src/MapHalls";
import ListHalls from "../src/ListHalls";

const Tab = createBottomTabNavigator();

function ButtomNavBar({ searchValue }) {

    return (
      <Tab.Navigator
      screenOptions={{
        tabBarStyle:{
          backgroundColor:"#00e4d0",
          height:57,
        },
        tabBarLabelStyle: {
          color: "white" , 
          fontSize: 13, 
          fontWeight:"bold"
        }

      }}
       >
       
        <Tab.Screen
          name="List"
          initialParams={{searchValue}} 
          component={ListHalls}
          options={{
            tabBarIcon: () => (
              <Icon name="list" type="feather" color={"white"} size={23} />
            ),
            headerShown: false, 
          }}
        />
         <Tab.Screen
          name="Map"
          component={MapHalls}
          options={{
            tabBarIcon: () => (
              <Icon name="map" type="feather" color={"white"} size={23} />
            ),
            headerShown: false, 
          }}
        />
      </Tab.Navigator>
    );
  }


  export default ButtomNavBar 