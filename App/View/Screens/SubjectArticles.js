/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Dimensions, Text, StyleSheet, View, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import PostInFeed from './PostInFeed';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { RefreshControl } from 'react-native';
import axios from 'axios'

dateToReadbleFormat = (date) => date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();

export default function SubjectArticles({ navigation }) {
  const [fullArticles, setFullArticles] = useState([]);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false)
  const baseURL = 'https://havruta.org.il/wp-json'
  let api = axios.create({ baseURL });

  function onAuthStateChanged(user) {
    setUser(user);
  }

  function refresh() {
    getArticlesFromWP()
  }


  function getArticlesDataFromFB(articles_from_wp) {
    let promises_fs = []
    articles_from_wp.forEach((val) => {
      let cur_promise = firestore().collection('article').doc(val.id).get();
      promises_fs.push(cur_promise);
    })
    Promise.all(promises_fs)
      .then(responses => {
        responses.forEach((val, i) => {
          if (val.data()) {
            articles_from_wp[i].likes = val.data().likes
            articles_from_wp[i].comments = val.data().comments
            articles_from_wp[i].lock = val.data().lock
            articles_from_wp[i].full = true
          } else {
            articles_from_wp[i].likes = []
            articles_from_wp[i].comments = []
            articles_from_wp[i].full = false
            articles_from_wp[i].lock = false
          }
        })
        setFullArticles(articles_from_wp)
        setLoading(false)
      })
      .catch(errors => {
        console.log(errors)
      })
  }

  /****================ wordpress async start here ==============*******/

  async function getArticlesFromWP() {
    let articles = await api.get('/wp/v2/posts?categories=388');
    let arr = [];
    for (let i = 0; i < articles.data.length; i++) {
      let obj = {
        id: articles.data[i].id + '',
        content: articles.data[i].content.rendered,
        short: articles.data[i].excerpt.rendered,
        date: dateToReadbleFormat(new Date(articles.data[i].date)),
        autor: articles.data[i].author,
        headline: articles.data[i].title.rendered,
      }
      arr.push(obj)
    }
    getArticlesDataFromFB(arr)
    return;
  };

  useEffect(() => {
    getArticlesFromWP()
  }, [])

  /*******===== async ends here =============*************** */

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    if (auth().currentUser) {
      firestore()
        .collection('users')
        .doc(auth().currentUser.email)
        .get().then(doc => {
          if (!doc) return;
          let userDetails = doc.data();
          setUser(userDetails);
        })
        .catch(err => {
          console.log(err)
        })
    }
    return subscriber;
  }, [setUser])


  return (
    <View style={styles.main}>
      <SafeAreaView style={{ flex: 0, backgroundColor: 'rgb(120,90,140)' }} />
      <SafeAreaView style={styles.main}>
        <View style={styles.header}>
          <View
            style={[styles.back_button, { backgroundColor: '#fffffff' }]}></View>
          <Text style={styles.screen_title}>Havruta</Text>
          <View
            style={[styles.back_button, { backgroundColor: '#fffffff' }]}
          >
            {loading ?
              <ActivityIndicator color={'black'} size={'small'} />
              : null
            }
          </View>
        </View>
        {
          fullArticles.length == 0 ?
            <ActivityIndicator style={{ marginTop: '30%' }} size={'large'} color={'#000'} />
            :
            <FlatList
              data={fullArticles}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={refresh}
                />
              }
              renderItem={({ item }) => (
                <PostInFeed
                  onPress={() => navigation.navigate('ArticleScreen', { data: item, user: user, idAdmin: user.role == 'admin' })}
                  data={item}
                  idAdmin={user.role == 'admin'}
                />
              )}
              keyExtractor={(item, idx) => idx}
            />
        }
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headline: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgb(0,127,255)',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    textAlign: 'center',
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

  screen_title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgb(255,255,255)',
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
