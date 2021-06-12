/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
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
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconIo from 'react-native-vector-icons/Ionicons';
import IconFA from 'react-native-vector-icons/FontAwesome';
import IconMI from 'react-native-vector-icons/MaterialIcons';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import axios from 'axios'
import PostInMain from '../Components/PostInMain';
import MainPostInMain from '../Components/MainPostInMain';
import GenericFeed from './GenericFeed';

function MainScreen({ navigation, route }) {
  const [close, setClose] = useState(true);
  const [toSearch, setToSearch] = useState('');
  const [user, setUser] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [hebrewDate, setHebrewDate] = useState();
  const [posts, setPosts] = useState([])
  const baseURL = 'https://havruta.org.il/wp-json'
  let api = axios.create({ baseURL });
  let curCategory = 'חדשות'


  async function getHebrewDate() {
    const dateURL = `https://www.hebcal.com/etc/hdate-he.js`;
    const response = await fetch(dateURL);
    const htmlStr = await response.text();
    const date = htmlStr.substring(16, htmlStr.length - 4)
    setHebrewDate(date)
  }
  const categories = [
    { name: "חדשות", id: '394' },
    { name: 'אירועים', id: '394' },
    { name: 'מגזין א', id: '396' },
    { name: 'מגזין ב', id: '398' },
    { name: 'מגזין ג', id: '400' },
  ]
  const categories_test = [
    { name: "חדשות", id: '122' },
    { name: 'אירועים', id: '117' },
    { name: 'מגזין א', id: '122' },
    { name: 'מגזין ב', id: '117' },
    { name: 'מגזין ג', id: '122' },
  ]


  function getArticles() {
    setPosts(['loading', 'loading', 'loading', 'loading', 'loading', 'loading', 'loading', 'loading', 'loading'])
    api = axios.create({ baseURL });
    let promises = []
    categories_test.forEach(item => {
      promises.push(api.get('/wp/v2/posts?categories=' + item.id + '&per_page=5'))
    })
    Promise.all(promises)
      .then(res => {
        let posts_test = []
        res.forEach((articles, index) => {
          let arts_wp = [];
          for (let i = 0; i < articles.data.length; i++) {
            let obj = {
              id: articles.data[i].id + '',
              category: categories[index].name,
              content: articles.data[i].content.rendered,
              short: articles.data[i].excerpt.rendered,
              date: dateToReadbleFormat(new Date(articles.data[i].date)),
              autor: articles.data[i].author,
              headline: articles.data[i].title.rendered,
              image_link: articles.data[i]._links['wp:featuredmedia'] ? articles.data[i]._links['wp:featuredmedia'][0].href : undefined,
              category_id: categories_test[index].id,
            }
            arts_wp.push(obj)
          }
          posts_test = [...posts_test, ...arts_wp]
        })
        setPosts(posts_test)
      })
      .catch(console.log)
  }

  // listen to auth state and get the user data if is log-in
  function onAuthStateChanged(user_state) {
    setIsAdmin(false)
    setUser(undefined)
    if (user_state) {
      firestore().collection('users').doc(user_state.email).get()
        .then(doc => {
          if (!doc.data()) {
            return
          } else {
            const user_tmp = doc.data()
            setUser(user_tmp);
            setIsAdmin(user_tmp.role == 'admin')
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  useEffect(() => {
    getHebrewDate()
    getArticles()
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber
  }, [])

  function ChooseRenderItem({ item, index }) {
    let category_to_show = curCategory;
    if (curCategory != item.category) {
      curCategory = item.category
      category_to_show = item.category
    }
    if (item == 'loading') {
      if (index % 5 == 0) {
        return (
          <View>
            {index === 0 ? <View style={[styles.toScreen, { padding: 15, opacity: 0 }]} >
              <IconIo name={'ios-chatbox'} size={20} color={'#fff0'} />
            </View> : null}
            {index === 0 ? null :
              <View style={styles.category_title_warper}>
                <Text style={styles.category_title_text}>Category - {index % 5 + 1}</Text>
              </View>}
            <SkeletonContent
              containerStyle={styles.skeleton}
              layout={[
                { width: 100, height: Dimensions.get('screen').height * 0.02, marginBottom: 10, },
                { width: 200, height: Dimensions.get('screen').height * 0.04, marginBottom: 10, },
                { width: '100%', height: Dimensions.get('screen').height * 0.10, marginBottom: 10, },
                { width: "100%", height: Dimensions.get('screen').height * 0.04, }
              ]}
              isLoading={true}
              highlightColor={'#f3f3f4'}
              boneColor={'#dfdfdf'}>
            </SkeletonContent>
          </View >
        )
      }
      return (
        <View>
          <SkeletonContent
            containerStyle={styles.skeleton}
            layout={[
              { width: '30%', height: Dimensions.get('screen').height * 0.02, marginBottom: 10, },
              { width: "100%", height: Dimensions.get('screen').height * 0.04, }
            ]}
            isLoading={true}
            highlightColor={'#f3f3f4'}
            boneColor={'#dfdfdf'}>
          </SkeletonContent>
          {index == (posts.length - 1) ?
            <View style={{ height: 70, padding: 3 }} />
            : null
          }
        </View>
      )
    } else {
      if (index % 5 == 0) {
        return (
          <View>
            {index == 0 ? <View style={[styles.toScreen, { padding: 15, opacity: 0 }]} >
              <IconIo name={'ios-chatbox'} size={20} color={'#fff0'} />
            </View> : null}
            {!category_to_show ?
              null
              :
              <Pressable onPress={() => { navigation.navigate('GenericFeed', { category_id: item.category_id }) }}>
                <View style={styles.category_title_warper} >
                  <Text style={styles.category_title_text}>
                    {item.category}</Text>
                  <Text style={{ color: '#fff' }}>לכל הכתבות..</Text>
                </View>
              </Pressable>
            }
            <MainPostInMain
              onPress={(extraData) => navigation.navigate('ArticleScreen', { data: item, extraData: extraData, isAdmin: isAdmin })}
              data={item}
              isAdmin={auth().currentUser && user ? user.role == 'admin' : false}
            />
          </View >
        )
      }
      return (
        <View>
          <PostInMain
            onPress={(extraData) => navigation.navigate('ArticleScreen', { data: item, extraData: extraData, isAdmin: isAdmin })}
            data={item}
            isAdmin={auth().currentUser && user ? user.role == 'admin' : false}
          />
          {index == (posts.length - 1) ?
            <View style={{ height: 70, padding: 3 }} />
            : null
          }
        </View>
      )
    }

  }

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
            <IconIo name={'ios-chatbox'} size={20} color={'#0d5794'} />
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
              <IconMI color={'#0d5794'} size={20} name={'cancel'} />
            </TouchableOpacity>
        }
      </View>
      <FlatList
        data={posts}
        renderItem={ChooseRenderItem}
        style={{ flex: 1 }}
        keyExtractor={(item, index) => index}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  category_title_warper: {
    alignItems: 'flex-end',
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    padding: 5,
    margin: 5,
    minWidth: '97%',
    backgroundColor: '#0d5794',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category_title_text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
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
    position: 'absolute',
    top: 5,
    margin: 5,
    zIndex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '97%',
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

export default MainScreen;
