import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import Icon from 'react-native-vector-icons/AntDesign';
import IconIos from 'react-native-vector-icons/Ionicons';
import HTMLRend from 'react-native-render-html';
import auth from '@react-native-firebase/auth'

/**the first element in every article screen. this component displays the article from wordpress */
export default function FullArticleComponent({ data, extraData, addComment, likeUpdate }) {
    const [commentInput, setCommentInput] = useState('')

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
            {
                extraData && !extraData.lock ?
                    <View>
                        <View style={styles.line} />
                        <View
                            style={[styles.response, { padding: 15, paddingTop: 5, paddingBottom: 5 }]} /** displays the amount of likes and comments */
                        >
                            <TouchableOpacity
                                style={styles.row}
                                onPress={auth().currentUser ? () => likeUpdate() : null}>
                                <Icon name={'like1'} size={20} style={styles.pad} color={auth().currentUser && extraData.likes.includes(auth().currentUser.email) ? '#2e98c5' : '#333'} />
                                <Text style={{ color: auth().currentUser && extraData.likes.includes(auth().currentUser.email) ? '#2e98c5' : '#333' }}>likes: {extraData.likes.length}</Text>
                            </TouchableOpacity>
                            <Text style={{ color: '#333' }}>comments: {extraData.comments ? extraData.comments.length : 0}</Text>
                        </View>
                        <View style={styles.new_comment_box} /** text input to add new comment */>
                            <AutoGrowingTextInput
                                placeholder={auth().currentUser ? 'Add your comment...' : 'comments avilable to register users only'}
                                style={[styles.input, auth().currentUser ? null : { backgroundColor: '#ddd' }]}
                                multiline
                                onChangeText={setCommentInput}
                                value={commentInput}
                                returnKeyType={'send'}
                                editable={auth().currentUser ? true : false}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    if (commentInput.length == 0)
                                        return;
                                    addComment(commentInput)
                                    setCommentInput('')
                                }}
                                style={{ marginLeft: 10, }}
                            >
                                <IconIos name={'send'} size={25} color={'#2e98c5'} />
                            </TouchableOpacity>
                        </View>
                    </View> : null}
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
    line: {
        height: 1,
        margin: 10,
        marginBottom: 17,
        backgroundColor: '#cfcfcf',
    },
})