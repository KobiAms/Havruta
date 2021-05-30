/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useCallback, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LogBox,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icons from 'react-native-vector-icons/Ionicons';
import IconFAW5 from 'react-native-vector-icons/FontAwesome5';
import { Avatar } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import { SafeAreaView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';


function timePassParser(time) {
  let now = new Date();
  let diff = now - ((7200 + time) * 1000);
  if (diff < 0) return ('a while ago');
  if (diff < 1000) return (parseInt(diff) + ' milliseconds ago');
  diff /= 1000;
  if (diff < 60) return (parseInt(diff) + ' seconds ago');
  diff /= 60;
  if (diff < 60) return (parseInt(diff) + ' minutes ago');
  diff /= 60;
  if (diff < 24) return (parseInt(diff) + ' hours ago');
  diff /= 24;
  if (diff < 30) return (parseInt(diff) + ' days ago');
  diff /= 30;
  if (diff < 12) return (parseInt(diff) + ' months ago');
  diff /= 12;
  return (parseInt(diff) + ' years ago');
}

function ArticleScreen({ navigation, route }) {
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []); //enable to render a flatlist inside a scrollview
  const [data, setData] = useState(route.params.data)
  const [isLiked, setIsLiked] = useState(auth().currentUser ? route.params.data.likes.includes(auth().currentUser.email) : false)
  const [comInput, setcomInput] = useState();

  updateLikes = () => {
    if (auth().currentUser) {
      if (isLiked) {
        firestore().collection('article').doc(data.art_id).update({
          likes: firestore.FieldValue.arrayRemove(auth().currentUser.email)
        }).then(() => {
          setData(prev => {
            var index = prev.likes.indexOf(auth().currentUser.email);
            if (index !== -1)
              prev.likes.splice(index, 1);
            return prev;
          })
          setIsLiked(false)
        })
          .catch(() => {
            console.log('unlike failed')
          })
      } else {
        firestore().collection('article').doc(data.art_id).update({
          likes: firestore.FieldValue.arrayUnion(auth().currentUser.email)
        }).then(() => {
          setData(prev => {
            prev.likes.push(auth().currentUser.email)
            return prev;
          })
          setIsLiked(true)
        })
          .catch(() => {
            console.log('like failed')
          })
      }
    }
  }

  addComment = () => {
    if (comInput.length < 5)
      return
    console.log('addComment')
    if (auth().currentUser) {
      console.log(data.art_id)
      let new_comment = {
        comment: comInput,
        user_id: auth().currentUser.email,
        user_name: auth().currentUser.displayName,
        timestamp: firestore.Timestamp.fromDate(new Date())
      }
      console.log('addComment to firestore')
      firestore().collection('article').doc(data.art_id).update({
        comments: firestore.FieldValue.arrayUnion(new_comment),
      }).then(() => {
        setData(prev => {
          console.log('addComment to firestore success')
          prev.comments.push(new_comment);
          return prev;
        })
        setcomInput('')
      })
        .catch(() => {
          console.log('addComment failed')
        })
    }
  }



  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: 'rgb(120,90,140)' }} />
      <View style={{ flex: 1, backgroundColor: 'rgb(220,220,240)' }}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.back_button}
            onPress={() => navigation.goBack()}>
            <IconFAW5 name={'arrow-left'} size={20} />
          </TouchableOpacity>
          <Text style={styles.screen_title}>Havruta</Text>
          <View
            style={[styles.back_button, { backgroundColor: 'rgba(0,0,0)' }]}></View>
        </View>
        <ScrollView style={styles.main}>
          <View
            style={[styles.row, { padding: 10 }]} /** user info - icon, name and date of publish */>
            <View>
              <Text style={styles.autor}>{data.autor}</Text>
              <Text>{data.date}</Text>
              <Text style={styles.headline}>
                {data.headline}
                {'\n'}
              </Text>
              <Text>{data.contant}</Text>
            </View>
          </View>
          <View style={styles.line} />
          <View
            style={[styles.response, { padding: 5 }]} /** displays the amount of likes and comments */
          >
            <TouchableOpacity style={styles.row} onPress={() => updateLikes()}>
              <Icon name={isLiked ? 'dislike1' : 'like1'} size={20} style={styles.pad} color={isLiked ? 'rgb(120,90,140)' : '#000'} />
              <Text style={{ color: isLiked ? 'rgb(120,90,140)' : '#000' }}>likes: {data.likes.length}</Text>
            </TouchableOpacity>
            <Text>comments: {data.comments ? data.comments.length : 0}</Text>
          </View>
          <View style={styles.rower} /** text input to add new comment */>
            <AutoGrowingTextInput
              placeholder={'Add your comment...'}
              style={styles.input}
              onChangeText={setcomInput}
              onSubmitEd
              value={comInput}
            />
            <TouchableOpacity
              onPress={() => addComment()}>
              <Icons name={'send'} size={25} />
            </TouchableOpacity>
          </View>
          <FlatList
            style={{ padding: 5, paddingBottom: 30 }}
            data={route.params.data.comments.reverse()}
            renderItem={({ item }) => (
              <View style={styles.combox}>
                <Avatar
                  size="small"
                  rounded
                  title={item.user_name ? item.user_name[0] : 'M'}
                  // source={}
                  containerStyle={{ backgroundColor: 'rgb(140,150,180)' }}
                  onPress={() => { console.log(item.user_name) }}
                />
                <View style={styles.comment}>
                  <View>
                    <Text style={styles.autor}>{item.user_name ? item.user_name : 'man with no name'}</Text>
                    <Text>{item.comment}</Text>
                  </View>
                  <View>
                    <Text>{timePassParser(item.timestamp.seconds)}</Text>
                  </View>
                </View>
              </View>
            )}
            keyExtractor={(item, idx) => idx}
          />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignSelf: 'center',
    backgroundColor: 'rgb(220,220,240)',
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
  headline: {
    fontSize: 22,
    alignItems: 'flex-end',
    fontWeight: 'bold',
  },
  autor: {
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
  },
  response: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pad: {
    paddingRight: 5,
  },
  input: {
    width: '85%',
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 6,
    padding: 7
  },
  rower: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  comment: {
    backgroundColor: 'rgb(210,210,230)',
    width: '87%',
    margin: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  combox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'rgb(200,200,220)',
    borderRadius: 21,
    paddingVertical: 5,
    margin: 5,
  },
  line: {
    height: 1,
    margin: 10,
    backgroundColor: '#000000',
  },
});

export default ArticleScreen;
