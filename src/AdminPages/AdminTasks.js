import React, { useState } from 'react';
import { View, Text, Modal, TextInput, StyleSheet, Alert, TouchableOpacity,StatusBar } from 'react-native';
import { getDoc, setDoc, doc } from 'firebase/firestore';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons'; 
import { Calendar } from 'react-native-calendars';
import { db } from '../../config';

const TaskManager = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [assignedWorker, setAssignedWorker] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [hallName, setHallName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    taskTitle: '',
    hallName: '',
    assignedWorker: '',
  });

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!taskTitle.trim()) {
      errors.taskTitle = 'Title is required';
      isValid = false;
    }

    if (!assignedWorker.trim()) {
      errors.assignedWorker = 'Worker Name is required';
      isValid = false;
    }

    if (!hallName.trim()) {
      errors.hallName = 'Hall Name is required';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const addTask = async () => {
    if (validateForm()) {
      const newTask = { date: selectedDate, title: taskTitle, worker: assignedWorker, deadline: taskDeadline, status: 'Not Finished' };
      const hallDocRef = doc(db, 'tasks', hallName);

      const hallDoc = await getDoc(hallDocRef);
      const tasks = hallDoc.exists() ? hallDoc.data().tasks : [];

      tasks.push(newTask);

      await setDoc(hallDocRef, { tasks });
      setIsModalVisible(false);
      Alert.alert('Task added!', 'The task has been added successfully.');
    }
  };

  const showDatePicker = () => {
    setIsDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setIsDatePickerVisible(false);
  };

  const handleDateConfirm = (date) => {
    setTaskDeadline(date.toISOString());
    hideDatePicker();
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setHallName('');
    setTaskTitle('');
    setAssignedWorker('');
    setTaskDeadline('');
    setValidationErrors({
      taskTitle: '',
      hallName: '',
      assignedWorker: '',
    });
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
          setIsModalVisible(true);
        }}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Ionicons name="close-circle-outline" size={24} color="red" />
            </TouchableOpacity>
            <Text style={styles.modalText}>Add Task for {selectedDate}</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="create-outline" size={24} color="#666" style={styles.inputIcon} />
              <TextInput
                placeholder="Title"
                style={[styles.input, validationErrors.taskTitle ? styles.inputError : null]}
                value={taskTitle}
                onChangeText={setTaskTitle}
              />
            </View>
            {validationErrors.taskTitle ? <Text style={styles.errorText}>{validationErrors.taskTitle}</Text> : null}
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={24} color="#666" style={styles.inputIcon} />
              <TextInput
                placeholder="Worker Name"
                style={[styles.input, validationErrors.assignedWorker ? styles.inputError : null]}
                value={assignedWorker}
                onChangeText={setAssignedWorker}
              />
            </View>
            {validationErrors.assignedWorker ? <Text style={styles.errorText}>{validationErrors.assignedWorker}</Text> : null}
            <TouchableOpacity onPress={showDatePicker} style={styles.inputContainer}>
              <Ionicons name="calendar-outline" size={24} color="#666" style={styles.inputIcon} />
              <TextInput
                placeholder="Deadline"
                style={[styles.input, styles.dateInput]}
                value={taskDeadline ? new Date(taskDeadline).toLocaleString() : ''}
                editable={false}
              />
            </TouchableOpacity>
            <View style={styles.inputContainer}>
              <Ionicons name="business-outline" size={24} color="#666" style={styles.inputIcon} />
              <TextInput
                placeholder="Hall Name"
                style={[styles.input, validationErrors.hallName ? styles.inputError : null]}
                value={hallName}
                onChangeText={setHallName}
              />
            </View>
            {validationErrors.hallName ? <Text style={styles.errorText}>{validationErrors.hallName}</Text> : null}
            <TouchableOpacity style={styles.addButton} onPress={addTask}>
              <Text style={styles.addButtonText}>Add Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
  },
  dateInput: {
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  addButton: {
    backgroundColor: '#007BFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 50,
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default TaskManager;
