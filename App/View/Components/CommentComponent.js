import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Avatar } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons'
import { Alert } from 'react-native';



export default function CommentComponent({ data, art_id, isAdmin, deleteComment }) {
    // const [autorData, setAutorData] = useState(data)
    const [name, setName] = useState('Loading...')
    const [imageUrl, setImageUrl] = useState(require('../../Assets/POWERPNT_frXVLHdxnI.png'))



    useEffect(() => {
        firestore().collection('users').doc(data.user_id).get()
            .then(doc => {
                let autorDetailes = doc.data();
                setName(autorDetailes.name)
                if (autorDetailes.photo)
                    setImageUrl({ uri: autorDetailes.photo })
            })
            .catch(error => {
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
                    containerStyle={{ backgroundColor: 'rgb(140,150,180)' }}
                    onPress={() => { console.log(name) }}
                />
            </View>
            <View style={styles.comment}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.autor}>{name}</Text>
                    <Text>{timePassParser(data.timestamp.seconds)}</Text>
                </View>
                <View>
                    <Text>{data.comment}</Text>
                </View>
            </View>
            {isAdmin ?
                <TouchableOpacity onPress={deleteComment}>
                    <Icon name={'trash'} color={'#440000'} size={30} />
                </TouchableOpacity>
                : null}
        </View>
    )
}

const styles = StyleSheet.create({
    comment: {
        backgroundColor: 'rgb(210,210,230)',
        flex: 8,
        margin: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 18,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    autor: {
        fontWeight: 'bold',
    },
    combox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: 'rgb(200,200,220)',
        borderRadius: 21,
        paddingVertical: 5,
        padding: 5,
        margin: 10,
        marginTop: 3,
        marginBottom: 3
    },
})


function timePassParser(time) {
    let now = new Date();
    let diff = now - ((7200 + time) * 1000);
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