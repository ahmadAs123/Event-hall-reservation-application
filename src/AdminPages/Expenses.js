import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { db } from '../../config'; 
import { collection, getDoc, getDocs, updateDoc, doc, setDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const ExpenseCard = ({ expense }) => (
  <View style={styles.expenseCard}>
    <View style={styles.titleContainer}>
      <Text style={styles.expenseTitle}>{expense.hall}</Text>
    </View>
    <Text style={styles.expenseText}>{expense.text}</Text>
    <Text style={styles.expenseAmount}>${expense.amount}</Text>
    <Text style={styles.expenseDate}>{expense.date}</Text>
  </View>
);

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filterDate, setFilterDate] = useState(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newExpense, setNewExpense] = useState({ text: '', amount: '', date: '', hall: '', hallColor: '#fff' });
  
  const auth = getAuth();
  const currentUser = auth.currentUser ? auth.currentUser.uid : null;

  useEffect(() => {
    const fetchExpenses = async () => { //fetching expenses 
      try {
        const expensesSnapshot = await getDocs(collection(db, 'expenses'));
        const expensesData = []; 
        expensesSnapshot.forEach(doc => {
          const allExpenses = doc.data().expenses || [];
          const filteredExpenses = allExpenses.filter(expense => expense.OwnerId === currentUser);
          expensesData.push(...filteredExpenses);
        });
        setExpenses(expensesData);
      } catch (error) {
        console.error("Error fetching expenses: ", error);
      }
    };
    fetchExpenses();
  }, [currentUser]);

  const AddExpense = async () => {//for checking feilds
    if (!newExpense.text || !newExpense.amount || !newExpense.date || !newExpense.hall) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }

    const hallDocRef = doc(db, 'expenses', newExpense.hall);
    const expenseWithOwnerId = { ...newExpense, OwnerId: currentUser };

    try {
      const docSnapshot = await getDoc(hallDocRef);

      if (docSnapshot.exists()) { //add if exsist to same 
        await updateDoc(hallDocRef, {
          expenses: arrayUnion(expenseWithOwnerId)
        });
      } else {
        await setDoc(hallDocRef, {
          expenses: [expenseWithOwnerId]
        });
      }
      setExpenses([...expenses, expenseWithOwnerId]);
      setIsModalVisible(false);
      setNewExpense({ text: '', amount: '', date: '', hall: '', hallColor: '#fff' });
    } catch (error) {
      console.error("Error while adding expense: ", error);
    }
  };

  const filterExpensesByDate = () => {
    return expenses.filter(expense =>
      new Date(expense.date).getMonth() === filterDate.getMonth() &&
      new Date(expense.date).getFullYear() === filterDate.getFullYear()
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expenses</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.datePickerButton}
      >
        <Text style={styles.datePickerButtonText}>
          {`${filterDate.getMonth() + 1}/${filterDate.getFullYear()}`}
        </Text>
        <Ionicons name="calendar" color="#00e4d0" size={25} />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={filterDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || filterDate;
            setShowDatePicker(false);
            setFilterDate(currentDate);
          }}
        />
      )}
      {filterExpensesByDate().length > 0 ? (
        <FlatList
          data={filterExpensesByDate()}
          renderItem={({ item }) => <ExpenseCard expense={item} />}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text style={styles.noExpensesTxt}>No expenses</Text>
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Ionicons name="add" color="#fff" size={25} />
      </TouchableOpacity>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Ionicons name="close" size={25} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Expense</Text>
            <TextInput
              placeholder="Hall Name"
              style={styles.input}
              value={newExpense.hall}
              onChangeText={hall => setNewExpense({ ...newExpense, hall })}
            />
            <TextInput
              placeholder="Expense Description"
              style={styles.input}
              value={newExpense.text}
              onChangeText={text => setNewExpense({ ...newExpense, text })}
            />
            <TextInput
              placeholder="Amount"
              style={styles.input}
              value={newExpense.amount}
              keyboardType="numeric"
              onChangeText={amount => setNewExpense({ ...newExpense, amount })}
            />
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {newExpense.date ? new Date(newExpense.date).toLocaleDateString() : 'Select Date'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || new Date();
                  setShowDatePicker(false);
                  setSelectedDate(currentDate);
                  setNewExpense({ ...newExpense, date: currentDate.toISOString().split('T')[0] });
                }}
              />
            )}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={AddExpense}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: '#00e4d0',
    position: 'absolute',
    elevation: 5,
    bottom: 20,
    borderRadius: 50,
    padding: 15,
    right: 20,
  },
  closeButton: {
    right: 10,
    position: 'absolute',
    top: 10,
  },
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    flex: 1,
  },
  dateInput: {
    paddingVertical: 10,
    marginBottom: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  datePickerButton: {
    marginBottom: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  datePickerButtonText: {
    marginRight: 10,
    fontSize: 18,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  expenseAmount: {
    color: '#00e4d0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  expenseCard: {
    marginBottom: 10,
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#fff',
  },
  expenseDate: {
    color: '#888',
    fontSize: 14,
  },
  expenseText: {
    color: '#333',
    marginBottom: 10,
    fontSize: 18,
  },
  expenseTitle: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    fontSize: 16,
    paddingVertical: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 15,
  },
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    width: '80%',
  },
  modalTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 17,
  },
  noExpensesTxt: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#00e4d0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default Expenses;
