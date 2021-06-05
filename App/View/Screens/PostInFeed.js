/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import IconF from 'react-native-vector-icons/Fontisto';
import auth from '@react-native-firebase/auth';
import { TouchableWithoutFeedback } from 'react-native';
import HTMLRend from 'react-native-render-html';
import { Dimensions } from 'react-native';

function PostInFeed({ onPress, data, isAdmin }) {
  const [postData, setPostData] = useState(data)
  const [isLiked, setIsLiked] = useState(auth().currentUser ? data.likes.includes(auth().currentUser.email) : false)

  return (
    <TouchableWithoutFeedback onPress={() => onPress()} data={postData}>
      <View style={styles.main}>
        <View style={styles.row}>
          <View>
            {/* <Text style={styles.autor}>{postData.autor}</Text> */}
            <Text>{postData.date}</Text>
          </View>
          {
            isAdmin ?
              <TouchableOpacity>
                <IconF name={data.lock ? 'locked' : 'unlocked'} color={data.lock ? 'red' : 'green'} size={20} />
              </TouchableOpacity>
              :
              null
          }
        </View>
        <HTMLRend
          source={{ html: postData.headline }}
          contentWidth={Dimensions.get('window').width}
          baseFontStyle={{
            fontSize: 22,
            alignItems: 'flex-end',
            fontWeight: 'bold',
          }}
        ></HTMLRend>
        <HTMLRend
          source={{ html: postData.short }}
          contentWidth={Dimensions.get('window').width}
        ></HTMLRend>
        {
          postData.full ?
            <View>
              <View style={styles.line} />
              <View style={styles.response}>
                <View style={styles.row}>
                  <Icon name={'like1'} size={20} style={styles.pad} color={isLiked ? 'rgb(120,90,140)' : '#000'} />
                  <Text style={{ color: isLiked ? 'rgb(120,90,140)' : '#000' }}>likes: {postData.likes.length}</Text>
                </View>
                <Text >
                  comments: {postData.comments ? postData.comments.length : 0}
                </Text>
              </View>
            </View>
            : null
        }
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  main: {
    borderRadius: 5,
    alignSelf: 'center',
    backgroundColor: 'rgb(220,220,240)',
    justifyContent: 'center',
    padding: 10,
    margin: 5,
    flex: 1,
    minWidth: '97%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 3.27,

    elevation: 10,
  },
  headline: {
    fontSize: 22,
    alignItems: 'flex-end',
    fontWeight: 'bold',
  },
  autor: {
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
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
    backgroundColor: '#000000',
  },
});

export default PostInFeed;
