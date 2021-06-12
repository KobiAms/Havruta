import React, { useState } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import HTMLRend from 'react-native-render-html';


/**the first element in every article screen. this component displays the article from wordpress */
export default function FullArticleComponent({ data }) {

    return (
        <View>
            <View style={[styles.row, { padding: 10 }]} /** user info - icon, name and date of publish */>
                <View>
                    <Text>{data.date}</Text>
                    <HTMLRend
                        source={{ html: data.headline }}
                        contentWidth={Dimensions.get('screen').width * (95 / 100)}
                        baseFontStyle={{
                            fontSize: 22,
                            alignItems: 'flex-end',
                            textAlign: 'right',
                            fontWeight: 'bold',
                            color: '#333'
                        }}
                    ></HTMLRend>
                    <HTMLRend
                        source={{ html: data.content }}
                        contentWidth={Dimensions.get('screen').width * (95 / 100)}
                        tagsStyles={{ h5: { fontSize: 17, } }}
                        baseFontStyle={{
                            textAlign: 'right', color: '#333'
                        }}
                    ></HTMLRend>
                </View>
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    headline: {
        fontSize: 22,
        alignItems: 'flex-end',
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
    },
    response: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    pad: {
        paddingRight: 5,
    },
    input: {
        width: Dimensions.get('screen').width * (85 / 100),
        height: 40,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#aaa',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 3,
        padding: 7
    },
    new_comment_box: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        paddingHorizontal: Dimensions.get('screen').width / 3
    },
})