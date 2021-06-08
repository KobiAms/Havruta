/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Alert, View, StyleSheet, FlatList, SafeAreaView, RefreshControl } from 'react-native';
import CommentComponent from '../Components/CommentComponent';
import FullArticleComponent from '../Components/FullArticleComponent'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Dimensions } from 'react-native';
import { useCallback } from 'react';


/*this function return the article components including
* the article data from wordpress and the likes and comments
* from firebase*/
function ArticleScreen({ navigation, route }) {
  const [comments, setComments] = useState(route.params.data.comments)
  const [likes, setLikes] = useState(route.params.data.likes)
  const [loading, setLoading] = useState(false)
  const [isLock, setIsLock] = useState(route.params.data.lock)
  const [isLiked, setIsLiked] = useState(auth().currentUser ? route.params.data.likes.includes(auth().currentUser.email) : false)

  /* function to update the like/dislike at firestore*/
  function updateLikes() {
    // first check if user is login
    if (auth().currentUser) {
      setLoading(true)
      if (isLiked) {
        // remove the like from the 'likes' array at firestore 
        firestore().collection('article').doc(route.params.data.id).update({
          likes: firestore.FieldValue.arrayRemove(auth().currentUser.email)
        }).then(() => {
          // after update success set the like locally
          setIsLiked(false)
          setLoading(false)
        })
          .catch(error => {
            console.log('unlike failed', error)
            setLoading(false)
          })
      } else {
        // add the like into the 'likes' array at firestore 
        firestore().collection('article').doc(route.params.data.id).update({
          likes: firestore.FieldValue.arrayUnion(auth().currentUser.email)
        }).then(() => {
          // after update success set the like locally
          setIsLiked(true)
          setLoading(false)
        })
          .catch(error => {
            console.log('like failed', error)
            setLoading(false)
          })
      }
    }
  }

  /* function to add comment into the comments array at firebase*/
  function addComment(comInput) {
    // check if user is login
    if (auth().currentUser) {
      // check that the input isn't empty
      if (comInput.length < 1) {
        console.log('object')
        return
      }
      setLoading(true)
      // create new comment object from the field 
      let new_comment = {
        comment: comInput,
        user_id: auth().currentUser.email,
        timestamp: firestore.Timestamp.fromDate(new Date())
      }
      // insert the comment object to comment array at firestore
      firestore().collection('article').doc(route.params.data.id).update({
        comments: firestore.FieldValue.arrayUnion(new_comment),
      }).then(() => {
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

  /* ----------------------------------------------------------------
  * admin function to delete comment from the comments array at firebase
  *///---------------------------------------------------------------
  function deleteComment(comment_to_delete, index) {
    // ask user to prevent mistakes
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
          // delete the comment object from comment array at firestore
          firestore().collection('article').doc(route.params.data.id).update({
            comments: firestore.FieldValue.arrayRemove(comment_to_delete)
          })
            .then(() => {
              setLoading(false)
            })
            .catch(err => {
              console.log('error delete comment: ', err)
            })
        },
        style: 'destructive'
      }])
  }

  useEffect(() => {
    // init new listener to the fb doc refernce to receive the updates Automatically 
    const subscriber = firestore().collection('article').doc(route.params.data.id)
      .onSnapshot(doc => {
        if (!doc.data())
          return
        // reset the new commnts/likes/lock and update sit at the clinet front
        const likes_tmp = doc.data().likes
        const comments_tmp = doc.data().comments
        const lock_tmp = doc.data().lock
        setLikes(likes_tmp)
        setComments(comments_tmp)
        setIsLock(lock_tmp)
        setLoading(false)
      })
    return subscriber //unsubscribe when close component 
  }, [])

  // trolly loading animation to give the user the filling of the refresh option
  const [refreshing, setRefreshing] = useState(false);
  const wait = (timeout) => { return new Promise(resolve => setTimeout(resolve, timeout)); }
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  // return the article component with all the data
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: 'rgb(120,90,140)' }} />
      <View
        style={{ flex: 10, paddingTop: 0, backgroundColor: '#f2f2f3' }}>
        <FlatList
          data={[route.params.data, ...comments, 'end_list']}
          refreshControl={
            <RefreshControl
              enabled={true}
              refreshing={refreshing}
              onRefresh={onRefresh}
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
    backgroundColor: '#fff',
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