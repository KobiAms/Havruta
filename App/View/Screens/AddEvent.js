import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Dimensions, StyleSheet, TouchableWithoutFeedback, Keyboard, TextInput, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler';
import SwitchSelector from "react-native-switch-selector";


function AddEvent({ navigation, route }) {
    const existChat = route.params.data
    const [chatName, setChatName] = useState();
    const [premission, setPremission] = useState();

    function add_chat_to_FB(name, premission) {     //a function to create new chat
        let id = name;
        for (let i = 0; i < existChat.length; i++)  // make sure first that the id is unique
            if (id == existChat[i].id)
                id = makeid(10);                    //if it does not generate new random one


        firestore().collection('chats').doc(id).set({
            messages: [{
                user_id: 'admin@test.com',
                message: 'Welcome to Havruta! plese keep respectfull language',
                date: new Date(),
            }],
            name: name,
            premission: premission,
        }).then(() => navigation.goBack()).catch(err => console.log(err))
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

    function fillAllFields() {      //alert function in case there is name or premission missing
        Alert.alert(
            "Please fill all the fields",
            "ok?", [{ text: "OK", style: "cancel" }],
            { cancelable: true }
        );
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.main}>
                <View style={{ margin: 10, alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', margin: 10 }}>
                        Please chose the new chat name
                    </Text>
                    <TextInput
                        style={styles.editable}
                        value={chatName}
                        onChangeText={setChatName}
                        placeholder={'Add your about here...'} />
                </View>
                <View style={{ margin: 10, alignItems: 'center' }}>
                    <Text>Who can send messages in this chat?</Text>
                    <SwitchSelector
                        options={[
                            { label: 'All useres', value: 'user' },
                            { label: 'Authorized only', value: 'reporter' },
                            { label: 'Admin only', value: 'admin' }
                        ]}
                        textColor={'#000'}
                        onPress={value => setPremission(value)}
                        hasPadding
                        buttonColor={'rgb(40,120,190)'}
                        style={{ margin: 10, width: Dimensions.get('screen').width * (85 / 100), }}
                    />
                </View>

                <TouchableOpacity
                    style={styles.submit}
                    onPress={() => {
                        chatName && premission ? add_chat_to_FB(chatName, premission) : fillAllFields()
                    }
                    }>
                    <Text style={{ fontSize: 22, color: '#fff', fontWeight: 'bold' }}>Submit</Text>
                </TouchableOpacity>
            </View >
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    main: {
        justifyContent: 'space-evenly',
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgb(200,200,220)',
        padding: 15
    },
    editable: {
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
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
    submit: {
        backgroundColor: 'rgb(40,120,190)',
        width: Dimensions.get('screen').width * (85 / 100),
        alignItems: 'center',
        borderRadius: 50,
        height: 12 + Dimensions.get('screen').width / 10,
        margin: Dimensions.get('screen').width / 10,
        justifyContent: 'center',
    }
})

export default AddEvent;