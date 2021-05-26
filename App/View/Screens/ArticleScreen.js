/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useCallback, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LogBox,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icons from 'react-native-vector-icons/Ionicons';
import IconFAW5 from 'react-native-vector-icons/FontAwesome5';
import { Avatar } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';


function timePassParser(time) {
  let now = new Date();
  let diff = now - ((7200 + time) * 1000);
  if (diff < 0) return ('a while ago');
  if (diff < 1000) return (parseInt(diff) + ' milliseconds ago');
  diff /= 1000;
  if (diff < 60) return (parseInt(diff) + ' seconds ago');
  diff /= 60;
  if (diff < 60) return (parseInt(diff) + ' minutes ago');
  diff /= 60;
  if (diff < 24) return (parseInt(diff) + ' hours ago');
  diff /= 24;
  if (diff < 30) return (parseInt(diff) + ' days ago');
  diff /= 30;
  if (diff < 12) return (parseInt(diff) + ' months ago');
  diff /= 12;
  return (parseInt(diff) + ' years ago');
}

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
    <ScrollView style={{ backgroundColor: 'rgb(220,220,240)' }}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.back_button}
          onPress={() => navigation.goBack()}>
          <IconFAW5 name={'arrow-left'} size={20} />
        </TouchableOpacity>
        <Text style={styles.screen_title}>Havruta</Text>
        <View
          style={[styles.back_button, { backgroundColor: 'rgba(0,0,0)' }]}></View>
      </View>
      <ScrollView style={styles.main}>
        <View
          style={styles.row} /** user info - icon, name and date of publish */
        >
          {/* <Avatar
          size="small"
          rounded
          source={{
            uri:
              'https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/03/GettyImages-1092658864_hero-1024x575.jpg',
          }}
        /> */}
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
                title={item.user_name[0]}
                containerStyle={{ backgroundColor: 'rgb(140,150,180)' }}
                onPress={() => { console.log(item.user_name) }}
              />
              <View style={styles.comment}>
                <View>
                  <Text style={styles.autor}>{item.user_name}</Text>
                  <Text>{item.comment}</Text>
                </View>
                <View>
                  <Text>{timePassParser(item.timestamp.seconds)}</Text>
                </View>
              </View>
            </View>
          )}
          keyExtractor={item => item.comKey}
        />
      </ScrollView>
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
  header: {
    width: '100%',
    height: Dimensions.get('screen').height / 10,
    backgroundColor: 'rgb(120,90,140)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#999',
    borderBottomWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },
  screen_title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgb(255,255,255)',
  },
  back_button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between'
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
