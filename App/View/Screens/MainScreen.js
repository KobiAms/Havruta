/* eslint-disable semi */
import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import IconIo from 'react-native-vector-icons/Ionicons';
import IconFA from 'react-native-vector-icons/FontAwesome';
import PostInMain from '../Components/PostInMain';



const strings = ['kobi', 'zohar', 'oded', 'alice', 'bensgi'];
const HebrewDate = `<div>
<script type="text/javascript" charset="utf-8"
        src="https://www.hebcal.com/etc/hdate-he.js"></script></div>`;

function MainScreen({ navigation, route }) {
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
        <Text>{hebrewDate}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ChatScreen')} style={styles.toScreen}>
          <IconIo name={'chatbubbles'} size={20} color={'#0d5794'} />
          <Text style={{ marginLeft: 10 }}>צ'אטים</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('EventsScreen')} style={styles.toScreen}>
          <IconFA name={'calendar'} size={20} color={'#0d5794'} />
          <Text style={{ marginLeft: 10 }}>אירועים</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={['head_list', ...category_1]}
        renderItem={({ item }) => item == 'head_list' ? <View style={{ height: 60 }} /> :
          <PostInMain data={item} onPress={() => console.log('wow you can really dance')} />
        }
        keyExtractor={(item, idx) => idx}
      />
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
    borderRadius: 20,
    borderColor: '#999',
    padding: 10,
    margin: 10,
    maxWidth: '27%',

  },
  header: {
    backgroundColor: '#fffd',
    position: 'absolute',
    top: 0,
    zIndex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%'
  }
});

export default MainScreen;
