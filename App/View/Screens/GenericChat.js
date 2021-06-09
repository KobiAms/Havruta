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
  const [user,setUser]=useState(auth().currentUser)
  function onAuthStateChanged(user_state) { // listener to every change of the user id and updates the details about that new user that logged
   setUser()
    if (user_state) {
        firestore().collection('users').doc(user_state.email).get()
            .then(doc => {
                if (!doc.data()) {
                    setUser(undefined)
                } else {
                    const user_tmp = doc.data()
                    setUser(user_tmp); // here we pull all the data about our user
                    setName(doc.data().name) // getting the name of the current user
                  
                }
            })
            .catch(err => {
                console.log(err)
                setUser(undefined)
            })
    } else {
        setUser(user_state);
    }
}
useEffect(() => {
    auth().onAuthStateChanged(onAuthStateChanged);
}, []);
 
  useEffect(() => { // we pull all the messages array from the data base and then using our hook to that file so we can preview it

    const subscriber = firestore()
        .collection('chats')
        .doc('GiftedTest')
        .onSnapshot(doc=> {
            if(!doc) return;
            let reversed = doc.data().messages
            setMessages(reversed)
     }) 
    
    if(!auth().currentUser){ // this section is about pulling the user display name if theres no users we skip on that part
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
 
  const onSend = useCallback((message = []) => { // that function happes when somone sends a msg on the chat
    console.log(message[0].user._id)             // in that function we build the stracture of the message we want to send to the server
                                                 //after we built the message object we send it with query to firebase
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
      
      renderInputToolbar={!auth().currentUser?() => null:null}
      renderUsernameOnMessage={true}
      showAvatarForEveryMessage={true}
      
      
    />
  )
}
 
export default GenericChat