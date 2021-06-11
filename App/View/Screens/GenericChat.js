import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react'
import {
    GiftedChat, Bubble, Actions
} from 'react-native-gifted-chat'
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import { Platform, Keyboard, Pressable, View } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import { launchImageLibrary } from 'react-native-image-picker';



export function GenericChat({ navigation, route }) {
    let user_id = auth().currentUser ? auth().currentUser.email : auth().currentUser
    if (!(route.params && route.params.id)) {
        return new Error('Error: chat id must be received by the route')
    }
    const chat_id = route.params.id;

    const [userRole, setUserRole] = useState();
    const [permission, setPermission] = useState();
    const [messages, setMessages] = useState([]);
    const [name, setName] = useState()
    const [user, setUser] = useState(auth().currentUser)
    const [loading, setLoading] = useState(false)

    function onAuthStateChanged(user_state) { // listener to every change of the user id and updates the details about that new user that logged
        setUser()
        setUserRole()
        if (user_state) {
            firestore().collection('users').doc(user_state.email).get()
                .then(doc => {
                    refreshChat()
                    if (!doc.data()) {
                        setUser(undefined)
                    } else {
                        const user_tmp = doc.data()
                        setUser(user_tmp); // here we pull all the data about our user
                        setName(doc.data().name) // getting the name of the current user
                        setUserRole(doc.data().role)
                        console.log("text:" + userRole)

                    }
                })
                .catch(err => {
                    refreshChat()
                    console.log(err)
                    setUser(undefined)
                })
        } else {
            refreshChat()
            setUser(user_state);
        }
    }
    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber
    }, []);

    //chaged
    useLayoutEffect(() => {
        navigation.setOptions({
            title: route.params.chat_name,
        });
    }, [navigation])

    function refreshChat() {
        firestore()
            .collection('chats')
            .doc(chat_id)
            .get()
            .then(doc => {
                if (!doc) return;
                let reversed = doc.data().messages.reverse()
                setMessages(reversed)

            }).catch((err) => {
                console.log(err)
            })
    }
    useEffect(() => { // we pull all the messages array from the data base and then using our hook to that file so we can preview it

        const subscriber = firestore()
            .collection('chats')
            .doc(chat_id)
            .onSnapshot(doc => {
                if (!doc) return;
                let reversed = doc.data().messages.reverse()
                setMessages(reversed)
                setPermission(doc.data().premission)

            })
        return subscriber
    }, []);

    function onLongPress(context, message) { // onlongpress function we have 2 methods of action first we check if the user is logged in
        console.log(message)              // if theres no user logged we dont show any menu on the other hand we divided between the actions
        if (!auth().currentUser)           // that users can do and admins can do. users can delete their own messages and admins can delete any message
        {
            return
        }
        if (message.user._id === auth().currentUser.email || userRole === 'admin') {
            const options = ['Copy', 'Delete Message', 'Cancel'];
            const cancelButtonIndex = options.length - 1;
            context.actionSheet().showActionSheetWithOptions({
                options,
                cancelButtonIndex
            }, (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        Clipboard.setString(message.text);
                        break;
                    case 1:
                        firestore().collection('chats').doc(chat_id).update({
                            messages: firestore.FieldValue.arrayRemove(message),
                            images: firestore.FieldValue.arrayRemove(image_ref)
                        })
                        if (message.image_ref) {
                            storage().ref(message.image_ref).delete().catch(console.log)
                        }
                        break;
                }
            });
        }
        else { // in case the msg is not one of the current user he cannot delete them
            const options = ['Copy', 'Cancel'];
            const cancelButtonIndex = options.length - 1;
            context.actionSheet().showActionSheetWithOptions({
                options,
                cancelButtonIndex
            }, (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        Clipboard.setString(message.text);
                        break;
                }
            });
        }
    };

    const onSend = useCallback((message = []) => { // that function happes when somone sends a msg on the chat
        // in that function we build the stracture of the message we want to send to the server
        //after we built the message object we send it with query to firebase
        let tempMsg = {
            _id: message[0]._id,
            text: message[0].text,
            createdAt: String(new Date()),
            // image:imageUri,
            user: {
                _id: user_id,
                name: name

            }
        }
        firestore()
            .collection('chats')
            .doc(chat_id)
            .update({
                messages: firestore.FieldValue.arrayUnion(tempMsg)
            })
    });

    renderBubble = (props) => { // in that function we choose colors for the chat bubbles
        return (
            <Bubble
                {...props}

                wrapperStyle={{
                    right: {
                        backgroundColor: "#A4A4A4",

                    },
                    left: {
                        backgroundColor: "#B7ECFD",

                    }
                }}
            />
        )
    }

    function makeid(length) {  //function to generate random chat id incase that the id is already in use.
        var result = [];
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result.push(characters.charAt(Math.floor(Math.random() *
                charactersLength)));
        }
        return result.join('');
    }

    handlePickImage = () => {
        launchImageLibrary({ maxWidth: 600, maxHeight: 400 }, async response => {
            if (response.didCancel) {
                return
            } else if (response.error) {
                Alert.alert(
                    'Error',
                    response.errorCode + ': ' + response.errorMessage,
                    [{ text: 'OK' }],
                    { cancelable: false },
                );

            } else {
                const image_ref = '/chats/' + chat_id + '/' + auth().currentUser.email + '_' + makeid(20);
                const reference = storage().ref(image_ref);
                setLoading(true)
                await reference.putFile(response.uri);
                reference.getDownloadURL().then(url => {
                    // in that function we build the stracture of the message we want to send to the server
                    //after we built the message object we send it with query to firebase
                    let tempMsg = {
                        _id: makeid(20),
                        text: '',
                        createdAt: String(new Date()),
                        image: url,
                        image_ref: image_ref,
                        user: {
                            _id: user_id,
                            name: name
                        }
                    }
                    firestore()
                        .collection('chats')
                        .doc(chat_id)
                        .update({
                            messages: firestore.FieldValue.arrayUnion(tempMsg),
                            images: firestore.FieldValue.arrayUnion(image_ref)
                        }).then(() => {
                            setLoading(false);
                        })
                });
            }
        });
    }

    function renderActions(props) { // this function occures when the camera icon is being pressed
        return (                    // we open the menu with the options
            <Actions
                {...props}
                options={{
                    ['Send Image']: handlePickImage,
                    ['Cancel']: () => { },
                }}
                icon={() => (
                    <Icon size={28} name={'camera'} color={"#00254d"} />
                )}
                onSend={args => console.log(args)}
            />
        )
    }


    return (
        <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                onSend={message => onSend(message)}
                user={{
                    _id: user_id,
                }}
                inverted={true}
                showUserAvatar={true}
                renderAvatar={null}
                renderInputToolbar={(route.params.show_input === false || !auth().currentUser || (permission != 'user' && userRole === 'user') || (permission === 'admin' && userRole != 'admin')) ? () => <View style={{ height: 0 }} /> : null}
                renderUsernameOnMessage={true}
                renderAvatarOnTop={true}
                onLongPress={(context, message) => onLongPress(context, message)}
                isTyping={true}
                scrollToBottom={true}
                renderActions={renderActions}
            />
        </Pressable>
    )
}

export default GenericChat

