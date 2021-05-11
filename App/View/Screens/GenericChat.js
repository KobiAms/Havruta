import React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons'

let flag=false
ChatMessage=({item})=>{
    return (
        <View style ={styles.item}>
            <Text>
                {item.user_id}
            </Text>
            
            <Text>
                {item.message}
            </Text>

            <Text>
                {item.date.toDate().toString()}
            </Text>
        </View>
    )
}

GenericChat = ({ navigation, route }) => {
    const [newMessage,set_new_message]=useState("")
    const [chat_data,set_chat_data]=useState({})
    const feed_type = route.name
    const chat_id="example_chat_id"
    sendMessage=()=>{
        console.log(newMessage)
        set_new_message("")
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
            <FlatList style={styles.list} data={chat_data.messages} keyExtractor={(item,index)=>index}
                renderItem={({item})=><ChatMessage item={item}/>}/>
            <View style={styles.inputContainer}>    
                <TextInput placeholder="your message" style={styles.input} value={newMessage} 
                  onChangeText={set_new_message}/>

                <TouchableOpacity onPress={()=>sendMessage()} style={styles.sendButten}>
                    <Icon name={"md-send"} size={20} color={"#007fff"}/>
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
        fontSize: 20,
        fontWeight: 'bold',
        color: 'rgb(0,127,255)'
    },
    inputContainer:{
        padding:5,
        backgroundColor:"#999999",
        width:"100%",
        alignItems:"center",
        justifyContent:"space-between",
        flexDirection:'row',
    },
    input: {
        backgroundColor:"#ffffff",
        width:"85%",
        borderRadius:15,
        paddingLeft:5,
    },
    sendButten: {
        backgroundColor:"#ffffff",
        alignItems:"center",
        justifyContent:"center",
        width:"10%",
        borderRadius:10,
    },
    list:{
        
    }
});


export default GenericChat;