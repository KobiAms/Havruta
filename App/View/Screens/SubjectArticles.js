/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {ScrollView, Text, StyleSheet, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import PostInFeed from './PostInFeed';
import artiTest from './test/articles.json';

function SubjectArticles({navigation, route}) {
  const feed_type = route.name;
  const [articles, setArticles] = useState();
  return (
    <View style={styles.main}>
      <FlatList
        data={artiTest}
        renderItem={({item}) => (
          <PostInFeed
            onPress={() => navigation.navigate('ArticleScreen', {data: item})}
            data={item}
          />
        )}
        keyExtractor={item => item.id}></FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headline: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgb(0,127,255)',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    textAlign: 'center',
  },
});

export default SubjectArticles;
