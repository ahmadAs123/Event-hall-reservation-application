import { View, Text, TouchableOpacity,ActivityIndicator,StatusBar  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config';
import { Icon } from 'react-native-elements'
// import DrawerNavBar from '../component/DrawerNavBar';
import React,{useState} from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminHalls from './AdminPages/AdminHalls';
import AdminProfile from './AdminPages/AdminProfile';
import AdminChat from './AdminPages/AdminChat';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';


const AdminComponent = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false); 


  const handlePostHall = () => {
    navigation.navigate('PostHall'); 
  };

  const handleAddTask = () => {
    navigation.navigate('AdminTasks'); 
  };

  const handleAddExpense = () => {
    navigation.navigate('Expenses'); 
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#00e4d0" barStyle="light-content" />

       <View style={styles.boxcontainer}>

      
      <TouchableOpacity onPress={handlePostHall} style={styles.postHallButton}>
        <Text style={styles.postHallButtonText}>Post Hall</Text>
      </TouchableOpacity>



      <TouchableOpacity onPress={handleAddTask} style={styles.postHallButton}>
        <Text style={styles.postHallButtonText}>Add Tasks</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleAddExpense} style={styles.postHallButton}>
        <Text style={styles.postHallButtonText}>Add Expenses</Text>
      </TouchableOpacity>
           
    </View>
    </View>
  );
};






const AdminPage = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
    screenOptions={{
      tabBarStyle: {
        height: 55,
        backgroundColor: "#00e4d0",
      },
      tabBarLabelStyle: {
        color: "white",
        fontSize: 13,
      }
    }}
  >
    <Tab.Screen
          name="HomePage"
          component={AdminComponent}
          options={{
            tabBarIcon: ({ color}) => (
              <Icon name="home" type="AntDesign" color={'white'} size={28} />
            ),
            headerShown: false,
          }}
        />


<Tab.Screen
      name="Halls Requests"
      component={AdminHalls}
      options={{
        tabBarIcon: ({ color}) => (
          <FontAwesomeIcon name="archway"  color={'white'} size={20} />
        ),
        headerShown: false,
      }}
    />



<Tab.Screen
      name="Chat"
      component={AdminChat}
      options={{
        tabBarIcon: ({ color }) => (
          <Icon name="chat" type="material" color={'white'} size={23} />
        ),
        headerShown: false,
      }}
    />


    <Tab.Screen
      name="Profile"
      component={AdminProfile}
      options={{
        tabBarIcon: ({ color }) => (
          <Icon name="account-circle" type="MaterialIcons" color={'white'} size={26} />
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
    paddingVertical: 15,
    backgroundColor: '#00e4d0',
    borderRadius: 10,
    alignItems: 'center',
  
  },
  postHallButtonText: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#fff',
  },
  boxcontainer:{
    width: 400,
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
