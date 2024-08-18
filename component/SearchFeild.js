import React, { useState } from 'react';
import { StyleSheet, Alert, View, Text, TouchableOpacity, FlatList, Dimensions,ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons'; 
import { SearchBar, Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import { IconButton, Divider, Button, Checkbox } from 'react-native-paper';

const { width } = Dimensions.get('window');

const cities = [
  'Jerusalem', 'Tel Aviv', 'Haifa', 'Beersheba', 'Netanya',
  'Rishon LeZion', 'Petah Tikva', 'Ashdod', 'Holon', 'Bnei Brak',
  'Bat Yam', 'Kfar Saba', 'Ra\'anana', 'Herzliya', 'Nahariya',
  'Safed', 'Tiberias', 'Eilat', 'Akko (Acre)', 'Kiryat Shmona',
  'Jaffa', 'Modi\'in-Maccabim-Re\'ut', 'Hadera', 'Or Akiva',
  'Arad', 'Be\'er Sheva', 'Ramat Gan', 'Ramat Hasharon', 'Zichron Yaakov',
  'Kiryat Yam', 'Kiryat Motzkin', 'Kiryat Ata', 'Yavne', 'Lod',
  'Ramla', 'Elad', 'Givatayim', 'Giv\'at Shmuel', 'Baqa al-Gharbiyye',
  'Tira'
]

const SearchField = () => {
  const [focused, setFocused] = useState(false);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [ModVis, setModVis] = useState(false);
  const [filter, setFilter] = useState({
    cost: false,
    capacity: false,
    rating: false,
  });

  const [sortOrder, setSortOrder] = useState({
    cost: 'asc',
    capacity: 'asc',
    rating: 'asc',
  });

  const SearchFunction = async () => {
    if (search.trim() === '') { 
      Alert.alert('Please enter a search term!');
      return;
    }
    navigation.navigate('OptionsPage', { search, filter, sortOrder });
  };

  const resetFilter = () => {
    setFilter({
      rating: false,
      cost: false,
      capacity: false,
    });
  };

  const runModal = () => {
    setModVis(!ModVis);
  };

  const closeFunc = () => {
    runModal();
  };

  const select_SortOrder = (criteria) => {
    setSortOrder(prevOrder => ({
      ...prevOrder,
      [criteria]: prevOrder[criteria] === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleChange = (filter) => {
    setFilter(prevFilters => {
      const updatedFilters = { ...prevFilters };
      Object.keys(updatedFilters).forEach(key => {
        updatedFilters[key] = false;
      });
      updatedFilters[filter] = true;
      return updatedFilters;
    });
  };

  const handleSearchChange = (text) => {
    setSearch(text);
    if (text) {
      const filteredCities = cities.filter(city => city.toLowerCase().includes(text.toLowerCase()));
      setSuggestions(filteredCities);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectCity = (city) => {
    setSearch(city);
    setSuggestions([]);
    setSelectedCity(city); // Optionally, use this to handle selected city
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search..."
        onChangeText={handleSearchChange}
        inputContainerStyle={styles.input}
        value={search}
        placeholderTextColor="gray"
        containerStyle={styles.search}
        inputStyle={styles.inputText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onSubmitEditing={SearchFunction}
        clearIcon={null}
      />
      <Icon
        name="search"
        type="Feather"
        size={30}
        containerStyle={styles.iconContainer}
        color="black"
        onPress={SearchFunction}
      />
      <IoniconsIcon
        name="filter-circle-outline"
        size={30}
        color="black"
        style={styles.Filltericon}
        onPress={runModal}
      />
      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectCity(item)} style={styles.suggestionItem}>
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      <Modal
        isVisible={ModVis}
        onBackdropPress={runModal}
        style={styles.mod}>
        <View style={styles.modCont}>
          <View style={styles.modHead}>
            <Text style={{ fontSize: 19, fontWeight: 'bold'}}>Sorting By</Text>
            <TouchableOpacity onPress={resetFilter}> 
              <Text style={{ marginRight:1 ,fontSize:17,color:"blue", textDecorationLine: 'underline'}}>reset </Text>
            </TouchableOpacity>
          </View> 
          <Divider style={{ marginVertical: 10 }} /> 
          <ScrollView style={{ width: '100%' }}>
            {Object.keys(filter).map((key) => (
              <View key={key} style={styles.boxCont}> 
                <Checkbox
                  status={filter[key] ? 'checked' : 'unchecked'}
                  onPress={() => handleChange(key)}
                  color="#00e4d4"
                />
                <Text style={{ marginLeft: 9, fontSize: 17 }}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Text>
                <IconButton
                  icon={sortOrder[key] === 'asc' ? "sort-ascending" : "sort-descending"}
                  size={20}
                  onPress={() => select_SortOrder(key)}
                />
              </View>
            ))}
          </ScrollView>
          <Divider style={{ marginVertical: 10 }} />
          <Button mode="contained" onPress={closeFunc} style={styles.applyButt}> 
            <Text style={{ fontWeight:"bold", fontSize: 17 }}> close </Text>
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
    height: 69,
    width: width,
    position: 'relative',
  },
  inputText: {
    color: 'black',
  },
  iconContainer: {
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
    top: -66,
    right: 30
  },
  input: {
    width: 350,
    height: 43,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: 'white',
    borderBottomWidth: 2,
    borderColor: 'white',
    top: 7,
    left: 1
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
  suggestionsContainer: {
    position: 'absolute',
    top: 60, 
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5, 
    zIndex: 1000, 
    maxHeight: 200, 
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  suggestionText: {
    fontSize: 16,
  },
});

export default SearchField;
