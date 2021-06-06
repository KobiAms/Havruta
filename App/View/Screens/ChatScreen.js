import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Dimensions, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Chat from '../Components/ChatItem';
import { TouchableOpacity } from 'react-native-gesture-handler';
import IconIo from 'react-native-vector-icons/Ionicons';

function ChatScreen({ navigation, route }) {
    const [chats, setChats] = useState([])
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const subscriber = firestore()
            .collection('users')
            .doc(auth().currentUser.email)
            .get().then(doc => {
                if (!doc) return;
                if (doc.data().role === 'admin') setIsAdmin(true);
            })
            .catch(err => console.log(err.code))
        return subscriber;
    }, []);

    useEffect(() => {
        let chatNames = []
        const subscriber = firestore()
            .collection('chats')
            .onSnapshot(que => {
                que.forEach(doc => {
                    let obj = { id: doc.id, name: doc.data().name };
                    chatNames.push(obj);
                });
                setChats(chatNames);
            });

        return subscriber;
    }, [])


    return (
        <View style={styles.main}>

            <FlatList
                scrollIndicatorInsets={{ right: 1 }}
                style={styles.list}
                data={[...chats, 'end_list']}
                renderItem={({ item, index }) => {
                    if (index == chats.length)
                        return <View style={{ height: 40, width: '100%' }}></View>
                    else
                        return (
                            <Chat
                                id={item.name}
                                onPress={() =>
                                    navigation.navigate('GenericChat', { id: item.id, data: item })
                                }
                            />
                        )
                }}
                keyExtractor={(item, idx) => idx}
            />
            {isAdmin ?
                <TouchableOpacity style={styles.add} onPress={() => navigation.navigate('AddChat', { data: chats })}>
                    <IconIo name={'add-circle'} color={'rgb(120,90,140)'} size={65} />
                </TouchableOpacity> : null}
        </View>
    );
}
const styles = StyleSheet.create({
    main: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'rgb(220,220,240)',
    },
    list: {
        height: '100%',
        width: '100%',

    },
    add: {
        borderRadius: Dimensions.get('screen').height / 3,
        position: 'relative',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        bottom: 0,
        zIndex: 1,
        margin: 20,
    },
});

export default ChatScreen;