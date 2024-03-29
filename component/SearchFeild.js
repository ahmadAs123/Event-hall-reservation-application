import React, { useState } from 'react';
import { StyleSheet, Alert, View } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import IoniconsIcon from 'react-native-vector-icons/Ionicons'; 
import { SearchBar, Icon } from 'react-native-elements';


  const SearchField = () => {
    const [focused, setFocused] = useState(false);
    const [search, setSearch] = useState('');
    const navigation=useNavigation()

    const SearchFunction = () => {
      navigation.navigate('OptionsPage');
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
            size={28}
            containerStyle={styles.iconContainer}
            color="black"
            onPress={SearchFunction} 
          />
        ) : null}
  
        {!focused ? (
          <IoniconsIcon
            name="filter-circle-outline"
            size={30}
            color="black"
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
      paddingHorizontal: 10,
      bottom: 4,
    },
    inputText: {
      color: 'black',
    },
  
    iconContainer: {
      right: 10,
      top: -47,
      marginLeft: 352,
      width: 30,
      height: 30,
    },
  
    search: {
      backgroundColor: 'transparent',
      borderBottomColor: 'transparent',
      borderTopColor: 'transparent',
    },
  
    Filltericon: {
      marginLeft: 342,
      top: -49,
    },
  
    input: {
      width: 330,
      height: 45,
      borderRadius: 23,
      borderWidth: 2,
      backgroundColor: 'white',
      borderBottomWidth: 2,
      borderColor: 'gray',
    },
  });
  
  export default SearchField;