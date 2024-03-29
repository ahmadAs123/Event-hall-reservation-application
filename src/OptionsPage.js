import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapHalls from './MapHalls';
import ListHalls from './ListHalls';
import { Entypo } from '@expo/vector-icons'; 


const OptionsPage = () => {
    const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator>
<Tab.Screen
              name="List"
              component={MapHalls}
              options={{
                tabBarIcon: ({color}) => (
                  <Entypo name="list" color={color} size={30} />
                ),
                headerShown: false,
              }}
            />


<Tab.Screen
              name="Map"
              component={ListHalls}
              options={{
                tabBarIcon: ({ color}) => (
                  <Entypo name="map"  color={color} size={30} />
                ),
                headerShown: false,
              }}
            />
     </Tab.Navigator>
  )
}

export default OptionsPage