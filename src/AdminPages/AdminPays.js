import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from '../../config';
import { FontAwesome ,MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from "firebase/auth";


const AdminPays = () => {
  const [reservations, setReservations] = useState([]);
  const [totalReservations, setTotalReservations] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [totalIncome, setTotalIncome] = useState(0);

  const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        const userId = user.uid;
    
        const startOfMonth = format(new Date(selectedYear, selectedMonth, 1), 'yyyy-MM-dd');
        const endOfMonth = format(new Date(selectedYear, selectedMonth + 1, 0), 'yyyy-MM-dd');
    
        // Fetch the reservations for the current user
        const reservationsCollection = collection(db, 'reservations');
        const ownerQuery = query(reservationsCollection, where('OwnerID', '==', userId));
        const ownerSnapshot = await getDocs(ownerQuery);
    
        let IncomeCalc = 0;
        let totalRes = 0;
    
        if (ownerSnapshot.empty) {
          setTotalIncome(0);
          setTotalReservations(0);
          return;
        }
    
        // Filter reservations by date range locally
        const reservationsData = ownerSnapshot.docs
        .map(doc => {
          const data = doc.data();
          // Check if the reservation date is within the selected range and the status is 'accepted'
          if (data.date >= startOfMonth && data.date <= endOfMonth && data.status === 'accepted') {
            const [start, end] = data.shift.split(' - ');
            const startHour = parseInt(start.split(':')[0], 10);
            const endHour = parseInt(end.split(':')[0], 10);
            const totalCost = (endHour - startHour) * data.Cost;
            IncomeCalc += totalCost;
            totalRes += 1;
            return {
              ...data,
              totalCost,
              id: doc.id
            };
          }
          return null;
        })
        .filter(Boolean); // Remove null values from the array
       // Remove null values from the array
    
        // Fetch all the expenses from db
        const expensesCollection = collection(db, 'expenses');
        const expensesSnapshot = await getDocs(expensesCollection);
        let totalExp = 0;
        expensesSnapshot.docs.forEach(doc => {
          const data = doc.data();
          const hallExpenses = data.expenses || [];
          hallExpenses.forEach(expense => {
            if (expense.date >= startOfMonth && expense.date <= endOfMonth) { // Check if the selected date is in the range 
              totalExp += parseFloat(expense.amount);
            }
          });
        });
    
        // Update state with the fetched data
        setReservations(reservationsData);
        setTotalExpenses(totalExp);
        setTotalIncome(IncomeCalc);
        setTotalReservations(totalRes);
      } catch (error) {
        console.error('Error while fetching data:', error);
      }
    };
    
    fetchExpenses();
  }, [selectedMonth, selectedYear]);
  

  return (
    <ScrollView style={styles.cont}>
      <Text style={styles.Title}>Pays</Text>
      <View style={styles.pickerCont}>
        <Picker
          selectedValue={selectedMonth}
          style={{  width: '40%',}}
          onValueChange={(itemValue) => setSelectedMonth(itemValue)}
        >
          {months.map((month, index) => (
            <Picker.Item label={month} value={index} key={index} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedYear}
          style={{  width: '40%',}}
          onValueChange={(itemValue) => setSelectedYear(itemValue)}
        >
          {[2024 ,2025 , 2026 ,2027 ,2028 ,2029, 2030 , 2031 ,2032 ,2033].map((year) => (
            <Picker.Item label={String(year)} value={year} key={year} />
          ))}
        </Picker>
      </View>

      <View style={styles.summaryCont}>
        <View style={styles.summaryCard}>
          <FontAwesome name="building" size={24} color="#00bfa5" />
          <Text style={styles.Text}>Total Halls: {totalReservations}</Text>
        </View>
        <View style={styles.summaryCard}>
          <FontAwesome name="dollar" size={24} color="#00bfa5" />
          <Text style={styles.Text}>Total Income: ${totalIncome.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryCard}>
          <FontAwesome name="money" size={24} color="#00bfa5" />
          <Text style={styles.Text}>Total Expenses: ${totalExpenses.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryCard}>
        <MaterialIcons name="attach-money" size={24} color={totalIncome.toFixed(2)-totalExpenses.toFixed(2) < 0 ? 'red' : 'green'} />
          <Text style={[
            styles.Text,
            { 
              color: totalIncome.toFixed(2)-totalExpenses.toFixed(2) < 0 ? 'red' : 'green', 
              fontSize: 18, 
              fontWeight: 'bold' 
            }
          ]}>
            Clean Income: ${totalIncome.toFixed(2)-totalExpenses.toFixed(2)}
          </Text>
          </View>

      </View>

      <View style={styles.resCont}>
        {reservations.map(reservation => (
          <View key={reservation.id} style={styles.reservationCard}>
            <Text style={styles.hallName}>{reservation.hallName}</Text>
            <Text style={styles.reserverName}>Reserved by: {reservation.Name}</Text>
            <Text style={styles.totalCost}>Total: ${reservation.totalCost.toFixed(2)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({

  cont: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 11,
  },

  Title: {
    fontSize: 25,
    textAlign: 'center',
    marginVertical: 19,
    fontWeight: 'bold',
    color: '#00bfa5',
  },

  pickerCont: {
    marginBottom: 21,
    backgroundColor: '#fff',
    padding: 11,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 11,
  },
 
  summaryCont: {
    padding: 16,
    borderRadius: 11,
    marginBottom: 21,
    backgroundColor: '#fff',
  
  },

  summaryCard: {
    flexDirection: 'row',
    marginBottom: 11,
    alignItems: 'center',
  },

  Text: {
    marginLeft: 11,
    fontSize: 17,
    color: '#333',
  },


  reservationCard: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 10,
  },

  totalCost: {
    fontSize: 17,
    color: '#777',
  },

  hallName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,

  },
  
  resCont: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 11,
  },

  reserverName: {
    fontSize: 17,
    color: '#555',
    marginBottom: 6,
  },
 
});

export default AdminPays;
