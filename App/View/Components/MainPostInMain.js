/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Text, Image, View, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios'
import HTMLRend from 'react-native-render-html';

/**A component that display a short content on an article */
function MainPostInMain({ data }) {
    const postData = data
    const [imageUrl, setImageUrl] = useState()

    useEffect(() => {
        if (data.image_link) {
            const baseURL = data.image_link
            const subscriber = axios.create({ baseURL }).get().then(res => {
                if (res.data.guid.rendered[4] != '') {
                    setImageUrl(res.data.guid.rendered.substring(0, 4) + 's' + res.data.guid.rendered.substring(4, res.data.guid.rendered.length))
                } else {
                    setImageUrl(res.data.guid.rendered)
                }
            }).catch((error) => {
                console.log(error)
            })
            return subscriber
        }
    }, [])


    return (
        <TouchableWithoutFeedback>
            <View style={styles.main}>
                <Image style={styles.backgroundImage} source={imageUrl ? { uri: imageUrl } : require('../../Assets/logo_stretch.png')} />
                <View style={{ backgroundColor: '#fffe', padding: 10, width: '30%', borderBottomRightRadius: 15, alignItems: 'center' }}>
                    <Text style={{ color: '#0d5794', fontWeight: '400' }}>{postData.date}</Text>
                </View>
                <HTMLRend
                    source={{ html: postData.headline }}
                    baseFontStyle={{
                        fontSize: 22,
                        alignItems: 'flex-end',
                        fontWeight: 'bold',
                        textAlign: 'right',
                        color: '#333',
                    }}
                    containerStyle={{ padding: 5, backgroundColor: '#fffe', margin: 0 }}
                >
                </HTMLRend>
            </View>
        </TouchableWithoutFeedback >
    );
}

const styles = StyleSheet.create({
    main: {
        alignSelf: 'center',
        backgroundColor: '#fff',
        justifyContent: 'center',
        height: Dimensions.get('screen').height * 0.30,
        margin: 2,
        flex: 1,
        resizeMode: 'cover',
        width: '97%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 1,
        shadowRadius: 3.27,
        elevation: 5,
        justifyContent: 'space-between'
    },
    headline: {
        fontSize: 22,
        alignItems: 'flex-end',
        fontWeight: 'bold',
        color: '#333'
    },
    autor: {
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    response: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    pad: {
        paddingRight: 5,
    },
    line: {
        height: 1,
        margin: 10,
        marginBottom: 17,
        backgroundColor: '#cfcfcf',
    },
    backgroundImage: {
        height: '100%',
        width: '100%',
        resizeMode: 'stretch', // or 'stretch'
        position: 'absolute',
        alignSelf: 'center',
        borderRadius: 5,
    }
});
export default MainPostInMain;