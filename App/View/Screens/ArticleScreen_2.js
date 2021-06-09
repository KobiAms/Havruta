/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useCallback, useLayoutEffect } from 'react';
import { Alert, View, StyleSheet, FlatList, SafeAreaView, RefreshControl } from 'react-native';
import CommentComponent_2 from '../Components/CommentComponent_2';
import FullArticleComponent_2 from '../Components/FullArticleComponent_2'
import firestore from '@react-native-firebase/firestore';
import { useHeaderHeight } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import { Pressable } from 'react-native';
import { Platform } from 'react-native';
import { Dimensions } from 'react-native';


/*this function return the article components including
* the article data from wordpress and the likes and comments
* from firebase*/
function ArticleScreen({ navigation, route }) {
    const [postExtraData, setPostExtraData] = useState(route.params.extraData)

    const headerHeight = useHeaderHeight();

    // create a snapshot listener to gets changes at comments & likes
    useEffect(() => {
        const subscriber = firestore().collection('article').doc(route.params.data.id)
            .onSnapshot(snapshot => {
                if (!snapshot.data())
                    return
                let tmp_data = snapshot.data()
                setPostExtraData(tmp_data)
            })
        return subscriber
    }, [])

    /* function to update the like/dislike at firestore*/
    function updateLikes() {
        // first check if user is login
        if (auth().currentUser) {
            if (postExtraData.likes.includes(auth().currentUser.email)) {
                // remove the like from the 'likes' array at firestore 
                firestore().collection('article').doc(route.params.data.id).update({
                    likes: firestore.FieldValue.arrayRemove(auth().currentUser.email)
                }).catch(error => {
                    console.log('unlike failed', error)
                })
            } else {
                // add the like into the 'likes' array at firestore 
                firestore().collection('article').doc(route.params.data.id).update({
                    likes: firestore.FieldValue.arrayUnion(auth().currentUser.email)
                }).catch(error => {
                    console.log('like failed', error)
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
            // create new comment object from the field 
            let new_comment = {
                comment: comInput,
                user_id: auth().currentUser.email,
                timestamp: firestore.Timestamp.fromDate(new Date())
            }
            // insert the comment object to comment array at firestore
            firestore().collection('article').doc(route.params.data.id).update({
                comments: firestore.FieldValue.arrayUnion(new_comment),
            }).catch(error => {
                console.log('addComment failed', error)
            })
        } else {
            Alert.alert('this option open only to registreted users', '', []);
        }
    }

    /* ----------------------------------------------------------------
    * admin function to delete comment from the comments array at firebase
    *///---------------------------------------------------------------
    function deleteComment(comment_to_delete) {
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
                    // delete the comment object from comment array at firestore
                    firestore().collection('article').doc(route.params.data.id).update({
                        comments: firestore.FieldValue.arrayRemove(comment_to_delete)
                    })
                        .catch(err => {
                            console.log('error delete comment: ', err)
                        })
                },
                style: 'destructive'
            }])
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: route.params.data.headline
        });
    }, [navigation])

    // trolly loading animation to give the user the filling of the refresh option
    const [refreshing, setRefreshing] = useState(false);
    const wait = (timeout) => { return new Promise(resolve => setTimeout(resolve, timeout)); }
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    // return the article component with all the data
    return (
        <View
            style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 0, backgroundColor: 'rgb(120,90,140)' }} />
            <FlatList
                style={{ flex: 1, paddingTop: 0, backgroundColor: '#f2f2f3' }}
                data={postExtraData ? [route.params.data, ...postExtraData.comments, 'end_list'] : [route.params.data, 'end_list']}
                scrollIndicatorInsets={{ right: 1 }}
                refreshControl={
                    <RefreshControl
                        enabled={true}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                renderItem={({ item, index }) => {
                    if (index == 0)
                        return (<FullArticleComponent_2 data={item} extraData={postExtraData} likeUpdate={updateLikes} addComment={addComment} />)
                    else if (item == 'end_list')
                        return <View style={{ height: 40/*Dimensions.get('screen').height * 0.34 */ }}></View>
                    return (
                        <Pressable onLongPress={() => deleteComment(item)}>
                            <CommentComponent_2 data={item} />
                        </Pressable>)
                }}
                keyExtractor={(item, idx) => idx}

            />
        </View>
    );
}

const styles = StyleSheet.create({

});
export default ArticleScreen;