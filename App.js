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
import OptionsPage from './src/OptionsPage';
import ClientChat from './src/ClientPages/ClientChat'
import ChatPage from "./src/ChatPage";
import 'react-native-gesture-handler';
import SelectedHall from "./src/SelectedHall";
import ClientReservations from "./src/ClientPages/ClientReservations";
import EditProfile from "./src/ClientPages/EditProfile";
import ClientProfile from "./src/ClientPages/ClientProfile";
import ChatDetails from "./src/ChatDetails";
import AdminPosts from "./src/AdminPages/AdminPosts";
import EditPost from "./src/AdminPages/EditPost";
import AdminComments from "./src/AdminPages/AdminComments";
import AdminPays from "./src/AdminPages/AdminPays";
import AdminTasks from './src/AdminPages/AdminTasks'
import Tasks from "./src/AdminPages/Tasks";
import Expenses from "./src/AdminPages/Expenses";
import TasksList from './src/AdminPages/TasksList'

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
          name="EditProfile"  
          component={EditProfile}
          options={{
            headerTitle: () => <Header name="EditProfile" />,
            headerStyle: {
              height: 110,
              backgroundColor: '#00e4d0',
              
            },
            
          }}
          
        />

<Stack.Screen
          name="MapHalls"  
          component={MapHalls}
          options={{
            headerTitle: () => <Header name="MapHalls" />,
            headerStyle: {
              height: 110,
              backgroundColor: '#00e4d0',
              
            },
            headerLeft: () => null,
          }}
          
        />


<Stack.Screen
          name="Tasks"  
          component={Tasks}
          options={{
            headerTitle: () => <Header name="EditProfile" />,
            headerStyle: {
              height: 120,
              backgroundColor: '#00e4d0',
            },
            headerLeft: () => null,
          }}  
        />



<Stack.Screen
          name="Expenses"  
          component={Expenses}
          options={{
            headerTitle: () => <Header name="Expenses" />,
            headerStyle: {
              height: 120,
              backgroundColor: '#00e4d0',
            },
          }}  
        />
        

        
      <Stack.Screen
        name="ChatDetails"
        component={ChatDetails}
        options={{ headerShown: false }}
      />

<Stack.Screen
        name="AdminComments"
        component={AdminComments}
        options={{
          headerTitle: () => <Header name="AdminComments" />,
          headerStyle: {
            height: 120,
            backgroundColor: '#00e4d0',
            
          },
        }}
      />


<Stack.Screen
        name="EditPost"
        component={EditPost}
        options={({ navigation }) => ({
          headerTitle: () => <Header name="EditPost" />,
          headerStyle: {
            height: 87,
            backgroundColor: '#00e4d0',
           
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate('AdminPosts')}>
              <Icon name="arrow-back" size={30} color={'white'}/>
            </TouchableOpacity>
          ),
        })}
      />
<Stack.Screen
          name="AdminPage"  
          component={AdminPage}
          options={{
            headerTitle: () => <Header name="AdminPage" />,
            headerStyle: {
              height: 90,
              backgroundColor: '#00e4d0',
              
            },
            headerLeft: () => null,
          }}
          
        />



<Stack.Screen
          name="SelectedHall"  
          component={SelectedHall}
          options={({ navigation }) => ({
            headerTitle: () => <Header name="OptionsPage" />,
            headerStyle: {
              height: 90,
              backgroundColor: '#00e4d0',
             
            },
            headerLeft: () =>(
              <TouchableOpacity onPress={() => navigation.navigate('HomePage')}>
              <Icon name="arrow-back" size={30} color={'white'}/>
              </TouchableOpacity>
            )
          })}
          
        />

<Stack.Screen
          name="AdminTasks"  
          component={AdminTasks}
          options={({ navigation }) => ({
            headerTitle: () => <Header name="AdminTasks" />,
            headerStyle: {
              height: 100,
              backgroundColor: '#00e4d0',
             
            },
            // headerLeft: () =>(
            //   <TouchableOpacity onPress={() => navigation.navigate('OptionsPage')}>
            //   <Icon name="arrow-back" size={30}/>
            //   </TouchableOpacity>
            // )
          })}
          
        />
<Stack.Screen
          name="AdminChat"  
          component={AdminChat}
          options={{
            headerTitle: () => <Header name="AdminChat" />,
            headerStyle: {
              height: 120,
              backgroundColor: '#00e4d0',
              
            },
            headerLeft: () => null,
          }}
        />


<Stack.Screen
          name="ChatPage"  
          component={ChatPage}
          options={{
            headerShown: false,

          }}
        />

<Stack.Screen
          name="AdminPays"  
          component={AdminPays}
          options={({ navigation }) => ({
            headerTitle: () => <Header name="AdminChat" />,
            headerStyle: {
              height:120,
              backgroundColor: '#00e4d0',
             
            },
            headerLeft: () =>(
              <TouchableOpacity onPress={() => navigation.navigate('AdminPage')}>
              <Icon name="arrow-back" size={30} color={'white'}/>
              </TouchableOpacity>
            )
          })}
        />

<Stack.Screen
          name="AdminPosts"  
          component={AdminPosts}
          options={({ navigation }) => ({
            headerTitle: () => <Text style={{ fontSize: 24, color: 'black' , fontWeight:'bold' }}>My Posts</Text>,
            headerStyle: {
              height:100,
              backgroundColor: '#00e4d0',
             
            },
            headerLeft: () =>(
              <TouchableOpacity onPress={() => navigation.navigate('AdminPage')}>
              <Icon name="arrow-back" size={30} color={'white'}/>
              </TouchableOpacity>
            )
          })}
        />


<Stack.Screen
          name="OptionsPage"  
          component={OptionsPage}
          options={({ navigation }) => ({
            headerTitle: () => <Header name="OptionsPage" />,
            headerStyle: {
              height: 120,
              backgroundColor: '#00e4d0',
             
            },
            headerLeft: () =>(
              <TouchableOpacity onPress={() => navigation.navigate('HomePage')}>
              <Icon name="arrow-back" size={30} color={'white'}/>
              </TouchableOpacity>
            )
          })}
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
              <Icon name="arrow-back" size={30} color={'white'}/>
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
              <Icon name="arrow-back" size={30} color={'white'}/>
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
              <Icon name="arrow-back" size={30} color={'white'}/>
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
                height: 90,
                backgroundColor: '#00e4d0',
                shadowColor: '#000',
              },
              headerLeft: () => null,
            
            })}
            
          />
           
           <Stack.Screen
          name="PostHall"
          component={PostHall}
          options={({ navigation }) => ({
            headerTitle: () => <Header name="PostHall" />,
            headerStyle: {
              height: 100,
              backgroundColor: '#00e4d0',
             
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.navigate('AdminPage')}>
                <Icon name="arrow-back" size={30} color={'white'}/>
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
              height: 120,
              backgroundColor: '#00e4d0',
             
            },
            headerLeft: () =>(
              <TouchableOpacity onPress={() => navigation.navigate('AdminPage')}>
              <Icon name="arrow-back" size={30} color={'white'}/>
              </TouchableOpacity>
            )
          })}
        />

<Stack.Screen
          name="ClientProfile"
          component={ClientProfile}
          options={({ navigation }) => ({
            headerTitle: () => <Header name="ClientProfile" />,
            headerStyle: {
              height: 120,
              backgroundColor: '#00e4d0',  
            },
            headerLeft: () => null,
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
              <Icon name="arrow-back" size={30} color={'white'}/>
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
              <Icon name="arrow-back" size={30} color={'white'}/>
              </TouchableOpacity>
            )
          })}
        />


<Stack.Screen
          name="TasksList"
          component={TasksList}
          options={({ navigation }) => ({
            headerTitle: () => <Header name="TasksList" />,
            headerStyle: {
              height: 120,
              backgroundColor: '#00e4d0',
             
            },
            headerLeft: () =>(
              <TouchableOpacity onPress={() => navigation.navigate('AdminPage')}>
              <Icon name="arrow-back" size={30} color={'white'}/>
              </TouchableOpacity>
            )          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
