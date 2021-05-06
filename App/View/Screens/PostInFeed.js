/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {Avatar} from 'react-native-elements';

function PostInFeed({onPress, data}) {
  let {autor, date, headline, comments, likes, contant} = data;

  return (
    <View style={styles.main}>
      <View style={styles.row}>
        <Avatar
          size="small"
          rounded
          source={{
            uri:
              'https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/03/GettyImages-1092658864_hero-1024x575.jpg',
          }}
          onPress={() => console.log('Works!')}
          backgroundColor={'rgb(0,255,0)'}
        />
        <View>
          <Text style={styles.autor}>{autor}</Text>
          <Text>{date}</Text>
        </View>
      </View>
      <Text style={styles.headline}>
        {headline}
        {'\n'}
      </Text>
      <Text onPress={() => onPress()}>{contant}</Text>
      <Text style={styles.main}>
        ______________________________________________________{'\n'}
      </Text>
      <View style={styles.response}>
        <TouchableOpacity>
          <Text>likes: {likes.length}</Text>
          <Icon name={'like1'} />
        </TouchableOpacity>
        <Text>comments: {comments.length}</Text>
      </View>
    </View>
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
  },
  response: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default PostInFeed;
