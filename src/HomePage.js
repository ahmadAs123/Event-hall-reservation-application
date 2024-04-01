import { View, Text, TouchableOpacity,ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { auth } from '../config';
import SearchFeild from '../component/SearchFeild';
import React, { useState, useEffect , useLayoutEffect} from "react";
import { Icon } from 'react-native-elements'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ClientProfile from './ClientPages/ClientProfile';
import ClientReservations from './ClientPages/ClientReservations';
import ClientChat from './ClientPages/ClientChat';
import ClientSetting from './ClientPages/ClientSetting';
import { Entypo } from '@expo/vector-icons'; 



const HomePageComponent = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false); 

  const Logout = async () => {     // function to logout 
    try {
      await auth.signOut();
      setLoading(true)
      navigation.navigate('StartPage');
    } catch (error) {
      alert(error);
    }
    finally {
      setLoading(false); // return false state 
    }
  };

  

  return (
    <View>
      <View style ={styles.TopContainer} > 
      <SearchFeild />  
      </View>
      
      <TouchableOpacity onPress={Logout} style={styles.logoutButton}>
      {loading ? (
          <ActivityIndicator color="white" /> // Show spinner if loggingOut is true
        ) : (
          <Text style={styles.logoutButtonText}>Logout</Text>
        )}
      </TouchableOpacity> 
    </View>
  )
}




const HomePage = () => {
  const Tab = createBottomTabNavigator();
  const navigation = useNavigation();

 

  return (
    <Tab.Navigator>

<Tab.Screen
          name="HomePage"
          component={HomePageComponent}
          options={{
            tabBarIcon: ({ color}) => (
              <Icon name="home" type="AntDesign" color={color} size={30} />
            ),
            headerShown: false,
          }}
        />


<Tab.Screen
      name="Profile"
      component={ClientProfile}
      options={{
        tabBarIcon: ({ color }) => (
          <Icon name="account-circle" type="MaterialIcons" color={color} size={30} />
        ),
        headerShown: false,
      }}
    />



        <Tab.Screen
      name="Chat"
      component={ClientChat}
      options={{
        tabBarIcon: ({ color }) => (
          <Icon name="chat" color={color} size={30} />
        ),
        headerShown: false,
      }}
    />


        <Tab.Screen
      name="MyReservations"
      component={ClientReservations}
      options={{
        tabBarIcon: ({ color }) => (
      <Entypo name="briefcase" color={color} size={30} />        ),
        headerShown: false,
      }}
    />
        
    </Tab.Navigator>

  )
}

const styles = {
  logoutButton: {
    marginTop: 250,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#00e4d0',
    borderRadius: 10,
    alignItems: 'center',
  },
  NavBar: {
   marginTop:259    
  },
  
  TopContainer: {
    width: 400,
    marginTop:5,
    height: 60,
  }, 
  
  logoutButtonText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 23,
  },
};

export default HomePage
