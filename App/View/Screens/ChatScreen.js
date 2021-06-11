import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Pressable, FlatList, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import Chat from '../Components/ChatItem';
import IconIo from 'react-native-vector-icons/Ionicons';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';

function ChatScreen({ navigation, route }) {
    const [chats, setChats] = useState([])
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(auth().currentUser);
    const [refreshing, setRefreshing] = useState(false)

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
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber
    }, []);

    function loadChats() {
        setChats(['loading', 'loading', 'loading', 'loading', 'loading', 'loading', 'loading', 'loading', 'loading', 'loading', 'loading'])
        setLoading(true);
        firestore()
            .collection('chats')
            .get().then(docs => {
                let chats_docs = []
                docs.forEach((doc) => {
                    let chat_tmp = doc.data();
                    chats_docs.push({ id: doc.id, data: chat_tmp });
                })
                setChats(chats_docs);
                setLoading(false);
                setRefreshing(false)
            })
            .catch(err => console.log(err))
    }

    /*this useEffect update the state array "chatName", and put an array of objects.
    each object is a name and id of all the chats in the collection
    this goes onSnapshot, which mean every updata that happen on the server side will be push automaticly to the local device */
    useEffect(() => {
        loadChats()
    }, [])

    /**this function is activate only by admin.
     * on long press on some chat, an alert will pop and allow the admin to premenetly remove a chat.*/
    function deleteChat(item) {
        console.log(item)
        console.log( item.data.images)
        if (isAdmin) {
            Alert.alert(
                " מחיקת צ׳אט לצמיתות",
                "מחיקת הצ׳אט" + " \"" + item.data.name + "\" " + ",האם אתה בטוח  ?",
               
                [{
                    text: "מחק",
                    onPress: () => {
                        if(item.data.images){
                            item.data.images.forEach(element => storage().ref(element).delete()
                            .catch(console.log));
                        }
                        firestore().collection('chats').doc(item.id).delete()
                            .then(() => console.log('delete ' + item.id + ' succssefuly'))
                            .catch(err => console.log('error in deleting chat: ' + err.code))
                        Alert.alert("Chats Deleted")
                    }, style: 'destructive'
                },
                {
                    text: "ביטול",
                    style: "cancel",
                },],
                { cancelable: true, }
            );
        }
    }


    function chat_item_to_inflate(item, index) {
        if (item == 'loading') {
            return (
                <SkeletonContent
                    containerStyle={styles.skeleton}
                    layout={[
                        {
                            width: 200,
                            height: Dimensions.get('screen').height * 0.02,
                            marginBottom: 5,
                            marginRight: 10,
                        },
                        {
                            width: '90%',
                            height: Dimensions.get('screen').height * 0.03,
                            marginBottom: 5,
                            marginRight: 10,
                        },
                        {
                            width: 100,
                            height: Dimensions.get('screen').height * 0.03,
                            borderRadius: 0,
                            marginBottom: 5,
                            marginRight: 10,
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
                    onPress={() => navigation.navigate('GenericChat', { id: item.id, chat_name: item.data.name })}
                    onLongPress={() => deleteChat(item)}>
                    <Chat item={item} />
                </Pressable>
            )
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'צ׳אטים',
        });
    }, [])

    return (

        <View style={styles.main}>
            <FlatList
                scrollIndicatorInsets={{ right: 1 }}
                style={styles.list}
                data={[...chats, 'end_list']}
                renderItem={({ item, index }) => chat_item_to_inflate(item, index)}
                keyExtractor={(item, idx) => idx}
                onRefresh={() => { setRefreshing(true); loadChats(); }}
                refreshing={refreshing}
            />
            <View style={{ position: 'absolute', bottom: 10, right: 10 }}>
                {isAdmin ?
                    <TouchableOpacity
                        style={styles.adder}
                        onPress={() => navigation.navigate('AddChat', { data: chats })}>
                        <IconIo name={'add-circle'} color={'#0d5794'} size={65} />
                    </TouchableOpacity> : null}
            </View>
        </View>

    );
}
const styles = StyleSheet.create({
    main: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f0fbff',
    },
    list: {
        height: '100%',
        width: '100%',
    },
    adder: {
        borderRadius: 38,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        margin: 20,
        position: 'absolute',
        bottom: 10,
        right: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 1.5,
        elevation: 2,
    },
    skeleton: {
        backgroundColor: '#fff',
        minWidth: '97%',
        padding: 10,
        alignItems: 'flex-end',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 3.27,
        elevation: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#cfcfcf'
    }
});

export default ChatScreen;