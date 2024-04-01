import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useRoute } from '@react-navigation/native';
import ButtomNavBar from '../component/ButtomNavBar';

const OptionsPage = () => {
    const Tab = createBottomTabNavigator();
    const route = useRoute();
    const  searchValue = route.params.search ; // Get the search value from route params

   

  return (
    <ButtomNavBar searchValue={searchValue} />
  )
}

export default OptionsPage