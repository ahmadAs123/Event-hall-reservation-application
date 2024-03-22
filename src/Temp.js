import React, { useState, useEffect} from "react";
import { Icon } from 'react-native-elements'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity } from 'react-native';
import AdminHalls from "../src/AdminPages/AdminHalls";
import Adminsetting from "../src/AdminPages/Adminsetting";
import AdminChat from "../src/AdminPages/AdminChat";
import HomePage from "../src/HomePage";
import AdminProfile from "./AdminPages/AdminProfile";


const Tab = createBottomTabNavigator();

const handleLogout = async () => {
  alert("Profile Page");
};

const TempScreen = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text>log out</Text>
      </TouchableOpacity>
    </View>
  );
};

const Temp = () => {
  return (
    <Tab.Navigator>

      
<Tab.Screen
        name="HomePage"
        component={TempScreen} // Use TempScreen component here
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="home" type="Entypo" color={color} size={30} />
          ),
        }}
      />
      
      <Tab.Screen
    
        name="Profile"
        component={AdminProfile}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="account-circle" type="MaterialIcons" color={color} size={30} />
          ),
        }}
      />


      <Tab.Screen
        name="MyHalls"
        component={AdminHalls}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="home" type="AntDesign" color={color} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="Setting"
        component={Adminsetting}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="list" type="feather" color={color} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#00e4d0',
    borderRadius: 10,
    alignItems: 'center',
  },
};


export default Temp






 