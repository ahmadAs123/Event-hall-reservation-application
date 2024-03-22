import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { auth } from './config'
import { TouchableOpacity, Text,Button  } from "react-native";
import { Icon } from 'react-native-elements'
import Login from "./src/Login";
import SignUp from "./src/SignUp";
import Header from "./component/Header";
import HomePage from "./src/HomePage"
import ForrgotPassword from "./src/ForrgotPassword";
import StartPage from "./src/StartPage"
import AdminPage  from "./src/AdminPage";
import PostHall from "./src/PostHall";
import ListHalls from "./src/ListHalls";
import MapHalls from "./src/MapHalls";
import AdminHalls from "./src/AdminPages/AdminHalls";
import AdminProfile from "./src/AdminPages/AdminProfile";
import Adminsetting from "./src/AdminPages/Adminsetting";
import AdminChat from "./src/AdminPages/AdminChat";
import 'react-native-gesture-handler';
const initFirebaseAuth = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

 
  useEffect(() => {
   return auth.onAuthStateChanged((user) => {
    setUser(user);
    // console.log(user)
    if (initializing)
     setInitializing(false);
  }); 
  }, []);

  if (initializing)
   return null;

  return user;
};

const Stack = createStackNavigator();


const logout = () => {
alert("im here")};

function App() {
  
  initFirebaseAuth();

  return (
    <NavigationContainer>
      
      <Stack.Navigator>
      <Stack.Screen
        name="StartPage" 
        component={StartPage}

        options={{
          headerTitle: () => <Header name="StartPage" />,
          headerStyle: {
            height: 150,
            backgroundColor: '#00e4d0',
            shadowColor: '#000',
            
          },
          headerLeft: () => null,
        }}
        />
 
<Stack.Screen
          name="AdminPage"  
          component={AdminPage}
          options={{
            headerTitle: () => <Header name="AdminPage" />,
            headerStyle: {
              height: 150,
              backgroundColor: '#00e4d0',
              
            },
            headerLeft: () => null,
          }}
          
        />

<Stack.Screen
          name="AdminChat"  
          component={AdminChat}
          options={{
            headerTitle: () => <Header name="AdminChat" />,
            headerStyle: {
              height: 150,
              backgroundColor: '#00e4d0',
              
            },
            headerLeft: () => null,
          }}
        />


<Stack.Screen
          name="MapHalls"  
          component={MapHalls}
          options={{
            headerTitle: () => <Header name="MapHalls" />,
            headerStyle: {
              height: 150,
              backgroundColor: '#00e4d0',
              
            },
            headerLeft: () => null,
          }}
        />


<Stack.Screen
          name="ListHalls"  
          component={ListHalls}
          options={{
            headerTitle: () => <Header name="ListHalls" />,
            headerStyle: {
              height: 150,
              backgroundColor: '#00e4d0',
              
            },
            headerLeft: () => null,
          }}
        />

        <Stack.Screen
          name="Login"
          component={Login}
          options={({ navigation }) => ({
            headerTitle: () => <Header name="Login" />,
            headerStyle: {
              height: 150,
              backgroundColor: '#00e4d0',
             
            },
            headerLeft: () =>(
              <TouchableOpacity onPress={() => navigation.navigate('StartPage')}>
              <Icon name="arrow-back" size={30}/>
              </TouchableOpacity>
            )
          })}
        />


        


          

        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={({ navigation }) => ({
            headerTitle: () => <Header name="SignUp" />,
            headerStyle: {
              height: 150,
              backgroundColor: '#00e4d0',
            
            },
            headerLeft: () =>(
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Icon name="arrow-back" size={30}/>
              </TouchableOpacity>
            )
          })}
        />


        <Stack.Screen
          name="ForrgotPassword"
          component={ForrgotPassword}
          options={({ navigation }) => ({
            headerTitle: () => <Header name="ForrgotPassword" />,
            headerStyle: {
              height: 150,
              backgroundColor: '#00e4d0',
          
            },
            headerLeft: () =>(
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Icon name="arrow-back" size={30}/>
              </TouchableOpacity>
            )
          })}
        />
         
        
<Stack.Screen
            name="HomePage"
            component={HomePage}
            options={({ navigation ,route}) => ({
              headerTitle: () => <Header name="HomePage" />,
              headerStyle: {
                height: 150,
                backgroundColor: '#00e4d0',
                shadowColor: '#000',
              },
              headerLeft: () => null,
              headerRight: () => (
                <TouchableOpacity onPress={logout} style={{ top: 8, right: 10 }} >
                  <Icon name="logout" type="AntDesign" color="white" size={35} />
                </TouchableOpacity>
              ),
            })}
            
          />
           
           <Stack.Screen
          name="PostHall"
          component={PostHall}
          options={({ navigation }) => ({
            headerTitle: () => <Header name="ForrgotPassword" />,
            headerStyle: {
              height: 150,
              backgroundColor: '#00e4d0',
             
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.navigate('AdminPage')}>
                <Icon name="arrow-back" size={30}/>
              </TouchableOpacity>
            ),
          })}
        />
          <Stack.Screen
          name="AdminProfile"
          component={AdminProfile}
          options={({ navigation }) => ({
            headerTitle: () => <Header name="AdminProfile" />,
            headerStyle: {
              height: 150,
              backgroundColor: '#00e4d0',
             
            },
            headerLeft: () =>(
              <TouchableOpacity onPress={() => navigation.navigate('AdminPage')}>
              <Icon name="arrow-back" size={30}/>
              </TouchableOpacity>
            )
          })}
        />

<Stack.Screen
          name="Adminsetting"
          component={Adminsetting}
          options={({ navigation }) => ({
            headerTitle: () => <Header name="Adminsetting" />,
            headerStyle: {
              height: 150,
              backgroundColor: '#00e4d0',
             
            },
            headerLeft: () =>(
              <TouchableOpacity onPress={() => navigation.navigate('AdminPage')}>
              <Icon name="arrow-back" size={30}/>
              </TouchableOpacity>
            )
          })}
        />


<Stack.Screen
          name="AdminHalls"
          component={AdminHalls}
          options={({ navigation }) => ({
            headerTitle: () => <Header name="AdminHalls" />,
            headerStyle: {
              height: 150,
              backgroundColor: '#00e4d0',
             
            },
            headerLeft: () =>(
              <TouchableOpacity onPress={() => navigation.navigate('AdminPage')}>
              <Icon name="arrow-back" size={30}/>
              </TouchableOpacity>
            )
          })}
        />
         
      </Stack.Navigator>
      
    </NavigationContainer>
  );
}

export default App;
