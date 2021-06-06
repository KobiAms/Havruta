/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Alert, View, StyleSheet, FlatList, SafeAreaView, RefreshControl } from 'react-native';
import CommentComponent from '../Components/CommentComponent';
import FullArticleComponent from '../Components/FullArticleComponent'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { KeyboardAvoidingView } from 'react-native';
import { Platform } from 'react-native';
import { Dimensions } from 'react-native';


function ArticleScreen({ navigation, route }) {
  const [comments, setComments] = useState(route.params.data.comments)
  const [likes, setLikes] = useState(route.params.data.likes)
  const [loading, setLoading] = useState(false)
  const [isLock, setIsLock] = useState(route.params.data.lock)
  const [isLiked, setIsLiked] = useState(auth().currentUser ? route.params.data.likes.includes(auth().currentUser.email) : false)


  // this function updates the like/dislike at firestore
  function updateLikes() {
    if (auth().currentUser) {
      setLoading(true)
      if (isLiked) {
        firestore().collection('article').doc(route.params.data.id).update({
          likes: firestore.FieldValue.arrayRemove(auth().currentUser.email)
        }).then(() => {
          setLikes(prev => {
            var index = prev.indexOf(auth().currentUser.email);
            if (index !== -1)
              prev.splice(index, 1);
            return prev;
          })
          setIsLiked(false)
          setLoading(false)
        })
          .catch(error => {
            console.log('unlike failed', error)
            setLoading(false)
          })
      } else {
        firestore().collection('article').doc(route.params.data.id).update({
          likes: firestore.FieldValue.arrayUnion(auth().currentUser.email)
        }).then(() => {
          setLikes(prev => {
            prev.push(auth().currentUser.email)
            return prev;
          })
          setIsLiked(true)
          setLoading(false)
        })
          .catch(err => {
            console.log('like failed', err)
            setLoading(false)
          })
      }
    }
  }

  // this function add comment into firestore 
  function addComment(comInput) {
    if (auth().currentUser) {
      setLoading(true)
      let new_comment = {
        comment: comInput,
        user_id: auth().currentUser.email,
        timestamp: firestore.Timestamp.fromDate(new Date())
      }
      firestore().collection('article').doc(route.params.data.id).update({
        comments: firestore.FieldValue.arrayUnion(new_comment),
      }).then(() => {
        setComments(prev => {
          prev.push(new_comment)
          return prev;
        })
        setLoading(false)
      })
        .catch(error => {
          console.log('addComment failed', error)
          setLoading(false)
        })
    } else {
      Alert.alert('this option open only to registreted users', '', []);
    }
  }

  function deleteComment(comment_to_delete, index) {
    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [{
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "OK",
        onPress: () => {
          setLoading(true)
          firestore().collection('article').doc(route.params.data.id).update({
            comments: firestore.FieldValue.arrayRemove(comment_to_delete)
          })
            .then(() => {
              setLoading(false)
              setComments(prev => {
                delete prev[index]
                console.log(prev)
                return prev
              })
            })
            .catch(err => {
              console.log('error delete comment: ', err)
            })
        },
        style: 'destructive'
      }])
  }

  function refresh() {
    setLoading(true)
    firestore().collection('article').doc(route.params.data.id).get()
      .then(doc => {
        if (!doc.data())
          return
        const likes_tmp = doc.data().likes
        const comments_tmp = doc.data().comments
        const lock_tmp = doc.data().lock
        if (likes_tmp.length != likes.length) {
          setLikes(likes_tmp)
        }
        if (comments_tmp.length != comments.length) {
          setComments(comments_tmp)
        }
        if (lock_tmp != isLock) {
          setIsLock(lock_tmp)
        }
        setLoading(false)
      })
      .catch(error => {
        console.log(error)
        setLoading(false)
      })
  }

  useEffect(() => {
    const subscriber = firestore().collection('article').doc(route.params.data.id)
      .onSnapshot(doc => {
        const likes_tmp = doc.data().likes
        const comments_tmp = doc.data().comments
        const lock_tmp = doc.data().lock
        setLikes(likes_tmp)
        setComments(comments_tmp)
        setIsLock(lock_tmp)
        setLoading(false)
      })
    return subscriber
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: 'rgb(120,90,140)' }} />
      <View
        style={{ flex: 10, paddingTop: 0, backgroundColor: 'rgb(220,220,240)' }}>
        <FlatList
          data={[route.params.data, ...comments, 'end_list']}
          refreshControl={
            <RefreshControl
              enabled={true}
              refreshing={false}
              onRefresh={refresh}
            />
          }
          scrollIndicatorInsets={{ right: 1 }}
          renderItem={({ item, index }) => {
            if (index == 0)
              return (<FullArticleComponent data={item} likes={likes} likeUpdate={updateLikes} addComment={addComment} isLiked={isLiked} isRegister={auth().currentUser} lock={isLock} />)
            else if (index == comments.length + 1)
              return <View style={{ height: Dimensions.get('screen').height * 0.4, width: '100%' }}></View>
            return (<CommentComponent data={item} setLoading={setLoading} id={route.params.data.id} isAdmin={route.params.user ? route.params.user.role : false} deleteComment={() => deleteComment(item, index)} />)
          }}
          keyExtractor={(item, idx) => idx}
        />
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
    flex: 1,
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

export default ArticleScreen;



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