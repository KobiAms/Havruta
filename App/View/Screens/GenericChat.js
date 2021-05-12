import React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';




let flag=false
ChatMessage=({item})=>{
    let date = item.date.toDate()
    return (
        <View style={styles.userIdDate}>
        <View>
            <Image style={styles.userPhoto} source={{uri: 'https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-contact-512.png'}}>

            </Image> 
        </View>
        <View style ={styles.item}>
            <Text style={styles.messageStyle}>
                {item.message}
            </Text>
            <View style = {styles.userIdDate}>
            <Text style={styles.userId}>
                {" " + item.user_id + " "}
            </Text>
            <Text style={styles.date}>
                {" "+(date.getDate()) + '/' + (date.getMonth()+1) + '/' + date.getFullYear()+" "+date.getHours()+":"+("0" + (date.getMinutes())).slice(-2)+" "}
            </Text>
            </View>
        </View>
        </View>
    )
}

GenericChat = ({ navigation, route }) => {
    const [newMessage,setNewMessage]=useState("")
    const [chat_data,set_chat_data]=useState({})
    let flat_list_ref
    const feed_type = route.name
    const chat_id="example_chat_id"
    sendMessage=()=>{
        let tempMessage = {user_id:"test@test.com" , message:newMessage , date:new Date()}
        console.log(tempMessage)
        firestore().collection('chats').doc('example_chat_id').update({
            messages:firestore.FieldValue.arrayUnion(tempMessage)
        }).then(()=>{
            setNewMessage("")
        }).catch(error=>{
            console.log(error.toString())
        })
    }
    useEffect(() => {
        //
        if (flag==false){
            flag=true
            firestore().collection('chats').doc('example_chat_id')
                .onSnapshot(doc => {
                    if (!doc)
                        return;
                    set_chat_data(doc.data())
                })
            
        }
    }, [])
    
    return (
        <View style={styles.main}>
            <View style ={styles.header}>
                <Text style={styles.headline}>
                {chat_id}
                </Text>
            </View>
            <FlatList style={styles.list} data={chat_data.messages} ref = {ref => flat_list_ref=ref}keyExtractor={(item,index)=>index }
                renderItem={({item})=><ChatMessage item={item}/>}/>
            <View style={styles.inputContainer}>    
                <TextInput placeholder="your message.." style={styles.input} value={newMessage}
                  onChangeText={setNewMessage}/>

                <TouchableOpacity onPress={()=>sendMessage()} style={newMessage.length == 0 ? styles.sendButtonEmpty:styles.sendButtonFull}>
                    <Icon name={"md-send"} size={20} color={"#ffffff"}/>
                </TouchableOpacity>  
            </View>       
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
        padding:15,
        fontSize: 20,
        fontWeight: 'bold',
        color: "#fff"
    },
    inputContainer:{
        padding:2,
        backgroundColor:"#999999",
        width:"100%",
        alignItems:"center",
        justifyContent:"space-evenly",
        flexDirection:'row',
    },
    input: {
        borderColor:"black",
        borderWidth:1,
        backgroundColor:"#ffffff",
        width:"88%",
        borderRadius:30,
        paddingLeft:15,
        height:"75%",
    },
    sendButtonEmpty: {
        padding:8,
        backgroundColor:"#555555",
        alignItems:"center",
        justifyContent:"center",
        borderRadius:100,
    },
    sendButtonFull: {
        padding:8,
        backgroundColor:"#007fff",
        alignItems:"center",
        justifyContent:"center",
        borderRadius:100,
    },
    header: {
        width:"100%",
        backgroundColor:"purple",
        alignItems:"center",
        justifyContent:"center",
    },
    list:{
        backgroundColor:"white",
        width:"100%",
    },
    userId:{
        fontSize:16,
        fontWeight:'bold'
    },
    messageDate:{

    },
    date:{
        fontSize:16,
    },
    item:{
        margin:5,
        paddingLeft:5,
        backgroundColor:"dodgerblue",
        borderColor:"black",
        borderWidth:1,
        borderRadius:7,
        alignSelf:'flex-start',
        maxWidth: "83%",
        
    },
    userIdDate:{
        flexDirection:'row',
        flex:1,
        alignContent:'flex-end'
    },
    messageStyle:{
        color:"white",
        fontSize: 17.5
    }, 
    userPhoto:{
        width:50,
        height:50,
        borderRadius:25,
    }

});


export default GenericChat;