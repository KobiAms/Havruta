import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import {
    View,
    StyleSheet,
    FlatList,
    TextInput,
    ActivityIndicator,
    Pressable,
    TouchableOpacity,
    RefreshControl,
    Dimensions,
    Alert,
    Image,
    Platform,
    StatusBar,
    KeyboardAvoidingView,
    SafeAreaView
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
 
user_id=auth().currentUser?auth().currentUser.email:NULL
 
 
export function GenericChat() {
  const [messages, setMessages] = useState([]);
  const [name , setName] = useState()
 
  useEffect(() => {
    const subscriber = firestore()
        .collection('chats')
        .doc('GiftedTest')
        .onSnapshot(doc=> {
            if(!doc) return;
            let reversed = doc.data().messages
            setMessages(reversed)
            console.log(auth().currentUser)
     }) 
    
    if(!auth().currentUser){
        return subscriber
    }
     firestore()
     .collection('users')
     .doc(auth().currentUser.email)
     .get()
     .then(doc =>{
         let autorDetailes = doc.data();
         setName(autorDetailes ? autorDetailes.name : 'ghost')
     })
     return subscriber
  }, [])
 
  const onSend = useCallback((message = []) => {
    console.log(message[0].user._id)
    
    console.log(name)
    let tempMsg = {
        _id:message[0]._id,
        text:message[0].text,
        createdAt :String(new Date()),
        user:{
            _id:user_id,
            name:name
        }
    }
    console.log(tempMsg)
    
    firestore()
    .collection('chats')
    .doc('GiftedTest')
    .update({
        messages : firestore.FieldValue.arrayUnion(tempMsg)
    })
  }, )
 
  return (
    <GiftedChat
      messages={messages}
      onSend={message => onSend(message)}
      user={{
        _id: name,
      }}
      inverted={false}
    />
  )
}
 
export default GenericChat