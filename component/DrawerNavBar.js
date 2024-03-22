
// import React, { useState, useEffect} from "react";
// import { Icon } from 'react-native-elements'
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import AdminHalls from "../src/AdminPages/AdminHalls";
// import AdminProfile from "../src/AdminPages/AdminProfile";
// import Adminsetting from "../src/AdminPages/Adminsetting";
// import AdminChat from "../src/AdminPages/AdminChat";
// import HomePage from "../src/HomePage";
// const Tab = createBottomTabNavigator();

// function DrawerNavBar() {
//     return (
//       <Tab.Navigator>
//         <Tab.Screen
//           name="Profile"
//           component={HomePage}
//           options={{
//             tabBarIcon: ({ color }) => (
//               <Icon name="account-circle" type="MaterialIcons" color={color} size={30} />
//             ),
//           }}
//         />

// <Tab.Screen
//           name="Chat"
//           component={AdminChat}
//           options={{
//             tabBarIcon: ({ color}) => (
//               <Icon name="chat" type="Entypo" color={color} size={30} />
//             ),
//           }}
//         />


//          <Tab.Screen
//           name="MyHalls"
//           component={AdminHalls}
//           options={{
//             tabBarIcon: ({ color}) => (
//               <Icon name="home" type="AntDesign" color={color} size={30} />
//             ),
//           }}
//         />


//         <Tab.Screen
//           name="Setting"
//           component={Adminsetting}
//           options={{
//             tabBarIcon: ({ color}) => (
//               <Icon name="list" type="feather" color={color} size={30} />
//             ),
//           }}
//         />
//       </Tab.Navigator>
//     );
//   }


//   export default DrawerNavBar 