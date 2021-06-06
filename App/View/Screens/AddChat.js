import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Dimensions, StyleSheet, TouchableWithoutFeedback, Keyboard, TextInput } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Chat from '../Components/ChatItem';
import { TouchableOpacity } from 'react-native-gesture-handler';
import IconIo from 'react-native-vector-icons/Ionicons';
import SwitchSelector from "react-native-switch-selector";




function AddChat({ navigation, route }) {
    const [chatName, setChatName] = useState();
    const [premission, setPremission] = useState();
    function add_chat_to_FB(name, premission) {
        firestore().collection('chats').doc(name).set({
            messages: [{
                user_id: 'admin@test.com',
                message: 'Welcome to Havruta! plese keep respectfull langaued',
                date: new Date(),
            }],
            name: name,
            premission: premission,

        }).then(() => navigation.goBack()).catch(err => console.log(err))
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
                        // initial={0}
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
                        chatName && premission ? add_chat_to_FB(chatName, premission) : console.log('fill al the fields')
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

export default AddChat;