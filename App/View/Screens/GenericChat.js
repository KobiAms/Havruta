/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TextInput,
    ActivityIndicator,
    Pressable,
    TouchableOpacity,
    RefreshControl,
    Dimensions,
    Alert,
    Image,
    Platform,
    StatusBar,
    KeyboardAvoidingView,
    SafeAreaView
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import ChatMessage from '../Components/ChatMessageComponent'
import { useHeaderHeight } from '@react-navigation/stack';
import { launchImageLibrary } from 'react-native-image-picker';

let msgToLoad = 20;
let msgToStart = 0;
let endReached = false;

const ListFooterComponent = () => {
    return <ActivityIndicator size="large" color="rainbow" />;
};


/*this function dicompose the doc of the coplete chat into small object where as any object represent one msg item inside our chat*/
function GenericChat({ navigation, route }) {
    const chat_id = route.name == 'Reporters' ? 'reporters' : route.params.id;
    const [newMessage, setNewMessage] = useState('');
    const [chat_data, set_chat_data] = useState([]);
    const [user, setUser] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [docPre, setDocPre] = useState();
    const [useRole, setUseRole] = useState('user');
    const [curUserInfo, setCurUserInfo] = useState();
    const headerHeight = useHeaderHeight();
    const KEYBOARD_VERTICAL_OFFSET = headerHeight + StatusBar.currentHeight;

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(1000).then(() => setRefreshing(false));
    }, []);

    function deleteMsg(item) {
        if (auth().currentUser.email === item.user_id || user.role === "admin") {
            Alert.alert(
                "Delete Message",
                "Are you sure?",
                [
                    {
                        text: "DELETE",
                        onPress: () => {
                            firestore().collection('chats').doc(chat_id).update({ messages: firestore.FieldValue.arrayRemove(item) })
                            Alert.alert("Message Deleted")
                        },
                        style: 'destructive'
                    },
                    {
                        text: "Cancel",
                        style: "cancel",
                    },
                ],
                { cancelable: true, }
            );
        }
    }

    /*this function is used when we want to send message on the chat.
    first we check the the message content exist in order to prevent from sending empty messages to the server.
    after we verify that the messsage is decent we update firestore with the new message*/
    function sendMessage() {
        let tempMessage = {
            user_id: user.email,
            message: newMessage,
            date: new Date(),
        };
        setNewMessage('');
        if (!tempMessage.message.replace(/\s/g, '').length || !auth().currentUser) {
            setNewMessage('');
        } else {
            firestore()
                .collection('chats')
                .doc(chat_id)
                .update({
                    messages: firestore.FieldValue.arrayUnion(tempMessage),
                })
                .catch(error => {
                    console.log('error is: ' + error.toString());
                });
        }
    };

    function onAuthStateChanged(user) {
        setUser(user);
    }
    // we call that function on reaching to the end of the screen
    // this function updates the displayed msgs list.
    // we read all the chat list from the chat and we slice it into the amount of messages we want to see.
    function loadMore(chat_data) {
        msgToLoad = msgToLoad + 20;
        firestore()
            .collection('chats')
            .doc(chat_id)
            .onSnapshot(doc => {
                if (!doc) return;
                if (doc.data().messages) {
                    let reversed = doc.data().messages.reverse();
                    if (reversed.length < msgToLoad) {
                        endReached = true;
                        set_chat_data(reversed.slice(msgToStart, reversed.length));
                    } else {
                        set_chat_data(reversed.slice(msgToStart, msgToLoad));
                    }
                    if (chat_data.length === doc.data().messages.length) {
                        endReached = true;
                    }
                }
            });
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: route.params && route.params.data ? route.params.data.name : route.name,
            headerRight: () => (
                < TouchableOpacity
                    style={styles.chat_image_container}
                    onPress={() => update_chat_image()}>
                    <Image source={require('../../Assets/logo.png')} style={styles.chat_image} />
                </TouchableOpacity >
            )
        });
    }, [])

    function setHeaderImage(imageUrl) {
        navigation.setOptions({
            headerRight: () => {
                return (
                    < View
                        style={styles.chat_image_container}
                        onPress={() => update_chat_image()}>
                        <Image source={imageUrl ? imageUrl : require('../../Assets/logo.png')} style={styles.chat_image} />
                    </View >
                )
            }
        })
    }

    // this function upload the avatar image into the storage
    function update_chat_image() {
        if (useRole == 'admin') {
            // lunching the camera roll / gallery
            launchImageLibrary({}, async response => {
                if (response.didCancel) { }
                else if (response.error) {
                    Alert.alert(
                        'Error',
                        response.errorCode + ': ' + response.errorMessage,
                        [{ text: 'OK' }],
                        { cancelable: false },
                    );
                } else {
                    // // create storage ref
                    const reference = storage().ref('/chats/' + chat_id + '/' + 'chat_photo.png');
                    // upload image and wait till it ends
                    await reference.putFile(response.uri);
                    // get the url of the photo we just upload
                    reference.getDownloadURL().then(url => {
                        firestore().collection('chats').doc(chat_id)
                            .update({ imageUrl: url })
                            .then(() => setHeaderImage({ uri: response.uri }))
                            .catch(() => console.log('error updtae imageurl'))
                    });
                }
            });
        }
    }

    useEffect(() => {
        const subscriber = firestore()
            .collection('chats')
            .doc(chat_id)
            .onSnapshot(doc => {
                if (!doc) return;
                if (doc.data().imageUrl) {
                    setHeaderImage({ uri: doc.data().imageUrl })
                }
                if (doc.data().messages) {
                    let reversed = doc.data().messages.reverse();
                    if (reversed.length === 0) {
                        setDocPre(doc.data().premission);
                        return subscriber;
                    }
                    else {
                        set_chat_data(reversed.slice(0, msgToLoad));
                        setDocPre(doc.data().premission);
                    }
                }
            });
        return subscriber
    }, [])

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        if (auth().currentUser) {
            firestore()
                .collection('users')
                .doc(auth().currentUser.email)
                .get().then(doc => {
                    if (!doc) return;
                    let userDetails = doc.data();
                    setUseRole(doc.data().role)
                    setCurUserInfo(userDetails)
                })
                .catch(() => { })
        }
        return subscriber; // unsubscribe on unmount
    }, []);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS == 'ios' ? "padding" : 'padding'}
            style={styles.main}
            keyboardVerticalOffset={Platform.OS == 'ios' ? KEYBOARD_VERTICAL_OFFSET : -(headerHeight + 0)} // tabBarHeight
        >
            <SafeAreaView style={{ flex: 0, backgroundColor: 'rgb(120,90,140)' }} />
            <SafeAreaView style={{ flex: 1, backgroundColor: 'rgb(140, 140, 180)' }}>
                <View style={styles.main}>
                    {chat_data ? <FlatList
                        style={styles.list}
                        inverted
                        data={chat_data}
                        onEndReachedThreshold={0.2}
                        onEndReached={() => loadMore(chat_data)}
                        keyExtractor={(item, index) => index}
                        ListFooterComponent={() => !endReached && <ListFooterComponent />}
                        renderItem={({ item }) => (
                            <Pressable onLongPress={() => deleteMsg(item)}>
                                <ChatMessage
                                    item={item}
                                    refreshControl={
                                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                    }
                                />
                            </Pressable>
                        )}
                    /> : null}
                    {useRole == 'admin' || (useRole == 'reporter' && docPre !== 'admin') ? (
                        <View
                            style={styles.inputContainer}>
                            <TextInput
                                placeholder=" Add your message..."
                                style={styles.input}
                                value={newMessage}
                                onChangeText={setNewMessage}
                                autoCorrect={false}
                            />
                            <TouchableOpacity
                                onPress={() => sendMessage()}
                                style={
                                    newMessage.length == 0
                                        ? styles.sendButtonEmpty
                                        : styles.sendButtonFull
                                }>
                                <Icon name={'md-send'} size={20} color={'#ffffff'} />
                            </TouchableOpacity>
                        </View>
                    ) : null}
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#8fc0d4',
    },
    headline: {
        padding: 15,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    inputContainer: {
        padding: 5,
        backgroundColor: '#a3cbe0',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        borderTopWidth: 2,
        borderTopColor: '#555',
        marginTop: 3,

        shadowColor: '#000',
        shadowOffset: {
            width: 10,
            height: 10,
        },
        shadowOpacity: 0.32,
        shadowRadius: 0.46,
        elevation: 11,
    },
    input: {
        borderColor: 'black',
        backgroundColor: '#ffffff',
        width: '88%',
        borderRadius: 30,
        paddingLeft: 15,
        fontSize: 15,
        height: '75%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 6,
        padding: 4,
    },
    sendButtonEmpty: {
        padding: 8,
        backgroundColor: '#555555',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 200,
    },
    sendButtonFull: {
        padding: 8,
        backgroundColor: '#007fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.80,
        elevation: 2,
    },
    list: {
        flex: 1,
    },
    userId: {
        fontSize: 11,
        color: '#333333',
    },
    date: {
        fontSize: 11,
        color: '#333333',
    },
    chat_image_container: {
        height: 30,
        width: 30,
        borderRadius: 15,
        overflow: 'hidden',
        marginRight: 10
    },
    chat_image: {
        height: 30,
        width: 30,
    }
});
export default GenericChat;