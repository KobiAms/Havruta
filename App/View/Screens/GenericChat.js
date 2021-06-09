import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat'
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
 


export function GenericChat() {
  user_id=auth().currentUser?auth().currentUser.email:auth().currentUser
  
  const [messages, setMessages] = useState([]);
  const [name , setName] = useState()

  auth().onAuthStateChanged(()=>{
    if(auth().currentUser){
      firestore()
     .collection('users')
     .doc(auth().currentUser.email)
     .get()
     .then(doc =>{
         let autorDetailes = doc.data();
         setName(autorDetailes ? autorDetailes.name : 'ghost')
     })
    }
  })
 
  useEffect(() => {

    const subscriber = firestore()
        .collection('chats')
        .doc('GiftedTest')
        .onSnapshot(doc=> {
            if(!doc) return;
            let reversed = doc.data().messages
            setMessages(reversed)
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
    if(user_id!=auth().currentUser.email){
      user_id=auth().currentUser.email
    }
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
        _id: user_id,
      }}
      inverted={false}
      renderInputToolbar={!auth().currentUser?() => null:null}
      renderUsernameOnMessage={true}
      showAvatarForEveryMessage={true}
      
      
    />
  )
}
 
export default GenericChat