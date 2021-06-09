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
 


export function GenericChat({navigation,route}) {
  user_id=auth().currentUser?auth().currentUser.email:auth().currentUser
  const chat_id = route.name == 'Reporters' ? 'reporters' : route.params.id;
  const [userRole, setUserRole] = useState();
  const [docName , setDocName] = useState();
  const [permission , setPermission] = useState();
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
                    setUserRole(doc.data().role)
                    console.log("text:"+userRole)
                  
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
        .doc(chat_id)
        .onSnapshot(doc=> {
            if(!doc) return;
            let reversed = doc.data().messages
            setMessages(reversed)
            setDocName(doc.data().name)
            setPermission(doc.data().premission)
            
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
         setUserRole(doc.data().role)
     })
     return subscriber
  }, [])
 
  const onSend = useCallback((message = []) => { // that function happes when somone sends a msg on the chat
                                                 // in that function we build the stracture of the message we want to send to the server
                                                 //after we built the message object we send it with query to firebase
    let tempMsg = {
        _id:message[0]._id,
        text:message[0].text,
        createdAt :String(new Date()),
        user:{
            _id:user_id,
            name:name
        }
    }
    
    firestore()
    .collection('chats')
    .doc(chat_id)
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
      renderInputToolbar={(!auth().currentUser|| (permission!='user' && userRole==='user') || (permission==='admin' && userRole!='admin'))?() => null:null}
      renderUsernameOnMessage={true}
      showAvatarForEveryMessage={true}
      renderAvatarOnTop={true}
      
      
    />
  )
}
 
export default GenericChat