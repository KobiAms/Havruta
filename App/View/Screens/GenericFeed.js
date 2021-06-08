/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Dimensions, Text, StyleSheet, View, SafeAreaView } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import PostInFeed from './PostInFeed';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { RefreshControl } from 'react-native';
import axios from 'axios'
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import { useCallback } from 'react';

// function to parse date object to required format: dd.mm.yyyy
dateToReadbleFormat = (date) => date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();

/* -----------------------------------------------------
* this function return the GenericFeed components that disaply an
* array of articles that received from wordpress spesific request
* and request the relevant data (if exsists) from firestore
**/// ---------------------------------------------------
export default function GenericFeed({ navigation, route }) {
  // set the category to the required category.
  // if the component called from the tab_navigator
  // set the category manully
  let category_id;
  if (route.name == 'Community') {
    category_id = '122'
  } else if (route.name == 'Judaism') {
    category_id = '117'
  } else {
    if (!route.params || !route.params.category_id)
      return new Error('GenericFeed: category_id must received by the route')
    category_id = route.params.category_id;
  }

  // attribute to hold the articles with the data from FB
  const [fullArticles, setFullArticles] = useState([, , , ,]);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true)
  const baseURL = 'https://havruta.org.il/wp-json'
  let api = axios.create({ baseURL });

  /**function to get articles from wordpress */
  async function getArticlesFromWP() {
    let articles = await api.get('/wp/v2/posts?categories=' + category_id);
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

  // function to gets the data of the articles from firebase 
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
            articles_from_wp[i].new_post = false
          } else {
            articles_from_wp[i].likes = []
            articles_from_wp[i].comments = []
            articles_from_wp[i].full = false
            articles_from_wp[i].lock = true
            articles_from_wp[i].new_post = true
          }
        })
        setFullArticles(articles_from_wp)
        setLoading(false)
      })
      .catch(errors => {
        console.log(errors)
      })
  }

  // listen to auth state 
  function onAuthStateChanged(user) {
    setUser(user);
  }

  /**this useEffect get all the articles from wp and then from fb */
  useEffect(() => {
    getArticlesFromWP()
  }, [])

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
        .catch(err => console.log(err))
    }
    return subscriber;
  }, [setUser]);

  const [refreshing, setRefreshing] = useState(false);
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getArticlesFromWP()
    wait(2000).then(() => setRefreshing(false));
  }, []);


  return (
    <View style={styles.main}>
      <SafeAreaView style={{ flex: 0, backgroundColor: '#0d5794' }} />
      <SafeAreaView style={styles.main}>
        {loading ?
          <FlatList
            data={fullArticles}
            renderItem={({ item }) => (
              <SkeletonContent
                containerStyle={styles.skeleton}
                layout={[
                  {
                    width: 100,
                    height: Dimensions.get('screen').height * 0.02,
                    marginBottom: 10,
                  },
                  {
                    width: 200,
                    height: Dimensions.get('screen').height * 0.04,
                    marginBottom: 10,
                  },
                  {
                    width: '100%',
                    height: Dimensions.get('screen').height * 0.10,
                    marginBottom: 10,
                  },
                  {
                    width: "100%",
                    height: Dimensions.get('screen').height * 0.04,
                  }
                ]}
                isLoading={loading}>
              </SkeletonContent>
            )}
            keyExtractor={(item, idx) => idx}
          />
          :
          <FlatList
            data={fullArticles}
            scrollIndicatorInsets={{ right: 1 }}
            refreshControl={
              <RefreshControl
                enabled={true}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            renderItem={({ item }) => (
              <PostInFeed
                onPress={(postLock) => navigation.navigate('ArticleScreen', { data: item, user: user, idAdmin: auth().currentUser ? user.role == 'admin' : false, lock: postLock })}
                data={item}
                isAdmin={auth().currentUser ? user.role == 'admin' : false}
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
    backgroundColor: '#f0fbff',
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
  skeleton: {
    margin: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
    minWidth: '97%',
    padding: 20,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 3.27,
    elevation: 5,
  }
});
