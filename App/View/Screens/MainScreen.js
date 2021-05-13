import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'
import axios from 'axios'
import { useState } from 'react';
import { useEffect } from 'react';

let baseURL = 'https://havruta.org.il/wp-json'

MainScreen = ({ navigation, route }) => {
    const feed_type = route.name

    api = axios.create({baseURL});
    const[news, setNews] = useState([]);
    
    getArticles = async ()=> {

        let articles = await api.get('/wp/v2/posts');
        setNews(articles);
        console.log(articles);
    } 
    useEffect(()=> {

        getArticles();
    }, [])
    
    return (
        <View style={styles.main}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.register}>
                    <Icon name={'user-alt'} size={20} />
                </TouchableOpacity>
                <Text style={styles.screen_title}>
                    Havruta
                </Text>
                <View style={[styles.register, { backgroundColor: 'rgba(0,0,0,0)' }]}>

                </View>
            </View>
            <Text style={styles.headline}>
                {feed_type}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        width: '100%',
        height: '13%',
        backgroundColor: 'purple',
        position: 'absolute',
        top: '0%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingTop: 30
    },
    screen_title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'rgb(255,255,255)'
    },
    headline: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'rgb(0,127,255)',
    },
    register: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center'
    }
});


export default MainScreen;