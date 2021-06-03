/* eslint-disable semi */
import React from 'react';
import { SafeAreaView } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import HTMLView from 'react-native-htmlview';
import { useState, useEffect } from 'react';
import axios from 'axios'
import { useWindowDimensions } from 'react-native';
import { ActivityIndicator } from 'react-native';



function MainScreen({ navigation, route }) {

  // const [len, setLen] = useState(0);
  const [newser, setNewser] = useState([]);
  const [news, setNews] = useState();

  function Post() {
    // const [news, setNews] = useState();
    // const baseURL = 'https://havruta.org.il/wp-json'
    // let api = axios.create({ baseURL });

    // async function getArticles() {
    //   let articles = await api.get('/wp/v2/posts?categories=388');
    //   let arr = [];
    //   for (let i = 0; i < articles.data.length; i++) {
    //     let obj = {
    //       id: articles.data[i].id,
    //       content: articles.data[i].content.rendered,
    //       short: articles.data[i].excerpt.rendered,
    //       date: articles.data[i].date,
    //       autor: articles.data[i].author,
    //       headline: articles.data[i].title.rendered,
    //     }
    //     arr.push(obj)
    //   }
    //   setNews(arr);
    //   return;
    // };

    // useEffect(() => {
    //   getArticles()
    // }, [setNews])

    const contentwidth = useWindowDimensions().width;

    return (
      <View>
        {/* <TouchableOpacity onPress={() => console.log(news)}><Text>Alice</Text></TouchableOpacity>
        <HTMLView value={news} contentWidth={contentwidth} />
        <Text>{news}</Text> */}
        {/* <TouchableOpacity style={{ width: 100, height: 100, backgroundColor: '#0f5' }}
          onPress={console.log(news)}></TouchableOpacity> */}
      </View>
    )
  }


  return (
    <View style={styles.main}>
      <SafeAreaView style={{ flex: 0, backgroundColor: 'rgb(120,90,140)' }} />
      <SafeAreaView style={styles.main}>
        <View style={styles.header}>
          <View
            style={[styles.back_button, { backgroundColor: '#fffffff' }]}
          >
            {/* {!news ?
              <ActivityIndicator color={'black'} size={'large'} />
              : null
            } */}
          </View>
          <Text style={styles.screen_title}>Havruta</Text>
          <TouchableOpacity
            style={styles.register}
            onPress={() => navigation.navigate('Registration')}>
            <Icon name={'user-alt'} size={20} />
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          <Post />
        </View>
      </SafeAreaView>
    </View>
  );
};



const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    width: '100%',
    height: Dimensions.get('screen').height / 10,
    backgroundColor: 'rgb(120,90,140)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#999',
    borderBottomWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },
  body: {
    height: Dimensions.get('screen').height * (9 / 10),
    width: '100%',
    paddingTop: '10%',
    alignItems: 'center'
  },
  screen_title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgb(255,255,255)',
  },
  headline: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgb(0,127,255)',
  },
  register: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  back_button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MainScreen;
