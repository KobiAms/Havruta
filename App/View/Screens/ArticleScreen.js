/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useCallback, useLayoutEffect } from 'react';
import { Alert, View, Pressable, KeyboardAvoidingView, Text, Platform, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import CommentComponent from '../Components/CommentComponent';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import FullArticleComponent from '../Components/FullArticleComponent'
import firestore from '@react-native-firebase/firestore';
import { useHeaderHeight } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/AntDesign';
import IconIos from 'react-native-vector-icons/Ionicons';
var decode = require('unescape');

/*this function return the article components including
* the article data from wordpress and the likes and comments
* from firebase*/
function ArticleScreen({ navigation, route }) {
    const [extraData, setPostExtraData] = useState(route.params.extraData)
    const [commentInput, setCommentInput] = useState('')
    const [reactionShow, setReactionShow] = useState(false)
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
            if (extraData.likes.includes(auth().currentUser.email)) {
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
        if (route.params.isAdmin) {
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
    }

    useLayoutEffect(() => {
        var tit = decode(route.params.data.headline);
        navigation.setOptions({
            title: tit
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
                data={extraData ? [route.params.data, ...extraData.comments, 'end_list'] : [route.params.data, 'end_list']}
                scrollIndicatorInsets={{ right: 1 }}
                refreshing={refreshing}
                onRefresh={onRefresh}
                onEndReachedThreshold={0.5}
                onEndReached={() => setReactionShow(true)}
                renderItem={({ item, index }) => {
                    if (index == 0)
                        return (<FullArticleComponent data={item} />)
                    else if (item == 'end_list')
                        return <View style={{ height: 120 }}></View>
                    return (
                        <Pressable onLongPress={() => deleteComment(item)}>
                            <CommentComponent data={item} navigation={navigation} />
                        </Pressable>)
                }}
                keyExtractor={(item, idx) => idx}
            />
            {
                extraData && !extraData.lock && reactionShow ?
                    <KeyboardAvoidingView
                        behavior={Platform.OS == 'ios' ? 'padding' : undefined}
                        keyboardVerticalOffset={headerHeight}
                        style={styles.reaction}
                    >
                        <View>
                            <View
                                style={[styles.response, { padding: 15, paddingTop: 5, paddingBottom: 5 }]} /** displays the amount of likes and comments */
                            >
                                <TouchableOpacity
                                    style={styles.row}
                                    onPress={auth().currentUser ? () => updateLikes() : null}>
                                    <Icon name={'like1'} size={20} style={styles.pad} color={auth().currentUser && extraData.likes.includes(auth().currentUser.email) ? '#0d5794' : '#333'} />
                                    <Text style={{ color: auth().currentUser && extraData.likes.includes(auth().currentUser.email) ? '#0d5794' : '#333' }}>likes: {extraData.likes.length}</Text>
                                </TouchableOpacity>
                                <Text style={{ color: '#333' }}>comments: {extraData.comments ? extraData.comments.length : 0}</Text>
                            </View>
                            <View style={styles.new_comment_box} /** text input to add new comment */>
                                <AutoGrowingTextInput
                                    placeholder={auth().currentUser ? 'הוסף תגובה...' : 'רק משתמשים מחוברים יכולים להגיב'}
                                    style={[styles.input, auth().currentUser ? null : { backgroundColor: '#ddd' }]}
                                    multiline
                                    onChangeText={setCommentInput}
                                    value={commentInput}
                                    returnKeyType={'send'}
                                    editable={auth().currentUser ? true : false}
                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        if (commentInput.length == 0)
                                            return;
                                        addComment(commentInput)
                                        setCommentInput('')
                                    }}
                                    style={{ marginLeft: 10, }}
                                >
                                    <IconIos name={'send'} size={25} color={'#0d5794'} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                    : null}
        </View>
    );
}

const styles = StyleSheet.create({
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
        width: Dimensions.get('screen').width * (80 / 100),
        height: 40,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#aaa',
        backgroundColor: '#FFFFFF',
        padding: 7
    },
    new_comment_box: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginBottom: Platform.OS == 'ios' ? 10 : 0,
        paddingHorizontal: Dimensions.get('screen').width / 3
    },
    reaction: {
        alignSelf: 'center',
        width: '97%',
        backgroundColor: 'gray',
        position: 'absolute',
        bottom: Platform.OS == 'ios' ? 8 : 10,
        borderRadius: Platform.OS == 'ios' ? 40 : 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderWidth: 1,
        borderColor: '#0d579488',
        elevation: 5,
        padding: 10,
        backgroundColor: '#f2f2f3',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
    }
});
export default ArticleScreen;