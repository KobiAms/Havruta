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
  // console.log(route.params)
  let category_id;
  if (route.params && route.params.toSearch) {
    // console.log('toSearch')
    category_id = 'search=' + route.params.toSearch
  } else {
    // console.log('by category')
    if (route.name == 'Community') {
      category_id = 'categories=122'
    } else if (route.name == 'Judaism') {
      category_id = 'categories=117'
    } else {
      if (!route.params || !route.params.category_id)
        return new Error('GenericFeed: category_id must received by the route')
      category_id = route.params.category_id;
    }
  }
  // set the category to the required category.
  // if the component called from the tab_navigator
  // set the category manully


  // attribute to hold the articles with the data from FB
  const [fullArticles, setFullArticles] = useState([, , , ,]);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true)
  const baseURL = 'https://havruta.org.il/wp-json'
  let api = axios.create({ baseURL });

  /**function to get articles from wordpress */
  async function getArticlesFromWP() {
    let articles = await api.get('/wp/v2/posts?' + category_id);
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
      <SafeAreaView style={{ flex: 0, backgroundColor: 'rgb(120,90,140)' }} />
      <View style={styles.main}>
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
            data={[...fullArticles, 'end_list']}
            scrollIndicatorInsets={{ right: 1 }}
            onEndReached={() => { console.log('list ended'); }}
            refreshControl={
              <RefreshControl
                enabled={true}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            renderItem={({ item }) => item == 'end_list' ?
              <View style={{ height: 40, width: '100%' }}></View>
              :
              <PostInFeed
                onPress={(postLock) => navigation.navigate('ArticleScreen', { data: item, user: user, idAdmin: auth().currentUser ? user.role == 'admin' : false, lock: postLock })}
                data={item}
                isAdmin={auth().currentUser ? user.role == 'admin' : false}
              />
            }
            keyExtractor={(item, idx) => idx}
          />
        }
      </View>
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
  skeleton: {
    margin: 5,
    borderRadius: 5,
    backgroundColor: 'rgb(220,220,240)',
    minWidth: '97%',
    padding: 20,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 3.27,
    elevation: 10,
  }
});
