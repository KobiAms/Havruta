import React from 'react'
import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import Icon from 'react-native-vector-icons/AntDesign';
import IconIos from 'react-native-vector-icons/Ionicons';

export default function FullArticleComponent({ data, addComment, likeUpdate, isLiked, likes }) {
    const [commentInput, setCommentInput] = useState('')
    return (
        <View>
            <View
                style={[styles.row, { padding: 10 }]} /** user info - icon, name and date of publish */>
                <View>
                    <Text style={{ fontWeight: 'bold' }}>{data.autor}</Text>
                    <Text>{data.date}</Text>
                    <Text style={styles.headline}>
                        {data.headline}
                        {'\n'}
                    </Text>
                    <Text>{data.contant}</Text>
                </View>
            </View>
            <View style={styles.line} />
            <View
                style={[styles.response, { padding: 15, paddingTop: 5, paddingBottom: 5 }]} /** displays the amount of likes and comments */
            >
                <TouchableOpacity style={styles.row} onPress={() => likeUpdate()}>
                    <Icon name={isLiked ? 'dislike1' : 'like1'} size={20} style={styles.pad} color={isLiked ? 'rgb(120,90,140)' : '#000'} />
                    <Text style={{ color: isLiked ? 'rgb(120,90,140)' : '#000' }}>likes: {likes.length}</Text>
                </TouchableOpacity>
                <Text>comments: {data.comments ? data.comments.length : 0}</Text>
            </View>
            <View style={styles.new_comment_box} /** text input to add new comment */>
                <AutoGrowingTextInput
                    placeholder={'Add your comment...'}
                    style={styles.input}
                    onChangeText={setCommentInput}
                    value={commentInput}
                />
                <TouchableOpacity
                    onPress={() => {
                        if (commentInput.length == 0)
                            return;
                        addComment(commentInput)
                        setCommentInput('')
                    }}
                    style={{ marginLeft: 10 }}
                >
                    <IconIos name={'send'} size={25} />
                </TouchableOpacity>
            </View>
        </View>
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
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 6,
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
        backgroundColor: '#000000',
    },
})