/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';


function PostInFeed({ onPress, data }) {
  const [postData, setPostData] = useState(data)
  const [isLiked, setIsLiked] = useState(auth().currentUser ? data.likes.includes(auth().currentUser.email) : false)
  // let { autor, date, headline, comments, likes, contant } = data;

  return (
    <View style={styles.main}>
      <View style={styles.row}>
        <View>
          <Text style={styles.autor}>{postData.autor}</Text>
          <Text>{postData.date}</Text>
        </View>
      </View>

      <Text onPress={() => onPress()} data={postData} style={styles.headline}>
        {postData.headline}
        {'\n'}
      </Text>
      <Text onPress={() => onPress()} data={postData}>
        {postData.contant}
      </Text>
      <View style={styles.line} />
      <View style={styles.response}>
        <TouchableOpacity style={styles.row} onPress={() => {
          onPress()
          // if (auth().currentUser) {
          //   console.log(postData.art_id)
          //   if (isLiked) {
          //     console.log('unlike')
          //     firestore().collection('article').doc(postData.art_id).update({
          //       likes: firestore.FieldValue.arrayRemove(auth().currentUser.email)
          //     }).then(() => {
          //       setPostData(prev => {
          //         var index = prev.likes.indexOf(auth().currentUser.email);
          //         if (index !== -1)
          //           prev.likes.splice(index, 1);
          //         return prev;
          //       })
          //       setIsLiked(false)
          //     })
          //       .catch(() => {
          //         console.log('unlike failed')
          //       })
          //   } else {
          //     console.log('like')
          //     firestore().collection('article').doc(postData.art_id).update({
          //       likes: firestore.FieldValue.arrayUnion(auth().currentUser.email)
          //     }).then(() => {
          //       setPostData(prev => {
          //         prev.likes.push(auth().currentUser.email)
          //         return prev;
          //       })
          //       setIsLiked(true)
          //     })
          //       .catch(() => {
          //         console.log('like failed')
          //       })
          //   }
          // }
        }}>
          <Icon name={isLiked ? 'dislike1' : 'like1'} size={20} style={styles.pad} color={isLiked ? 'rgb(120,90,140)' : '#000'} />
          <Text style={{ color: isLiked ? 'rgb(120,90,140)' : '#000' }}>likes: {postData.likes.length}</Text>
        </TouchableOpacity>
        <Text onPress={() => onPress()} data={postData}>
          comments: {postData.comments ? postData.comments.length : 0}
        </Text>
      </View>
    </View>
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
