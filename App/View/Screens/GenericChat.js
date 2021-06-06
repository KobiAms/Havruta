/* eslint-disable prettier/prettier */
import React from 'react';
import { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    ActivityIndicator,
    Pressable,
    TouchableOpacity,
    RefreshControl,
    Dimensions,
    Alert
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native';
import ChatMessage from '../Components/ChatMessageComponent'
import { resolvePreset } from '@babel/core';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import { KeyboardAvoidingView } from 'react-native';
import { StatusBar } from 'react-native';
import { useHeaderHeight } from '@react-navigation/stack';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';

let msgToLoad = 20;
let msgToStart = 0;
let endReached = false;
let flag = false;

const ListFooterComponent = () => {
    return <ActivityIndicator size="large" color="rainbow" />;
};
//this function dicompose the doc of the coplete chat into small object where as any object represent one msg item inside our chat
//


GenericChat = ({ navigation, route }) => {
    const [newMessage, setNewMessage] = useState('');
    const [chat_data, set_chat_data] = useState([]);
    const [user, setUser] = useState();
    const [chat_name, set_chat_name] = useState('');
    const [loadingMore, set_loading_more] = useState(false);
    const chat_id = route.name == 'Reporters' ? 'reporters' : route.params.id;
    const [refreshing, setRefreshing] = React.useState(false);
    const headerHeight = useHeaderHeight();
    const [docPre, setDocPre] = useState();
    const [useRole, setUseRole] = useState('user');
    // const tabBarHeight = useBottomTabBarHeight();
    const KEYBOARD_VERTICAL_OFFSET = headerHeight + StatusBar.currentHeight;

    const onRefresh = React.useCallback(() => {
        console.log('im here');
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
                            firestore().collection('chats').doc('reporters').update({ messages: firestore.FieldValue.arrayRemove(item) })
                            Alert.alert("Message Deleted")
                        },
                        style: 'destructive'
                    },
                    {
                        text: "Cancel",
                        style: "cancel",
                    },
                ],
                {
                    cancelable: true,
                }
            );
        }

    }
    //this function is used when we wanna send msg on the chat. first we check the the msg content exist in order the prevent from sending
    // empty msgs to the server.
    // after we verify that the msg is decent we update our data base with the new msgs
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
        set_loading_more(true);
        msgToLoad = msgToLoad + 20;
        firestore()
            .collection('chats')
            .doc(chat_id)
            .onSnapshot(doc => {
                if (!doc) return;

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
            });
        set_loading_more(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        if (auth().currentUser) {
            firestore()
                .collection('users')
                .doc(auth().currentUser.email)
                .get().then(doc => {
                    if (!doc) return;
                    let userDetails = doc.data();
                    setUser(userDetails);
                    setUseRole(doc.data().role);

                })
                .catch()
        }
        firestore()
            .collection('chats')
            .doc(chat_id)
            .onSnapshot(doc => {
                if (!doc) return;
                let reversed = doc.data().messages.reverse();
                if (reversed.length === 0) {
                    setDocPre(doc.data().premission);
                    return subscriber;
                }
                else {
                    set_chat_data(reversed.slice(0, msgToLoad));
                    setDocPre(doc.data().premission);
                }
            });
        return subscriber; // unsubscribe on unmount
    }, []);
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS == 'ios' ? "padding" : 'padding'}
            style={styles.main}
            keyboardVerticalOffset={Platform.OS == 'ios' ? KEYBOARD_VERTICAL_OFFSET : -(headerHeight + 0)} // tabBarHeight
        >
            <SafeAreaView style={{ flex: 0, backgroundColor: 'rgb(120,90,140)' }} />
            <View style={styles.main}>
                <FlatList
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
                />
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
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgb(200,200,220)',
    },
    headline: {
        padding: 15,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    inputContainer: {
        padding: 5,
        backgroundColor: 'rgb(180,180,200)',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'row',

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
        padding: 8,
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
    header: {
        width: '100%',
        height: Dimensions.get('screen').height / 12,
        backgroundColor: 'rgb(120,90,140)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#999',
        borderBottomWidth: 1,
        paddingLeft: 10,
        paddingRight: 10,
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

});

export default GenericChat;
