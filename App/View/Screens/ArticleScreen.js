/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useCallback, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LogBox,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icons from 'react-native-vector-icons/Ionicons';
import { Avatar } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';

function ArticleScreen({ navigation, route }) {
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []); //enable to render a flatlist inside a scrollview
  let { autor, date, headline, comments, likes, contant } = route.params.data;
  const inputRef = useRef();
  const clearText = useCallback(() => {
    inputRef.current.setNativeProps({ text: '' });
  }, []); //use the clearText inorder to erase the content inside the comment text field

  const [comInput, setcomInput] = useState();
  return (
    <ScrollView style={styles.main}>
      <View
        style={styles.row} /** user info - icon, name and date of publish */
      >
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
      <Text style={styles.headline}>
        {headline}
        {'\n'}
      </Text>
      <Text>{contant}</Text>
      <View style={styles.line} />
      <View
        style={styles.response} /** displays the amount of likes and comments */
      >
        <TouchableOpacity style={styles.row}>
          <Icon name={'like1'} size={20} style={styles.pad} />
          <Text>likes: {likes.length}</Text>
        </TouchableOpacity>
        <Text>comments: {comments ? comments.length : 0}</Text>
      </View>
      <View style={styles.rower} /** text input to add new comment */>
        <AutoGrowingTextInput
          placeholder={'    Add your comment...'}
          style={styles.input}
          onChangeText={setcomInput}
          ref={inputRef}
        />
        <TouchableOpacity
          onPress={() => {
            console.log(comInput);
            clearText();
          }}>
          <Icons name={'send'} size={25} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={route.params.data.comments}
        renderItem={({ item }) => (
          <View style={styles.combox}>
            <Avatar
              size="small"
              rounded
              source={{
                uri:
                  'https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/03/GettyImages-1092658864_hero-1024x575.jpg',
              }}
            />
            <View style={styles.comment}>
              <Text style={styles.autor}>{item.user_name}</Text>
              <Text>{item.comment}</Text>
            </View>
          </View>
        )}
        keyExtractor={item => item.comKey}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignSelf: 'center',
    backgroundColor: 'rgb(220,220,240)',
    padding: 15,
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
  input: {
    width: '85%',
    height: 40,
    margin: 12,
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
  },
  rower: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  comment: {
    backgroundColor: 'rgb(210,210,230)',
    width: '87%',
    margin: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 18,
  },
  combox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'rgb(200,200,220)',
    borderRadius: 21,
    paddingVertical: 5,
    margin: 5,
  },
  line: {
    height: 1,
    margin: 10,
    backgroundColor: '#000000',
  },
});

export default ArticleScreen;
