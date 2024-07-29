import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useRoute } from '@react-navigation/native';
import ButtomNavBar from '../component/ButtomNavBar';

const OptionsPage = () => {
    const Tab = createBottomTabNavigator();
    const route = useRoute();
    const  searchValue = route.params.search ; // Get the search value from route params
    const filter = route.params.filter; // Get the filter from route params
    const sortOrder =route.params.sortOrder
   

  return (
    <ButtomNavBar searchValue={searchValue} filter={filter} sortOrder={sortOrder}/>
  )
}

export default OptionsPage