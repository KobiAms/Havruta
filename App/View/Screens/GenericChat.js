import React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import { resolvePreset } from '@babel/core';



let msgToLoad = 10
let flag = false
ChatMessage = ({ item }) => {
    let date = item.date.toDate()
    return (
        <View style={auth().currentUser && (auth().currentUser.email === item.user_id)? styles.myItemElement:styles.ItemElement}>
            <View>
                <Image style={styles.userPhoto} source={{ uri: 'https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-contact-512.png' }}>

                </Image>
            </View>
            <View style={auth().currentUser && (auth().currentUser.email === item.user_id)? styles.myMessageBox:styles.messageBox}>
                <Text style={styles.messageStyle}>
                    {item.message}
                </Text>
                <View style={styles.messageDetails}>
                    <Text style={styles.userId}>
                        {" " + item.user_nick + " "}
                    </Text>
                    <Text style={styles.date}>
                        {" " + (date.getDate()) + '/' + (date.getMonth() + 1) + " " + date.getHours() + ":" + ("0" + (date.getMinutes())).slice(-2) + " "}
                    </Text>
                </View>
            </View>
        </View>
    )
}

GenericChat = ({ navigation, route }) => {
    const [newMessage, setNewMessage] = useState("")
    const [chat_data, set_chat_data] = useState({})
    const [user, setUser] = useState();
    const [chat_name , set_chat_name] =useState(""); 
    let flat_list_ref
    const feed_type = route.name
    const chat_id ="test"
    sendMessage = () => {

        let tempMessage = {user_id: user.email,user_nick: user.name, message: newMessage, date: new Date()}
        if (!tempMessage.message.replace(/\s/g, '').length || !auth().currentUser) {
            setNewMessage("")
        }
        else {
            firestore().collection('chats').doc('reporters').update({
                messages: firestore.FieldValue.arrayUnion(tempMessage)
            }).then(() => {
                setNewMessage("")
            }).catch(error => {
                console.log(error.toString())
            })
        }

    }

    function onAuthStateChanged(user) {
        setUser(user);
        //if (initializing) setInitializing(false);
      }

    
    useEffect(() => {
        //
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
            if(auth().currentUser){
                firestore().collection('users').doc(auth().currentUser.email).onSnapshot(email => {
                    let userDetails = email.data()
                    setUser(userDetails)
                })
                    
            } 
            firestore().collection('chats').doc('reporters')
                .onSnapshot(doc => {
                    if (!doc)
                        return;
                    
                    let reversed = doc.data().messages.reverse()
                    set_chat_data(reversed.slice(0,msgToLoad))

                })

         return subscriber; // unsubscribe on unmount
        
    }, [])
        return (
            <View style={styles.main}>
                <View style={styles.header}>
                    <Text style={styles.headline}>
                        {chat_id}
                    </Text>
                </View>
                <FlatList style={styles.list} inverted data={chat_data} onEndReachedThreshold={0.5}  ref={ref => flat_list_ref = ref} keyExtractor={(item, index) => index}
                    renderItem={({ item }) => <ChatMessage item={item} />} />
                {user?  <View style={styles.inputContainer}>
                    <TextInput placeholder="הכנס את ההודעה.." style={styles.input} onEndReachedThreshold ={100} value={newMessage}
                        onChangeText={setNewMessage} />
                    <TouchableOpacity onPress={() => sendMessage()} style={newMessage.length == 0 ? styles.sendButtonEmpty : styles.sendButtonFull}>
                        <Icon name={"md-send"} size={20} color={"#ffffff"} />
                    </TouchableOpacity>
                </View>:null}
            </View>
        )
    
    
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'center',
    },
    headline: {
        padding: 15,
        fontSize: 20,
        fontWeight: 'bold',
        color: "#fff"
    },
    inputContainer: {
        padding: 2,
        backgroundColor: "#999999",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-evenly",
        flexDirection: 'row',
    },
    input: {
        borderColor: "black",
        borderWidth: 1,
        backgroundColor: "#ffffff",
        width: "88%",
        borderRadius: 30,
        paddingLeft: 15,
        height: "75%",
    },
    sendButtonEmpty: {
        padding: 8,
        backgroundColor: "#555555",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 100,
    },
    sendButtonFull: {
        padding: 8,
        backgroundColor: "#007fff",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 100,
    },
    header: {
        width: "100%",
        backgroundColor: "purple",
        alignItems: "center",
        justifyContent: "center",
    },
    list: {
        backgroundColor: "white",
        flex: 1
    },
    userId: {
        fontSize: 11,
       
    },

    date: {
        fontSize: 11,
    },
    messageBox: {
        margin: 5,
        paddingLeft: 5,
        backgroundColor: "rgb(200,200,220)",
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 7,
        alignSelf: 'flex-start',
        maxWidth: "83%",
        


    },
    myMessageBox: {
        margin: 5,
        paddingLeft: 5,
        backgroundColor: "rgb(200,240,240)",
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 7,
        alignSelf: 'flex-start',
        maxWidth: "83%",
        


    },
    ItemElement: {
        flexDirection: 'row',
        flex: 1,
        alignContent: 'flex-end',
        flexDirection:'row-reverse'


    },
    myItemElement:{
        flexDirection: 'row',
        flex: 1,
        alignContent: 'flex-end'

    },
    messageStyle: {
        color: "black",
        fontSize: 17,
        paddingLeft:4
    },
    userPhoto: {
        
        width: 40,
        height: 40,
        borderRadius: 25,
    },
    messageDetails: {
        flexDirection: 'row',
        justifyContent: "space-between"
    }

});


export default GenericChat;