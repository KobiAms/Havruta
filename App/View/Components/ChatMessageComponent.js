import React from 'react'
import { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Hyperlink from 'react-native-hyperlink'



export default function ChatMessageComponent({ item }) {
    let date = item.date.toDate();
    const [name, setName] = useState("Loading...")
    const [imageUrl, setImageUrl] = useState(require('../../Assets/POWERPNT_frXVLHdxnI.png'))

    useEffect(() => {
        firestore().collection('users').doc(item.user_id).get()
            .then(doc => {
                let autorDetailes = doc.data();
                setName(autorDetailes.name)
                // if (autorDetailes.photo)
                //     setImageUrl({ uri: autorDetailes.photo })
            })
            .catch(error => {
                console.log('error loading comment details', error)
            })

    }, [])

    return (
        <View
            style={
                auth().currentUser && auth().currentUser.email === item.user_id
                    ? styles.myItemElement
                    : styles.ItemElement
            }>
            <View>
                <Image
                    style={styles.userPhoto}
                    source={imageUrl} />
            </View>
            <View
                style={
                    auth().currentUser && auth().currentUser.email === item.user_id
                        ? styles.myMessageBox
                        : styles.messageBox
                }>
                <Hyperlink linkDefault={true} linkStyle={{ color: '#2980b9' }}>
                    <Text style={styles.messageStyle}>{item.message}</Text>
                </Hyperlink>
                <View style={styles.messageDetails}>
                    <Text style={styles.userId}>{' ' + name + ' '}</Text>
                    <Text style={styles.date}>
                        {' ' +
                            date.getDate() +
                            '/' +
                            (date.getMonth() + 1) +
                            ' ' +
                            (date.getHours() + 3) +
                            ':' +
                            ('0' + date.getMinutes()).slice(-2) +
                            ' '}
                    </Text>
                </View>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({




    userId: {
        fontSize: 11,
        color: '#333333',
    },

    date: {
        fontSize: 11,
        color: '#333333',
    },
    messageBox: {
        margin: 5,
        padding: 5,
        backgroundColor: '#fff',
        borderColor: 'black',
        borderRadius: 15,
        alignSelf: 'flex-start',
        maxWidth: '83%',
    },
    myMessageBox: {
        margin: 5,
        padding: 5,
        backgroundColor: 'rgb(205,255,230)',
        borderColor: 'black',
        borderRadius: 15,
        alignSelf: 'flex-start',
        maxWidth: '83%',
        shadowColor: "#00f",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 5,

        elevation: 5,
    },
    ItemElement: {
        flexDirection: 'row',
        flex: 1,
        alignContent: 'flex-end',
        flexDirection: 'row-reverse',
    },
    myItemElement: {
        flexDirection: 'row',
        flex: 1,
        alignContent: 'flex-end',
    },
    messageStyle: {
        color: 'black',
        fontSize: 17,
        paddingLeft: 4,
    },
    userPhoto: {
        width: 30,
        height: 30,
        margin: 5,
        borderRadius: 15,
        overflow: "hidden"
    },
    messageDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
