/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import IconIo from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import HTMLRend from 'react-native-render-html';
import firestore from '@react-native-firebase/firestore'

/**A component that display a short content on an article */
function PostInFeed({ onPress, data, isAdmin }) {
  const postData = data
  const [postLock, setPostLock] = useState(data.lock)
  const [newPost, setNewPost] = useState(data.new_post)
  const [postFull, setPostFull] = useState(data.full)
  const isLiked = auth().currentUser ? data.likes.includes(auth().currentUser.email) : false

  /**by any means, if the admin does not want to users to like and comment a post, he can lock it */
  function lock_post() {
    if (newPost) {
      firestore().collection('article').doc(postData.id).set({
        comments: [],
        likes: [],
        lock: false
      }).then(() => {
        setPostLock(false)
        setPostFull(true)
        setNewPost(false)
      })
        .catch(err => { alert('Initialise failed:\n' + err.code) })
    } else if (postLock) {
      firestore().collection('article').doc(postData.id).update({ lock: false })
        .then(() => setPostLock(false)).catch(err => alert('Unlock failed:\n' + err.code))
    } else {
      firestore().collection('article').doc(postData.id).update({ lock: true }).
        then(() => setPostLock(true)).catch(err => alert('Lock failed:\n' + err.code))
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => onPress(postLock)} data={postData}>
      <View style={styles.main}>
        <View style={styles.row}>
          <View>
            <Text>{postData.date}</Text>
          </View>
          {
            isAdmin ?
              <TouchableOpacity onPress={() => lock_post()}>
                {newPost ?
                  <IconIo name={'add-circle'} color={'#0d5794'} size={20} />
                  :
                  <IconIo name={postLock ? 'ios-lock-closed-outline' : 'ios-lock-open-outline'} color={postLock ? '#e55a5a' : '#5ba92c'} size={20} />
                }
              </TouchableOpacity>
              :
              null
          }
        </View>
        <HTMLRend
          source={{ html: postData.headline }}
          contentWidth={Dimensions.get('window').width}
          baseFontStyle={{
            fontSize: 22,
            alignItems: 'flex-end',
            fontWeight: 'bold',
            textAlign: 'right',
            color: '#333'
          }}
        ></HTMLRend>
        <HTMLRend
          source={{ html: postData.short }}
          contentWidth={Dimensions.get('window').width}
          baseFontStyle={{
            textAlign: 'right', color: '#333'
          }}
        ></HTMLRend>
        {
          postFull ?
            <View>
              <View style={styles.line} />
              <View style={styles.response}>
                <View style={styles.row}>
                  <Icon name={'like1'} size={20} style={styles.pad} color={isLiked ? '#2e98c5' : '#333'} />
                  <Text style={{ color: isLiked ? '#2e98c5' : '#333' }}>likes: {postData.likes.length}</Text>
                </View>
                <Text style={{ color: '#333' }} >
                  comments: {postData.comments ? postData.comments.length : 0}
                </Text>
              </View>
            </View>
            : null
        }
      </View>
    </TouchableWithoutFeedback >
  );
}

const styles = StyleSheet.create({
  main: {
    borderRadius: 5,
    alignSelf: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 10,
    margin: 5,
    flex: 1,
    minWidth: '97%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 3.27,
    elevation: 5,
  },
  headline: {
    fontSize: 22,
    alignItems: 'flex-end',
    fontWeight: 'bold',
    color: '#333'
  },
  autor: {
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  response: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pad: {
    paddingRight: 5,
  },
  line: {
    height: 1,
    margin: 10,
    marginBottom: 17,
    backgroundColor: '#cfcfcf',
  },
});
export default PostInFeed;