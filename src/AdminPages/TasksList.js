import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { db, auth } from "../../config";
import { collection, getDocs, updateDoc, doc, getDoc, query, where } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';

const TasksList = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [tasks, setTasks] = useState([]);
 
  // Fetching tasks for curr admin
  const fetchTasks = async () => {
    const user = auth.currentUser;
    const uid = user.uid;
    const usersCollRef = collection(db, 'users');
    const q = query(usersCollRef, where('userId', '==', uid));
  try {
    const querySnapshot = await getDocs(q);
     if (!querySnapshot.empty) {
    const userData = querySnapshot.docs[0].data();
    const postedHalls = userData['posted halls'] || [];
    const hallNames = postedHalls.map(hall => hall.hallName);
    const tasksRef = collection(db, 'tasks');
    const taskSnapshot = await getDocs(tasksRef);
    const tasksList = taskSnapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() };
    }).filter(taskDoc => {
      const match = hallNames.includes(taskDoc.id);
      return match;
    });
    setTasks(tasksList);
  }
} catch (error) {
  console.error('erorr while fetching tasks:', error);
}  
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTasks().then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);

  // delete  a task from db
  const DeleteTask = async (hallName, taskIndex) => {
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
              {hall.tasks.length > 0 && (
              <Text style={styles.hallLabel}>{hall.id}</Text>
        )}   
        {hall.tasks.map((task, index) => (
            <View key={index} style={styles.taskCard}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <View style={styles.taskInfoRow}>
                <Ionicons name="person-outline" size={20} color="#666" style={{marginRight: 10,}} />
                <Text>{task.worker}</Text>
              </View>
              <View style={styles.taskInfoRow}>
                <Ionicons name="calendar-outline" size={20} color="#666" style={{marginRight: 10}} />
                <Text>Deadline: {new Date(task.deadline).toLocaleString()}</Text>
              </View>
              <View style={styles.taskInfoRow}>
                {task.status === 'Done' ? (
                  <Ionicons name="checkmark-done-circle" size={20} color="green" style={{marginRight: 10,}} />
                ) : (
                  <Ionicons name="close-circle" size={20} color="red" style={{marginRight: 10}} />
                )}
                <Text>Status: {task.status}</Text>
              </View>
              <View style={[styles.buttonRow, task.status === 'Done' ? {justifyContent: 'center' }: null]}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#dc3545' }]}
                  onPress={() => DeleteTask(hall.id, index)}
                >
                  <Ionicons name="close-circle" size={24} color="#fff" />
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 18,
    backgroundColor: '#f0f0f0',
    flex: 1,

  },


  hallContainer: {
    marginBottom: 17,
    borderRadius: 11,
    padding: 11,
  },


  hallLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    backgroundColor: '#00e4d0',
    padding: 6,
    borderRadius: 6,
    color: 'black',
  },


  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 11,
    padding: 15,
    marginBottom: 11,
  },

  taskTitle: {
    fontSize: 18,
    color: 'blue',
    fontWeight: 'bold',
    marginBottom: 5,
  },

  taskInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },


  buttonText: {
    color: 'white',
    marginLeft: 5,
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
    paddingHorizontal: 15,
    marginLeft: 10,
  },

  Label: {
    fontSize: 30,
    fontWeight: 'bold',
    top: -3,
    left: 7,
    paddingLeft: 6,
  },
});

export default TasksList;
