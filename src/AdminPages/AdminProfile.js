import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native';


const handleLogout = async () => {
 alert("Profile Page")
};


const AdminProfile = () => {
  return (
    <View style={styles.container}>
    <View style={styles.boxcontainer}>
    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
    <Text style={styles.logoutButtonText}>Profile</Text>
  </TouchableOpacity>
  </View>
  </View>
  )
}


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


export default AdminProfile


