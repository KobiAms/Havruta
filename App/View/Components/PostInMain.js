/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import IconIo from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import HTMLRend from 'react-native-render-html';
import firestore from '@react-native-firebase/firestore'

/**A component that display a short content on an article */
function PostInMain({ onPress, data }) {
    //const postData = data
    const postData = {
        date: '13.6.2021',
        headline: `<p>Headline on the life because it is very long</p>`,
        short: `<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>`
    };


    return (
        <TouchableWithoutFeedback onPress={() => console.log('replace me with "navigation.navigate("ArticleScreen", {data})"')} data={postData}>
            <View style={styles.main}>
                <Text>{postData.date}</Text>
                <HTMLRend
                    source={{ html: postData.headline }}
                    contentWidth={Dimensions.get('window').width}
                    baseFontStyle={{
                        fontSize: 22,
                        alignItems: 'flex-end',
                        fontWeight: 'bold',
                        textAlign: 'right',
                        color: '#333'
                    }}
                ></HTMLRend>
                <HTMLRend
                    source={{ html: postData.short }}
                    contentWidth={Dimensions.get('window').width}
                    baseFontStyle={{
                        textAlign: 'right', color: '#333'
                    }}
                    containerStyle={{ marginTop: -20 }}
                ></HTMLRend>
            </View>
        </TouchableWithoutFeedback >
    );
}

const styles = StyleSheet.create({
    main: {
        height: 300,
        width: 300,
        borderRadius: 5,
        alignSelf: 'center',
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 15,
        margin: 8,
        flex: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 1,
        shadowRadius: 3.27,
        elevation: 5,
    },
    headline: {
        fontSize: 22,
        alignItems: 'flex-end',
        fontWeight: 'bold',
        color: '#333'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    pad: {
        paddingRight: 5,
    },

});
export default PostInMain;