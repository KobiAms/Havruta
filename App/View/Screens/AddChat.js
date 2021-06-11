import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, TouchableWithoutFeedback, Keyboard, TextInput, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import SwitchSelector from "react-native-switch-selector";
import { launchImageLibrary } from 'react-native-image-picker';
import { Image } from 'react-native';
import { ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';

function AddChat({ navigation, route }) {
    const existChat = route.params.data
    const [chatName, setChatName] = useState();
    const [imageUrl, setImageUrl] = useState();
    const [premission, setPremission] = useState();
    const [loading, setLoading] = useState(false);

    function choose_photo() {
        // lunching the camera roll / gallery
        launchImageLibrary({ maxWidth: 300, maxHeight: 200 }, async response => {
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
                setImageUrl(response.uri)
            }
        });
    }

    // this function create new chat at firestore and upload image if selected
    async function add_chat_to_FB(name, premission) {     //a function to create new chat
        // if is in middle of action dont do anything
        if (loading) {
            return
        }
        setLoading(true)
        // generates new chaat id from the name
        let id = makeid(20);                    //if it does not generate new random one

        // if image is selected image url is define
        if (imageUrl) {
            // create storage ref
            const reference = storage().ref('/chats/' + id + '/' + 'chat_photo.png');
            // upload image and wait till it ends
            await reference.putFile(imageUrl);
            // get the url of the photo we just upload
            reference.getDownloadURL().then(url => {
                // save the new chat data into the chats collection
                firestore().collection('chats').doc(id).set({
                    messages: [{
                        _id: 1,
                        text: 'ברוכים הבאים לצ\'אט של חברותא! נא לשמור על שפה נאותה ותרבות דיון',
                        createdAt: String(new Date()),
                        user: {
                            _id: auth().currentUser.email,
                            name: 'מנהל'
                        }
                    }],
                    imageUrl: url,
                    name: name,
                    premission: premission,
                })
                    // go back to all chats
                    .then(() => navigation.goBack())
                    .catch(err => console.log(err))
            })
        } else {
            // if image is not selected, upload only the chat Initialize to firestore
            firestore().collection('chats').doc(id).set({
                messages: [{
                    _id: 1,
                    text: 'ברוכים הבאים לצ\'אט של חברותא! נא לשמור על שפה נאותה ותרבות דיון',
                    createdAt: String(new Date()),
                    user: {
                        _id: auth().currentUser.email,
                        name: 'מנהל'
                    }
                }],
                name: name,
                premission: premission,
            })
                .then(() => navigation.goBack()).catch(err => console.log(err))
        }

    }

    //function to generate random chat id incase that the id is already in use.
    function makeid(length) {
        var result = [];
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result.push(characters.charAt(Math.floor(Math.random() *
                charactersLength)));
        }
        return result.join('');
    }
    //alert function in case there is name or premission missing
    function fillAllFields() {
        Alert.alert(
            "Some Data are missing",
            "Please fill all the fields\nbefore creating a chat", [{ text: "OK", style: "cancel" }],
            { cancelable: true }
        );
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.main}>
                <TouchableOpacity onPress={() => choose_photo()} style={styles.image_container}>
                    <Image style={styles.chat_image} source={imageUrl ? { uri: imageUrl } : require('../../Assets/logo.png')} />
                </TouchableOpacity>
                <View style={{ margin: 10, alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', margin: 10 }}>
                        אנא בחר את שם הצ'אט החדש
                    </Text>
                    <TextInput
                        style={styles.editable}
                        value={chatName}
                        onChangeText={setChatName}
                        placeholder={`  הזן שם צ'אט...    `} />
                </View>
                <View style={{ margin: 10, alignItems: 'center' }}>
                    <Text>מי יכול לשלוח הודעות בצ'אט הזה?</Text>
                    <SwitchSelector
                        options={[
                            { label: 'כל המשתמשים', value: 'user' },
                            { label: 'כתבים', value: 'reporter' },
                            { label: 'מנהלים בלבד', value: 'admin' }
                        ]}
                        textColor={'#000'}
                        onPress={value => setPremission(value)}
                        hasPadding
                        buttonColor={'#0d5794'}
                        style={{ margin: 10, width: Dimensions.get('screen').width * (85 / 100), }}
                    />
                </View>
                {
                    loading ?
                        <ActivityIndicator color={'#0d5794'} size={'small'} />
                        :
                        <TouchableOpacity
                            style={styles.submit}
                            onPress={() => {
                                chatName && premission ? add_chat_to_FB(chatName, premission) : fillAllFields()
                            }
                            }>
                            <Text style={{ fontSize: 22, color: '#fff', fontWeight: 'bold' }}>צור את הצ'אט</Text>
                        </TouchableOpacity>
                }

            </View >
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    main: {
        justifyContent: 'space-evenly',
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f2f2f3',
        padding: 15
    },
    editable: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#aaa',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 3,
        padding: 7
    },
    submit: {
        backgroundColor: '#0d5794',
        width: Dimensions.get('screen').width * (85 / 100),
        alignItems: 'center',
        borderRadius: 50,
        height: 12 + Dimensions.get('screen').width / 10,
        margin: Dimensions.get('screen').width / 10,
        justifyContent: 'center',
    },
    chat_image: {
        height: 100,
        width: 100,
        backgroundColor: '#fff'
    },
    image_container: {
        height: 100,
        width: 100,
        borderRadius: 50,
        overflow: 'hidden',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 6,
    }
})

export default AddChat;