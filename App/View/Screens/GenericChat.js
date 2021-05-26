import React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput,ActivityIndicator,TouchableOpacity , RefreshControl, Image, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import { resolvePreset } from '@babel/core';



let msgToLoad = 15
let msgToStart = 0
let endReached=false;
let flag = false

const ListFooterComponent = ()=>{
    return(
        <ActivityIndicator size="large" color="rainbow" />
    )
}
//this function dicompose the doc of the coplete chat into small object where as any object represent one msg item inside our chat
//
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
    const [loadingMore,set_loading_more] = useState(false);
    let flat_list_ref
    const feed_type = route.name
    const chat_id ="test"
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        console.log("im here")
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
     }, []);

    //this function is used when we wanna send msg on the chat. first we check the the msg content exist in order the prevent from sending 
    // empty msgs to the server.
    // after we verify that the msg is decent we update our data base with the new msgs
    sendMessage = () => {

        let tempMessage = {user_id: user.email,user_nick: user.name, message: newMessage, date: new Date()}
        setNewMessage("")
        if (!tempMessage.message.replace(/\s/g, '').length || !auth().currentUser) {
            setNewMessage("")
        }
        else {
            firestore().collection('chats').doc('reporters').update({
                messages: firestore.FieldValue.arrayUnion(tempMessage)
            }).catch(error => {
                console.log(error.toString())
            })
        }

    }

    function onAuthStateChanged(user) {
        setUser(user);
      }
      // we call that function on reaching to the end of the screen 
      // this function updates the displayed msgs list.
      // we read all the chat list from the chat and we slice it into the amount of messages we want to see.
    function loadMore(chat_data) {
        set_loading_more(true)
        msgToLoad=msgToLoad+7
        firestore().collection('chats').doc('reporters')
        .onSnapshot(doc => {
            if (!doc)
                return;
            
            
            let reversed = doc.data().messages.reverse()
            if(reversed.length < msgToLoad)
            {
                endReached=true
                set_chat_data(reversed.slice(msgToStart,reversed.length))
            }else{
                set_chat_data(reversed.slice(msgToStart,msgToLoad))
            }
            console.log(chat_data.length)
            if(chat_data.length === doc.data().messages.length){
                endReached=true
            }
        })
        set_loading_more(false)
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
                
                <FlatList style={styles.list} inverted data={chat_data}  onEndReachedThreshold={0.2} onEndReached={()=> loadMore(chat_data)}  ref={ref => flat_list_ref = ref} keyExtractor={(item, index) => index}
                    ListFooterComponent={()=>!endReached && <ListFooterComponent/>} renderItem={({ item }) => <ChatMessage item={item} 
                    refreshControl={
                        <RefreshControl
                          refreshing={refreshing}
                          onRefresh={onRefresh}
                        />}/>}/>
                {user?  <View style={styles.inputContainer}>
                    <TextInput placeholder="הכנס את ההודעה.." style={styles.input} value={newMessage}
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
        backgroundColor: "lightblue",
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