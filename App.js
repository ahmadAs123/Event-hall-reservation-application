import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { auth } from './config'
import { TouchableOpacity, Text } from "react-native";
import { Icon } from 'react-native-elements'



import Login from "./src/Login";
import SignUp from "./src/SignUp";
import Header from "./component/Header";
import HomePage from "./src/HomePage"
import ForrgotPassword from "./src/ForrgotPassword";
import StartPage from "./src/StartPage"


const initializeFirebaseAuth = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const onAuthStateChanged = user => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  return user;
};

const Stack = createStackNavigator();




function App() {
  initializeFirebaseAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StartPage">
        <Stack.Screen
          name="Login"
          component={Login}
          options={({ navigation }) => ({
            headerTitle: () => <Header name="Login" />,
            headerStyle: {
              height: 150,
              backgroundColor: '#00e4d0',
              // shadowColor: '#000',
              // elevation: 25
            },
            headerLeft: () =>(
              <TouchableOpacity onPress={() => navigation.navigate('StartPage')}>
              <Icon name="arrow-back" size={30}/>
              </TouchableOpacity>
            )
          })}
        />


        <Stack.Screen
          name="StartPage"
          component={StartPage}
          options={{
            headerTitle: () => <Header name="StartPage" />,
            headerStyle: {
              height: 150,
              backgroundColor: '#00e4d0',
              // shadowColor: '#000',
              // elevation: 25
            }
          }}
        />


          

        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={({ navigation }) => ({
            headerTitle: () => <Header name="SignUp" />,
            headerStyle: {
              height: 150,
              backgroundColor: '#00e4d0',
              // shadowColor: '#000',
              // elevation: 25
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
              // shadowColor: '#000',
              // elevation: 25
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
            options={{
              headerTitle: () => <Header name="HomePage" />,
              headerStyle: {
                height: 150,
                backgroundColor: '#00e4d0',
                shadowColor: '#000',
                // elevation: 200
              }
            }}
          />
      
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
