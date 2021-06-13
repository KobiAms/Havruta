/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Text, Image, View, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios'
import HTMLRend from 'react-native-render-html';

/**A component that display a short content on an article */
function PostInMain({ data }) {
    const postData = data
    const [imageUrl, setImageUrl] = useState()

    useEffect(() => {
        if (data.image_link) {
            const baseURL = data.image_link
            axios.create({ baseURL }).get().then(res => {
                console.log(res.status)
                if (res.data.guid.rendered[4] != '') {
                    setImageUrl(res.data.guid.rendered.substring(0, 4) + 's' + res.data.guid.rendered.substring(4, res.data.guid.rendered.length))
                } else {
                    setImageUrl(res.data.guid.rendered)
                }
            }).catch((error) => {
                console.log(error)
            })
        }
    }, [])


    return (
        <View style={styles.main}>
            <View style={{ justifyContent: 'space-between', height: '100%', minWidth: Dimensions.get('screen').width * 0.6, maxWidth: Dimensions.get('screen').width * 0.6, }}>
                <View style={styles.row}>
                    <View style={{ padding: 5, borderRadius: 10, backgroundColor: '#fffa', margin: 5 }}>
                        <Text style={{ color: '#0d5794' }}>{postData.date}</Text>
                    </View>
                </View>
                <View style={{ width: '100%', height: Dimensions.get('screen').height * 0.05, overflow: 'hidden', margin: 5, alignItems: 'flex-end' }}>
                    <HTMLRend
                        source={{ html: postData.headline }}
                        contentWidth={20}
                        baseFontStyle={{
                            fontSize: 15,
                            alignItems: 'flex-end',
                            fontWeight: 'bold',
                            textAlign: 'right',
                            alignItems: 'flex-start',
                            color: '#333',
                        }}
                        containerStyle={{ padding: 5, borderRadius: 10, backgroundColor: '#fffe', margin: 0 }}
                    >
                    </HTMLRend>
                </View>
            </View>
            <Image style={styles.backgroundImage} source={imageUrl ? { uri: imageUrl } : require('../../Assets/logo_stretch.png')} />
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        alignSelf: 'center',
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'center',
        height: Dimensions.get('screen').height * 0.12,
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
        padding: 5
    },
    response: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    pad: {
        paddingRight: 5,
    },
    backgroundImage: {
        height: Dimensions.get('screen').width * 0.23,
        width: Dimensions.get('screen').width * 0.35,
        resizeMode: 'stretch', // or 'stretch'
        alignSelf: 'center',
        borderRadius: 5,
    }
});
export default PostInMain;