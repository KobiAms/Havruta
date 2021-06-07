import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon2 from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';

function ChatItem({ id, onPress, lastCom }) {
    const [lastMessage, setlastMessage] = useState('');
    const [lastSender, setlastSender] = useState('');
    const [lastSenderName, setLastSenderName] = useState('');

    useEffect(() => {
        if (lastCom) {
            setlastMessage(lastCom.message)
            setlastSender(lastCom.user_id)
        }
        if (lastMessage.length > 35) {
            setlastMessage(lastMessage.substring(0, 35).concat("..."));
        }
        console.log("message " + lastMessage)
        console.log("sender " + lastSender)
        firestore().collection('users').doc(lastSender).get()
            .then(doc => {
                setLastSenderName(doc.data().name)
            })
            .catch(err => console.log(err.code))
    }, [])

    return (
        <TouchableOpacity style={styles.main} onPress={onPress} >
            <View style={styles.aview}>
                <Image></Image>
            </View>
            <View style={{ width: '70%' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{id}</Text>
                <Text style={{ color: '#666' }}>{lastSenderName}: {lastMessage}</Text>
            </View>
            <Icon2
                style={styles.arrow_right}
                name={'right'}
                size={20}
                color={'gray'}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    main: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        width: Dimensions.get('window').width,
        //height: Dimensions.get('window').height / 14,
        backgroundColor: 'rgb(250,250,255)',
        // marginBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: 'rgb(220,220,255)',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },
    aview: {
        alignSelf: 'center',
        height: Dimensions.get('screen').width / 10,
        width: Dimensions.get('screen').width / 10,
        borderRadius: Dimensions.get('screen').width / 1.5,
        backgroundColor: 'rgb(200,200,220)',
        borderColor: '#999',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
});
export default ChatItem;