import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native'
import { Avatar } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';

export default function CommentComponent({ data, navigation }) {
    // name of the name of the comment writer
    const [name, setName] = useState('Loading...')
    const [imageUrl, setImageUrl] = useState(require('../../Assets/logo.png'))
    const [publishID, setPublishID] = useState(data.user_id);

    function timePassParser(time) {
        let now = new Date();
        let diff = now - (time * 1000);
        if (diff < 0) return ('a while ago');
        if (diff < 1000) return (parseInt(diff) + ' milliseconds ago');
        diff /= 1000;
        if (diff < 60) return (parseInt(diff) + ' seconds ago');
        diff /= 60;
        if (diff < 60) return (parseInt(diff) + ' minutes ago');
        diff /= 60;
        if (diff < 24) return (parseInt(diff) + ' hours ago');
        diff /= 24;
        if (diff < 30) return (parseInt(diff) + ' days ago');
        diff /= 30;
        if (diff < 12) return (parseInt(diff) + ' months ago');
        diff /= 12;
        return (parseInt(diff) + ' years ago');
    }

    useEffect(() => {
        // get the comment writer data from firebase  
        firestore().collection('users').doc(publishID).get()
            .then(doc => {
                let autorDetailes = doc.data();
                setName(autorDetailes.name)
                // here you can render also the user image
            })
            .catch(error => {
                setName('error')
                console.log('error loading comment details', error)
            })
    }, [])

    return (

        <View style={styles.combox}>
            <View>
                <Avatar
                    size="small"
                    rounded
                    title={name[0]}
                    source={imageUrl}
                    containerStyle={{ backgroundColor: '#fff', marginLeft: 3, marginTop: 2 }}
                    onPress={() => { navigation.navigate('UserProfile', { data: publishID }) }}
                />
            </View>
            <View style={styles.comment}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableWithoutFeedback onPress={() => { navigation.navigate('UserProfile', { data: publishID }) }}>
                        <Text style={styles.autor}>{name}</Text>
                    </TouchableWithoutFeedback>
                    <Text>{timePassParser(data.timestamp.seconds)}</Text>
                </View>
                <View>
                    <Text>{data.comment}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    comment: {
        backgroundColor: '#eee',
        flex: 8,
        margin: 1,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 18,
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: 7,
    },
    autor: {
        fontWeight: 'bold',
    },
    combox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: '#ddd',
        borderRadius: 21,
        paddingVertical: 5,
        padding: 5,
        margin: 10,
        marginTop: 3,
        marginBottom: 3
    },
})

