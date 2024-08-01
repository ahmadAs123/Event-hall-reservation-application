import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { db, auth } from "../../config";
import { collection, getDocs, updateDoc, doc, getDoc, query, where } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ClientProfile from "../ClientPages/ClientProfile";

const TasksComponent = () => {
  const [tasks, setTasks] = useState([]);
  const [userName, setUserName] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Fetching the current user's name
  const fetchUserName = async () => {
    const user = auth.currentUser;

    if (user) {
      const uid = user.uid;
      const usersCollRef = collection(db, 'users');
      const q = query(usersCollRef, where('userId', '==', uid));
      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          const userData = docSnap.data();
          const fullName = `${userData.firstName} ${userData.lastName}`;
          setUserName(fullName);
        }
      } catch (error) {
        console.error('Failed while fetching user data:', error);
      }
    }
  };

  // Fetch tasks from Firestore
  const fetchTasks = async () => {
    const tasksRef = collection(db, 'tasks');
    const taskSnapshot = await getDocs(tasksRef);
    const tasksList = taskSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }));
    // Filter tasks according to the id username 
    const filteredTasks = tasksList
      .map(hall => ({
        ...hall,
        tasks: hall.tasks.filter(task => task.worker === userName)
      }))
      .filter(hall => hall.tasks.length > 0); 

    setTasks(filteredTasks);
    // console.log(filteredTasks);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTasks().then(() => setRefreshing(false));
  }, [userName]);


  
  useEffect(() => {
    fetchUserName().then(() => {
      fetchTasks();
    });
  }, [userName]);

  //  change status function  for a task
  const handleStatusChange = async (hallName, taskIndex, newStatus) => {
    const hallDocRef = doc(db, 'tasks', hallName);
    const hallDoc = await getDoc(hallDocRef);
    const hallData = hallDoc.data();
    hallData.tasks[taskIndex].status = newStatus;
    await updateDoc(hallDocRef, { tasks: hallData.tasks });
    fetchTasks(); 
  };

  //  delete  a task
  const handleDeleteTask = async (hallName, taskIndex) => {
    const hallDocRef = doc(db, 'tasks', hallName);
    const hallDoc = await getDoc(hallDocRef);
    const hallData = hallDoc.data();

    hallData.tasks.splice(taskIndex, 1); 
    await updateDoc(hallDocRef, { tasks: hallData.tasks });
    fetchTasks(); 
    Alert.alert('Task deleted!', 'The task has been successfully deleted.');
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.Label}>Tasks  </Text>
        <Icon name="tasks" size={26} color="#4CAF50" />
      </View>
      {tasks.map((hall) => (
        <View key={hall.id} style={styles.hallContainer}>
          <Text style={styles.hallLabel}>{hall.id}</Text>
          {hall.tasks.map((task, index) => (
            <View key={index} style={styles.taskCard}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <View style={styles.taskInfoRow}>
                <Ionicons name="person-outline" size={20} color="black" style={{marginRight: 10,}} />
                <Text>{task.worker}</Text>
              </View>
              <View style={styles.taskInfoRow}>
                <Ionicons name="calendar-outline" size={20} color="black" style={{marginRight: 10,}} />
                <Text>Deadline: {new Date(task.deadline).toLocaleString()}</Text>
              </View>
              <View style={styles.taskInfoRow}>
                {task.status === 'Done' ? (
                  <Ionicons name="checkmark-done-circle" size={20} color="green" style={{marginRight: 10,}} />
                ) : (
                  <Ionicons name="close-circle" size={20} color="red" style={{marginRight: 10,}} />
                )}
                <Text>Status: {task.status}</Text>
              </View>
              <View style={[styles.buttonRow, task.status === 'Done' ? {justifyContent: 'center'} : null]}>
                {task.status === 'Not Finished' && (
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#007BFF' }]}
                    onPress={() => handleStatusChange(hall.id, index, 'Done')}
                  >
                    <Ionicons name="checkmark-done" size={24} color="#fff" />
                    <Text style={{color: 'white'}}>Mark as Done</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const Tasks = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#00e4d0",
          height: 57,
        },
        tabBarLabelStyle: {
          color: "white",
          fontSize: 13,
          fontWeight: "bold",
        },
      }}
    >
      <Tab.Screen
        name="Task"
        component={TasksComponent}
        options={{
          tabBarIcon: () => (
            <Icon name="tasks" type="feather" size={21} color="white" />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ClientProfile}
        options={{
          tabBarIcon: () => (
            <Icons name="account-circle" type="MaterialIcons" color={"white"} size={26} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 21,
    backgroundColor: '#f0f0f0',
    flex: 1,
  },

  hallContainer: {
    marginBottom: 20,
    borderRadius: 10,
    padding: 10,
  },

  hallLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
    backgroundColor: '#00e4d0',
    padding: 6,
    borderRadius: 6,
    color: 'black',
  },
  taskCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },


  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#42a5f5',
  },


  taskInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },


  button: {
    flexDirection: 'row',
    borderRadius: 5,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginLeft: 11,
  },

  Label: {
    fontSize: 30,
    fontWeight: 'bold',
    top: -3,
    left: 7,
    paddingLeft: 6,
  },
});

export default Tasks;
