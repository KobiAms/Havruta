import React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';



GenericChat = ({ navigation, route }) => {
    useState
    const feed_type = route.name



    useEffect(() => {
        // 
        firestore().collection('chats').doc('example_chat_id')
            .onSnapshot(doc => {
                if (!doc)
                    return;
                console.log(doc.data())
            })
    }, [])

    return (
        <View style={styles.main}>
            <Text style={styles.headline}>
                {feed_type}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    headline: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'rgb(0,127,255)'
    }
});


export default GenericChat;