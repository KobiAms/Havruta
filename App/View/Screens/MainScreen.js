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
      <ScrollView style={styles.main}>
        <View style={{ height: 50 }} />
        <View style={styles.category_title_container}>
          <Text style={styles.category_title_text}>Category one</Text>
        </View>
        <FlatList
          data={category_1}
          horizontal={true}
          renderItem={({ item }) => (
            <PostInMain data={item} onPress={() => console.log('wow you can really dance')} />
          )}
          keyExtractor={(item, idx) => idx}
        />
        <View style={styles.category_title_container}>
          <Text style={styles.category_title_text}>Category Two</Text>
        </View>
        <FlatList
          data={category_2}
          horizontal={true}
          renderItem={({ item }) => (
            <View style={{ padding: 20, backgroundColor: 'gold', margin: 5, height: 300, width: 300 }}>

              <Text>{item}</Text>
            </View>
          )}
          keyExtractor={(item, idx) => idx}
        />
        <View style={styles.category_title_container}>
          <Text style={styles.category_title_text}>Category Three</Text>
        </View>
        <FlatList
          data={category_3}
          horizontal={true}
          renderItem={({ item }) => (
            <View style={{ padding: 20, backgroundColor: 'gold', margin: 5, height: 300, width: 300 }}>

              <Text>{item}</Text>
            </View>
          )}
          keyExtractor={(item, idx) => idx}
        />
        <View style={styles.category_title_container}>
          <Text style={styles.category_title_text}>Category four</Text>
        </View>
        <FlatList
          data={category_4}
          horizontal={true}
          renderItem={({ item }) => (
            <View style={{ padding: 20, backgroundColor: 'gold', margin: 5, height: 300, width: 300 }}>

              <Text>{item}</Text>
            </View>
          )}
          keyExtractor={(item, idx) => idx}
        />
        <View style={styles.category_title_container}>
          <Text style={styles.category_title_text}>Category five</Text>
        </View>
        <FlatList
          data={category_5}
          horizontal={true}
          renderItem={({ item }) => (
            <View style={{ padding: 20, backgroundColor: 'gold', margin: 5, height: 300, width: 300 }}>

              <Text>{item}</Text>
            </View>
          )}
          keyExtractor={(item, idx) => idx}
        />
      </ScrollView>
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  header: {
    backgroundColor: '#fffd',
    zIndex: 1,
    position: 'absolute',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%'
  }
});

export default MainScreen;
