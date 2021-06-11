/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Text, Image, View, StyleSheet, TouchableOpacity, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import IconIo from 'react-native-vector-icons/Ionicons';
import IconAW5 from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios'
import auth from '@react-native-firebase/auth';
import HTMLRend from 'react-native-render-html';
import firestore from '@react-native-firebase/firestore'

/**A component that display a short content on an article */
function PostInFeed({ onPress, data, isAdmin }) {
    const postData = data
    const [postLock, setPostLock] = useState(true)
    const [newPost, setNewPost] = useState(true)
    const [postExtraData, setPostExtraData] = useState()
    const [imageUrl, setImageUrl] = useState()

    function loadExtraData() {
        firestore().collection('article').doc(data.id)
            .get().then(snapshot => {
                if (!snapshot.data()) {
                    return
                }
                setNewPost(false)
                let extra_tmp = snapshot.data();
                setPostLock(extra_tmp.lock)
                setPostExtraData(extra_tmp)
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        if (data.image_link) {
            const baseURL = data.image_link
            axios.create({ baseURL }).get().then(res => {
                if (res.data.guid.rendered[4] != '') {
                    setImageUrl(res.data.guid.rendered.substring(0, 4) + 's' + res.data.guid.rendered.substring(4, res.data.guid.rendered.length))
                } else {
                    setImageUrl(res.data.guid.rendered)
                }
            }).catch((error) => {
                console.log(error)
            })
        }
        loadExtraData()


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
                .then(() => {
                    loadExtraData();
                }).catch(err => alert('Unlock failed:\n' + err.code))
        } else {
            firestore().collection('article').doc(postData.id).update({ lock: true })
                .then(() => {
                    loadExtraData();
                }).catch(err => alert('Lock failed:\n' + err.code))
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
                }).then(() => {
                    loadExtraData();
                }).catch(error => {
                    console.log('unlike failed', error)
                })
            } else {
                // add the like into the 'likes' array at firestore 
                firestore().collection('article').doc(data.id).update({
                    likes: firestore.FieldValue.arrayUnion(auth().currentUser.email)
                }).then(() => {
                    loadExtraData();
                }).catch(error => {
                    console.log('like failed', error)
                })
            }
        }
    }

    return (
        <TouchableWithoutFeedback onPress={() => onPress(postExtraData)}>

            <View style={styles.main}>
                {
                    imageUrl ?
                        <Image style={styles.backgroundImage} source={{ uri: imageUrl }} />
                        // null
                        :
                        null
                }
                <View style={{ padding: 10 }}>
                    <View style={styles.row}>
                        <View style={{ padding: 5, borderRadius: 10, backgroundColor: '#fffa', margin: 5 }}>
                            <Text>{postData.date}</Text>
                        </View>
                        {
                            isAdmin ?
                                <TouchableOpacity style={{ padding: 5, borderRadius: 5, backgroundColor: '#fff8', margin: 5 }} onPress={() => lock_post()}>
                                    {newPost ?
                                        <IconIo name={'add-circle'} color={'#0d5794'} size={20} />
                                        :
                                        <IconAW5 name={postLock ? 'lock' : 'unlock'} color={postLock ? '#e55a5a' : '#5ba92c'} size={20} />
                                    }
                                </TouchableOpacity>
                                :
                                null
                        }
                    </View>

                    <HTMLRend
                        source={{ html: postData.headline }}
                        baseFontStyle={{
                            fontSize: 22,
                            alignItems: 'flex-end',
                            fontWeight: 'bold',
                            textAlign: 'right',
                            color: '#333',
                        }}
                        containerStyle={{ padding: 5, borderRadius: 10, backgroundColor: '#fff8', margin: 5 }}
                    ></HTMLRend>
                    <HTMLRend
                        source={{ html: postData.short }}
                        contentWidth={Dimensions.get('window').width}
                        baseFontStyle={{
                            textAlign: 'right', color: '#333'
                        }}
                        containerStyle={{ padding: 5, borderRadius: 10, backgroundColor: '#fff8', margin: 5 }}
                    ></HTMLRend>

                    {
                        postExtraData ?
                            <View>
                                <View style={styles.line} />
                                <View style={{ padding: 5, borderRadius: 10, backgroundColor: '#fffa', margin: 5 }}>
                                    <View style={styles.response}>
                                        {
                                            postLock ?
                                                <View style={styles.row}>
                                                    <Icon name={'like1'} size={20} style={styles.pad} color={auth().currentUser && postExtraData.likes.includes(auth().currentUser.email) ? '#2e98c5' : '#333'} />
                                                    <Text style={{ color: postExtraData.likes.includes(auth().currentUser && auth().currentUser.email) ? '#2e98c5' : '#333' }}>likes: {postExtraData.likes.length}</Text>
                                                </View>
                                                :
                                                <TouchableOpacity onPress={() => updateLikes()} style={styles.row}>
                                                    <Icon name={'like1'} size={20} style={styles.pad} color={auth().currentUser && postExtraData.likes.includes(auth().currentUser.email) ? '#2e98c5' : '#333'} />
                                                    <Text style={{ color: postExtraData.likes.includes(auth().currentUser && auth().currentUser.email) ? '#2e98c5' : '#333' }}>likes: {postExtraData.likes.length}</Text>
                                                </TouchableOpacity>
                                        }
                                        <Text style={{ color: '#333' }} >
                                            comments: {postExtraData.comments.length}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            : null
                    }
                </View>
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
        margin: 5,
        flex: 1,
        resizeMode: 'cover',
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
    backgroundImage: {
        height: '100%',
        width: '100%',
        resizeMode: 'cover', // or 'stretch'
        position: 'absolute',
        alignSelf: 'center',
        opacity: 0.36,
        borderRadius: 5,
    }
});
export default PostInFeed;