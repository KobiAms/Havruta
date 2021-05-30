/* eslint-disable semi */
import React from 'react';
import { SafeAreaView } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import HTMLView from 'react-native-htmlview';
import { useState, useEffect } from 'react';
import axios from 'axios'
import { useWindowDimensions } from 'react-native';
import { ActivityIndicator } from 'react-native';

let baseURL = 'https://havruta.org.il/wp-json'

function MainScreen({ navigation, route }) {
  const [news, setNews] = useState('');

  function Post() {
    let api = axios.create({ baseURL });
    getArticles = async () => {
      let articles = await api.get('/wp/v2/posts?categories=388');
      // console.log(articles.data[0].id)
      // console.log(articles.data[0].excerpt.rendered)
      setNews(articles.data[0].content.rendered);
      // console.log(articles.data[0].content.rendered);
    }

    useEffect(() => {
      getArticles();
    }, [])

    const contentwidth = useWindowDimensions().width;

    return (
      <View>
        <Text>Alice</Text>
        <HTMLView value={news} contentWidth={contentwidth} />
      </View>
    )
  }


  return (
    <View style={styles.main}>
      <SafeAreaView style={{ flex: 0, backgroundColor: 'rgb(120,90,140)' }} />
      <SafeAreaView style={styles.main}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.register}
            onPress={() => navigation.navigate('Registration')}>
            <Icon name={'user-alt'} size={20} />
          </TouchableOpacity>
          <Text style={styles.screen_title}>Havruta</Text>
          <View
            style={[styles.back_button, { backgroundColor: '#fffffff' }]}
          >
            {!news ?
              <ActivityIndicator color={'black'} size={'large'} />
              : null
            }
          </View>
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
