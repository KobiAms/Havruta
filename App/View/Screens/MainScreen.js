/* eslint-disable semi */
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconIo from 'react-native-vector-icons/Ionicons';
import IconFA from 'react-native-vector-icons/FontAwesome';
import PostInMain from '../Components/PostInMain';
import GenericFeed from './GenericFeed';



const strings = ['kobi', 'zohar', 'oded', 'alice', 'bensgi'];
const HebrewDate = `<div>
<script type="text/javascript" charset="utf-8"
        src="https://www.hebcal.com/etc/hdate-he.js"></script></div>`;

function MainScreen({ navigation, route }) {
  const [close, setClose] = useState(true);
  const [toSearch, setToSearch] = useState('');
  const [category_1, setCategory_1] = useState([...strings, ...strings])
  const [category_2, setCategory_2] = useState([...strings, ...strings])
  const [category_3, setCategory_3] = useState([...strings, ...strings])
  const [category_4, setCategory_4] = useState([...strings, ...strings])
  const [category_5, setCategory_5] = useState([...strings, ...strings])
  const [hebrewDate, setHebrewDate] = useState();
  async function getHebrewDate() {
    const dateURL = `https://www.hebcal.com/etc/hdate-he.js`;
    const response = await fetch(dateURL);
    const htmlStr = await response.text();
    const date = htmlStr.substring(16, htmlStr.length - 4)
    setHebrewDate(date)
  }
  useEffect(() => {
    getHebrewDate()
  }, [])

  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.toScreen} onPress={() => toSearch.length == 0 ? setClose(false) : navigation.navigate('GenericFeed', { toSearch: toSearch })}>
          <Icon color={'#0d5794'} size={20} name={'search'} />
          {
            close ?
              <Text style={{ marginLeft: 10, color: '#0d5794' }}>חיפוש</Text>
              : null
          }
        </TouchableOpacity>
        {close ?
          <TouchableOpacity onPress={() => navigation.navigate('ChatScreen')} style={styles.toScreen}>
            <IconIo name={'chatbubbles'} size={20} color={'#0d5794'} />
            <Text style={{ marginLeft: 10, color: '#0d5794' }}>צ'אטים</Text>
          </TouchableOpacity>
          :
          <TextInput
            value={toSearch}
            onChangeText={setToSearch}
            placeholder={'חפש חברותא...'}
            placeholderTextColor={'#aaa'}
            returnKeyType={'search'}
            style={styles.stack_search}
            autoFocus={true}
            onSubmitEditing={() => toSearch.length == 0 ? setClose(true) : navigation.navigate('GenericFeed', { toSearch: toSearch })}
          />
        }
        {
          close ?
            <TouchableOpacity onPress={() => navigation.navigate('EventsScreen')} style={styles.toScreen}>
              <IconFA name={'calendar'} size={20} color={'#0d5794'} />
              <Text style={{ marginLeft: 10, color: '#0d5794' }}>אירועים</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity style={{ padding: 10, marginLeft: 10, }} onPress={() => { setToSearch(''); setClose(true) }}>
              <IconIo color={'#0d5794'} size={20} name={'ios-chatbox'} />
            </TouchableOpacity>
        }
      </View>
      <GenericFeed route={{ params: { multipleCategories: '' } }} />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  category_title_container: {
    padding: 10,
    width: '100%',
  },
  category_title_text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0d5794'
  },
  toScreen: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: 20,
    borderColor: '#999',
    padding: 10,
    margin: 10,
    maxWidth: '27%',

  },
  header: {
    backgroundColor: '#fffd',
    position: 'absolute',
    top: 5,
    zIndex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '95%',
    alignSelf: 'center',
    elevation: 5,
    borderRadius: 5,
    backgroundColor: '#f2f2f3',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  stack_search: {
    width: Dimensions.get('screen').width * 0.6,
    height: '100%',
    color: '#0d5794',
    textAlign: 'right'
  },
});

export default MainScreen;
