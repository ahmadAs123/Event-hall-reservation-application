import { View, Text, TouchableOpacity,ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config';
import { Icon } from 'react-native-elements'
// import DrawerNavBar from '../component/DrawerNavBar';
import React,{useState} from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminHalls from './AdminPages/AdminHalls';
import AdminProfile from './AdminPages/AdminProfile';
import Adminsetting from './AdminPages/Adminsetting';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';


const AdminComponent = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false); 



  
  const handleLogout = async () => {
    try {
      setLoading(true); 
      await auth.signOut();
      navigation.navigate('StartPage');
    } catch (error) {
      console.log('Error logging out: ', error);
    }
  };

  const handlePostHall = () => {
    navigation.navigate('PostHall'); 
  };

  return (
    <View style={styles.container}>

       <View style={styles.boxcontainer}>

      
      <TouchableOpacity onPress={handlePostHall} style={styles.postHallButton}>
        <Text style={styles.postHallButtonText}>Post Hall</Text>
      </TouchableOpacity>


      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
      {loading ? (
          <ActivityIndicator color="white" /> 
        ) : (
          <Text style={styles.logoutButtonText}>Logout</Text>  
          )}
      </TouchableOpacity>
      
    </View>
    </View>
  );
};






const AdminPage = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator>

    <Tab.Screen
          name="HomePage"
          component={AdminComponent}
          options={{
            tabBarIcon: ({ color}) => (
              <Icon name="home" type="AntDesign" color={color} size={30} />
            ),
            headerShown: false,
          }}
        />


    <Tab.Screen
      name="Profile"
      component={AdminProfile}
      options={{
        tabBarIcon: ({ color }) => (
          <Icon name="account-circle" type="MaterialIcons" color={color} size={30} />
        ),
        headerShown: false,
      }}
    />




     <Tab.Screen
      name="MyHalls"
      component={AdminHalls}
      options={{
        tabBarIcon: ({ color}) => (
          <FontAwesomeIcon name="archway"  color={color} size={22} />
        ),
        headerShown: false,
      }}
    />


    <Tab.Screen
      name="Setting"
      component={Adminsetting}
      options={{
        tabBarIcon: ({ color}) => (
          <Icon name="list" type="feather" color={color} size={30} />
        ),
        headerShown: false,
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


  NavBar: {
    top:255
   },
  logoutButton: {
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#00e4d0',
    borderRadius: 10,
    alignItems: 'center',
    top:30
    
  },
  logoutButtonText: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#fff',
  },
  postHallButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4caf50',
    borderRadius: 10,
    alignItems: 'center',
  
  },
  postHallButtonText: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#fff',
  },
  boxcontainer:{
    width: 450,
    height: 870,
    justifyContent: 'center',
    paddingTop:20,
    paddingBottom:20,
    bottom:40,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
     }
};

export default AdminPage;
