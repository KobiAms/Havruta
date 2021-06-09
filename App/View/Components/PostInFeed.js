/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import IconIo from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import HTMLRend from 'react-native-render-html';
import firestore from '@react-native-firebase/firestore'

/**A component that display a short content on an article */
function PostInFeed({ onPress, data, isAdmin }) {
    const postData = data
    const [postLock, setPostLock] = useState(true)
    const [newPost, setNewPost] = useState(true)
    const [postExtraData, setPostExtraData] = useState()

    useEffect(() => {
        const subscriber = firestore().collection('article').doc(data.id)
            .onSnapshot(snapshot => {
                if (!snapshot.data()) {
                    return
                }
                setNewPost(false)
                let extra_tmp = snapshot.data();
                setPostLock(extra_tmp.lock)
                setPostExtraData(extra_tmp)
            })
        return subscriber
    }, [])

    function lock_post() {
        if (newPost) {
            firestore().collection('article').doc(postData.id).set({
                comments: [],
                likes: [],
                lock: false
            }).catch(err => { alert('Initialise failed:\n' + err.code) })
        } else if (postLock) {
            firestore().collection('article').doc(postData.id).update({ lock: false })
                .then(() => setPostLock(false)).catch(err => alert('Unlock failed:\n' + err.code))
        } else {
            firestore().collection('article').doc(postData.id).update({ lock: true }).
                then(() => setPostLock(true)).catch(err => alert('Lock failed:\n' + err.code))
        }
    }

    /* function to update the like/dislike at firestore*/
    function updateLikes() {
        // first check if user is login
        if (auth().currentUser) {
            // check if user already like this post
            if (postExtraData.likes.includes(auth().currentUser.email)) {
                // remove the like from the 'likes' array at firestore 
                firestore().collection('article').doc(data.id).update({
                    likes: firestore.FieldValue.arrayRemove(auth().currentUser.email)
                }).catch(error => {
                    console.log('unlike failed', error)
                })
            } else {
                // add the like into the 'likes' array at firestore 
                firestore().collection('article').doc(data.id).update({
                    likes: firestore.FieldValue.arrayUnion(auth().currentUser.email)
                })
                    .catch(error => {
                        console.log('like failed', error)
                        setLoading(false)
                    })
            }
        }
    }

    return (
        <TouchableWithoutFeedback onPress={() => onPress(postExtraData)}>
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
                    postExtraData ?
                        <View>
                            <View style={styles.line} />
                            <View style={styles.response}>
                                <TouchableOpacity onPress={() => updateLikes()} style={styles.row}>
                                    <Icon name={'like1'} size={20} style={styles.pad} color={auth().currentUser && postExtraData.likes.includes(auth().currentUser.email) ? '#2e98c5' : '#333'} />
                                    <Text style={{ color: postExtraData.likes.includes(auth().currentUser && auth().currentUser.email) ? '#2e98c5' : '#333' }}>likes: {postExtraData.likes.length}</Text>
                                </TouchableOpacity>
                                <Text style={{ color: '#333' }} >
                                    comments: {postExtraData.comments.length}
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