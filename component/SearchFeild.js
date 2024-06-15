import React, { useState } from 'react';
import { StyleSheet, Alert, View, Text, ScrollView ,TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons'; 
import { SearchBar, Icon } from 'react-native-elements';
import LoadingPage from './LoadingPage';
import Modal from 'react-native-modal';
import { IconButton, Divider, Button,Checkbox } from 'react-native-paper';

const SearchField = () => {
  const [focused, setFocused] = useState(false);
  const [search, setSearch] = useState('');
  const navigation=useNavigation()
  const [loading, setLoading] = useState(false); 
  const [ModVis, setModVis] = useState(false);
  const [filter, setFilter] = useState({
    cost: false,
    distance: false,
    capacity: false,
    rating: false,
  });


  const SearchFunction = async () => {
    
    navigation.navigate('OptionsPage', {search});
  };

  const resetFilter = () => { //function to reset the choosen fillter item
    setFilter({
      rating: false,
      cost: false,
      distance: false,
      capacity: false,
    });
  };


  const runModal = () => {
    setModVis(!ModVis);
  };

  const ApplyFil = () => { // function to apply the modal after fillter
    console.log('Applied filters:', filter);
    runModal();
  };

  
  const handleChange = (filter) => { //function to make sure that there is more options to choose
    setFilter(prevFilters => ({
      ...prevFilters,
      [filter]: !prevFilters[filter],
    }));
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
        onSubmitEditing={SearchFunction} // Handle search on keyboard submit

      />
      {focused ? ( //the sarch pressed 
        <Icon
          name="search"
          type="Feather"
          size={30}
          containerStyle={styles.iconContainer}
          color="black"
          onPress={SearchFunction}

        />
      ) : null}

      {!focused ? ( //the fillter pressed 
        <IoniconsIcon
          name="filter-circle-outline"
          size={30}
          color="#f0fff0"
          style={styles.Filltericon}
          onPress={runModal}
        />
      ) : null}

      <Modal //modal that shows the fillter options
        isVisible={ModVis}
        onBackdropPress={runModal}
        style={styles.mod}>
        <View style={styles.modCont}>
          <View style={styles.modHead}>
          <Text style={{ fontSize: 19, fontWeight: 'bold'}}>Filtering  By</Text>
          <TouchableOpacity onPress={resetFilter} > 
            <Text style={{ marginRight:1 ,fontSize:17,color:"blue", textDecorationLine: 'underline'}}>reset </Text>
             </TouchableOpacity>

      
          </View> 
          <Divider style={{  marginVertical: 10,}} /> 
          <ScrollView style={{    width: '100%'}}>
            {Object.keys(filter).map((key) => ( // /*check box to check what was chooesd*/
              <View key={key} style={styles.boxCont}> 
                <Checkbox
                  status={filter[key] ? 'checked' : 'unchecked'}
                  onPress={() => handleChange(key)}
                  color="#00e4d4"
                />
                <Text style={{ marginLeft: 9,fontSize: 17,}}>
                {key.charAt(0).toUpperCase() + key.slice(1)}</Text>
              </View>
            ))}
          </ScrollView>
          <Divider style={{ marginVertical: 10}} />
        
          <Button mode="contained" onPress={ApplyFil} style={styles.applyButt}> 
           
            <Text style={{fontWeight:"bold" ,fontSize:17}}> Apply  </Text>
          </Button> 
        </View>
      </Modal>
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

  mod: {
  alignItems: 'center',
  justifyContent: 'center',
  },


  boxCont: {
    flexDirection: 'row',
   alignItems: 'center',
    marginVertical: 8,
  },

  modCont: {
    backgroundColor: 'white',
   maxHeight: '62%',
  padding: 21,
    width: '82%',
  borderRadius: 11,
  },

  modHead: {
    justifyContent: 'space-between',
  alignItems: 'center',
    flexDirection: 'row',
  },
  
  
  applyButt: {
   marginTop: 13,
    backgroundColor: '#00e4d8',
  },
});

export default SearchField;
