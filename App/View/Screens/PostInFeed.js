/* eslint-disable prettier/prettier */
import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { Avatar } from 'react-native-elements';

function PostInFeed({ onPress, data }) {
  let { autor, date, headline, comments, likes, contant } = data;

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
        />
        <View>
          <Text style={styles.autor}>{autor}</Text>
          <Text>{date}</Text>
        </View>
      </View>

      <Text onPress={() => onPress()} data={data} style={styles.headline}>
        {headline}
        {'\n'}
      </Text>
      <Text onPress={() => onPress()} data={data}>
        {contant}
      </Text>
      <View style={styles.line} />
      <View style={styles.response}>
        <TouchableOpacity style={styles.row}>
          <Icon name={'like1'} size={20} style={styles.pad} />
          <Text>likes: {likes.length}</Text>
        </TouchableOpacity>
        <Text onPress={() => onPress()} data={data}>
          comments: {comments ? comments.length : 0}
        </Text>
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
    marginVertical: 5,
    flex: 1,
    minWidth: '100%',
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
