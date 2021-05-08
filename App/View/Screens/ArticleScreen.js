/* eslint-disable prettier/prettier */
import React, {useEffect} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LogBox,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icons from 'react-native-vector-icons/Ionicons';
import {Avatar} from 'react-native-elements';
import {FlatList} from 'react-native-gesture-handler';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';

function ArticleScreen({navigation, route}) {
  const feed_type = route.name;
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);
  let {autor, date, headline, comments, likes, contant} = route.params.data;
  return (
    <ScrollView style={styles.main}>
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
      <Text style={styles.headline}>
        {headline}
        {'\n'}
      </Text>
      <Text>{contant}</Text>
      <Text style={styles.main}>
        ______________________________________________________{'\n'}
      </Text>
      <View style={styles.response}>
        <TouchableOpacity style={styles.row}>
          <Icon name={'like1'} size={20} style={styles.pad} />
          <Text>likes: {likes.length}</Text>
        </TouchableOpacity>
        <Text>comments: {comments.length}</Text>
      </View>
      <View style={styles.rower}>
        <AutoGrowingTextInput
          placeholder={'    Add your comment...'}
          style={styles.input}
        />
        <TouchableOpacity>
          <Icons name={'send'} size={25} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={route.params.data.comments}
        renderItem={({item}) => (
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
              <Text style={styles.autor}>{item.user}</Text>
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
});

export default ArticleScreen;
