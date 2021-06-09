import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Pressable, FlatList, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Chat from '../Components/ChatItem';
import IconIo from 'react-native-vector-icons/Ionicons';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';

function ChatScreen({ navigation, route }) {
    const [chats, setChats] = useState([, , , , , , , , , ,])
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    /*this useEffect update the state "isAdmin" after checking it's role on firebase*/
    const [user, setUser] = useState(auth().currentUser);

    // listen to auth state and get the user data if is log-in
    function onAuthStateChanged(user_state) {
        setIsAdmin(false)
        if (user_state) {
            firestore().collection('users').doc(user_state.email).get()
                .then(doc => {
                    if (!doc.data()) {
                        setUser(undefined)
                    } else {
                        const user_tmp = doc.data()
                        setUser(user_tmp);
                        setIsAdmin(user_tmp.role == 'admin')
                    }
                })
                .catch(err => {
                    console.log(err)
                    setUser(undefined)
                })
        } else {
            setUser(user_state);
        }
    }
    useEffect(() => {
        auth().onAuthStateChanged(onAuthStateChanged);
    }, []);

    /*this useEffect update the state array "chatName", and put an array of objects.
    each object is a name and id of all the chats in the collection
    this goes onSnapshot, which mean every updata that happen on the server side will be push automaticly to the local device */
    useEffect(() => {
        const subscriber = firestore()
            .collection('chats')
            .onSnapshot(querySnapshot => {
                let chats_docs = []
                querySnapshot.forEach((doc) => {
                    let chat_tmp = doc.data();
                    chats_docs.push({ id: doc.id, data: chat_tmp });
                })
                setChats(chats_docs);
                setLoading(false);
            });
        return subscriber;
    }, [])

    /**this function is activate only by admin.
     * on long press on some chat, an alert will pop and allow the admin to premenetly remove a chat.*/
    function deleteChat(item) {
        if (isAdmin) {
            Alert.alert(
                "Delete Chat " + item.name, "Are you sure?",
                [{
                    text: "DELETE",
                    onPress: () => {
                        firestore()
                            .collection('chats')
                            .doc(item.id)
                            .delete()
                            .then(() => console.log('delete ' + item.id + ' succssefuly'))
                            .catch(err => console.log('error in deleting chat: ' + err.code))
                        Alert.alert("Chats Deleted")
                    }, style: 'destructive'
                },
                {
                    text: "Cancel",
                    style: "cancel",
                },],
                { cancelable: true, }
            );
        }
    }


    function chat_item_to_inflate(item, index) {
        if (loading) {
            return (
                <SkeletonContent
                    containerStyle={styles.skeleton}
                    layout={[
                        {
                            width: 200,
                            height: Dimensions.get('screen').height * 0.01,
                            marginBottom: 5,
                        },
                        {
                            width: '90%',
                            height: Dimensions.get('screen').height * 0.03,
                            marginBottom: 5,
                        }
                    ]}
                    isLoading={loading}>
                </SkeletonContent>
            )
        } else if (item == 'end_list') {
            return <View style={{ height: 40, width: '100%' }}></View>
        } else {
            return (
                <Pressable
                    onPress={() => navigation.navigate('GenericChat', { id: item.id, data: item.data })}
                    onLongPress={() => deleteChat(item)}>
                    <Chat item={item} />
                </Pressable>
            )
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Chats',
        });
    }, [])

    return (

        <View style={styles.main}>
            {loading ? (
                <FlatList
                    data={chats}
                    renderItem={() => (
                        <SkeletonContent
                            containerStyle={styles.skeleton}
                            layout={[
                                {
                                    width: 200,
                                    height: Dimensions.get('screen').height * 0.02,
                                    marginBottom: 5,
                                },
                                {
                                    width: '90%',
                                    height: Dimensions.get('screen').height * 0.035,
                                    marginBottom: 5,
                                }
                            ]}
                            isLoading={loading}>
                        </SkeletonContent>
                    )}
                    keyExtractor={(item, idx) => idx}
                />
            ) : (
                <FlatList
                    scrollIndicatorInsets={{ right: 1 }}
                    style={styles.list}
                    data={[...chats, 'end_list']}
                    renderItem={({ item, index }) => chat_item_to_inflate(item, index)}
                    keyExtractor={(item, idx) => idx}
                />)}
            <View style={{ position: 'absolute', bottom: 10, right: 10 }}>
                {isAdmin ?
                    <TouchableOpacity
                        style={styles.adder}
                        onPress={() => navigation.navigate('AddChat', { data: chats })}>
                        <IconIo name={'add-circle'} color={'rgb(120,90,140)'} size={65} />
                    </TouchableOpacity> : null}
            </View>
        </View>

    );
}
const styles = StyleSheet.create({
    main: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'rgb(220,220,240)',
    },
    list: {
        height: '100%',
        width: '100%',
    },
    adder: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        zIndex: 1,
        margin: 20,
    },
    skeleton: {
        backgroundColor: 'rgb(220,220,240)',
        minWidth: '97%',
        padding: 5,
        justifyContent: 'flex-start',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 3.27,
        elevation: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgb(160,160,180)'
    }
});

export default ChatScreen;