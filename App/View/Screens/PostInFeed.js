/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import IconIo from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import { TouchableWithoutFeedback } from 'react-native';
import HTMLRend from 'react-native-render-html';
import { Dimensions } from 'react-native';
import firestore from '@react-native-firebase/firestore'

function PostInFeed({ onPress, data, isAdmin }) {
  const [postData, setPostData] = useState(data)
  const [postLock, setPostLock] = useState(data.lock)
  const [newPost, setNewPost] = useState(data.new_post)
  const [postFull, setPostFull] = useState(data.full)
  const [isLiked, setIsLiked] = useState(auth().currentUser ? data.likes.includes(auth().currentUser.email) : false)

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
        .catch(err => {
          alert('Initialise failed:\n' + err.code)
        })
    } else if (postLock) {
      firestore().collection('article').doc(postData.id).update({
        lock: false
      }).then(() => {
        setPostLock(false)
      })
        .catch(err => {
          alert('Unlock failed:\n' + err.code)
        })
    } else {
      firestore().collection('article').doc(postData.id).update({
        lock: true
      }).then(() => {
        setPostLock(true)
      })
        .catch(err => {
          alert('Lock failed:\n' + err.code)
        })
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => onPress()} data={postData}>
      <View style={styles.main}>
        <View style={styles.row}>
          <View>
            <Text>{postData.date}</Text>
          </View>
          {
            isAdmin ?
              <TouchableOpacity onPress={() => lock_post()}>
                {newPost ?
                  <IconIo name={'add-circle'} color={'blue'} size={20} />
                  :
                  <IconIo name={postLock ? 'ios-lock-closed-outline' : 'ios-lock-open-outline'} color={postLock ? 'red' : 'green'} size={20} />
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
          }}
        ></HTMLRend>
        <HTMLRend
          source={{ html: postData.short }}
          contentWidth={Dimensions.get('window').width}
        ></HTMLRend>
        {
          postFull ?
            <View>
              <View style={styles.line} />
              <View style={styles.response}>
                <View style={styles.row}>
                  <Icon name={'like1'} size={20} style={styles.pad} color={isLiked ? 'rgb(120,90,140)' : '#000'} />
                  <Text style={{ color: isLiked ? 'rgb(120,90,140)' : '#000' }}>likes: {postData.likes.length}</Text>
                </View>
                <Text >
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
    backgroundColor: 'rgb(220,220,240)',
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
    shadowOpacity: 0.34,
    shadowRadius: 3.27,

    elevation: 10,
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
    backgroundColor: '#000000',
  },
});

export default PostInFeed;
