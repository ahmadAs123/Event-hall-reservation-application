import React, { useState } from 'react';
import { StyleSheet, Alert, View } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import IoniconsIcon from 'react-native-vector-icons/Ionicons'; 
import { SearchBar, Icon } from 'react-native-elements';
import LoadingPage from './LoadingPage';

  const SearchField = () => {
    const [focused, setFocused] = useState(false);
    const [search, setSearch] = useState('');
    const navigation=useNavigation()
    const [loading, setLoading] = useState(false); 


    const SearchFunction = async () => {
      
      navigation.navigate('OptionsPage', {search});
    };
  
    return (
      <View style={styles.container}>
        <SearchBar
          placeholder="Search..."
          onChangeText={(text) => setSearch(text)}
          inputContainerStyle={styles.input}
          value={search}
          placeholderTextColor="gray"
          containerStyle={[styles.search]}
          inputStyle={styles.inputText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {focused ? (
          <Icon
            name="search"
            type="Feather"
            size={30}
            containerStyle={styles.iconContainer}
            color="black"
            onPress={SearchFunction} 
          />
        ) : null}
  
        {!focused ? (
          <IoniconsIcon
            name="filter-circle-outline"
            size={30}
            color="#f0fff0"
            style={styles.Filltericon}
            onPress={() => {
              console.log('Filter icon pressed');
            }}
          />
        ) : null}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      bottom: 11,
      backgroundColor:"#00e4d4",
      height:69,
      
    },
    inputText: {
      color: 'black',
    },
  
    iconContainer: {
      right: 10,
      top: -36,
      marginLeft: 363,
      width: 30,
      height: 30,
    },
  
    search: {
      backgroundColor: 'transparent',
      borderBottomColor: 'transparent',
      borderTopColor: 'transparent',
    },
  
    Filltericon: {
      marginLeft: 352,
      top: -39,
      left:4
    },
  
    input: {
      width: 340,
      height: 42,
      borderRadius: 20,
      borderWidth: 2,
      backgroundColor: 'white',
      borderBottomWidth: 2,
      borderColor: 'white',
      top:7,
      left:3

    },
  });
  
  export default SearchField;