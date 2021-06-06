/* eslint-disable semi */
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  FlatList,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'




const strings = ['kobi', 'zohar', 'oded', 'alice', 'bensgi'];


function MainScreen({ navigation, route }) {
  const [category_1, setCategory_1] = useState([...strings, ...strings])
  const [category_2, setCategory_2] = useState([...strings, ...strings])
  const [category_3, setCategory_3] = useState([...strings, ...strings])
  const [category_4, setCategory_4] = useState([...strings, ...strings])
  const [category_5, setCategory_5] = useState([...strings, ...strings])

  return (
    <View style={styles.main}>
      <ScrollView style={styles.main}>
        <View style={styles.category_title_container}>
          <Text style={styles.category_title_text}>Category one</Text>
        </View>
        <FlatList
          data={category_1}
          horizontal={true}
          renderItem={({ item }) => (
            <View style={{ padding: 20, backgroundColor: 'gold', margin: 5, height: 300, width: 300 }}>
              <Text>{item}</Text>
            </View>
          )}
          keyExtractor={(item, idx) => idx}
        />
        <View style={styles.category_title_container}>
          <Text style={styles.category_title_text}>Category Two</Text>
        </View>
        <FlatList
          data={category_2}
          horizontal={true}
          renderItem={({ item }) => (
            <View style={{ padding: 20, backgroundColor: 'gold', margin: 5, height: 300, width: 300 }}>

              <Text>{item}</Text>
            </View>
          )}
          keyExtractor={(item, idx) => idx}
        />
        <View style={styles.category_title_container}>
          <Text style={styles.category_title_text}>Category Three</Text>
        </View>
        <FlatList
          data={category_3}
          horizontal={true}
          renderItem={({ item }) => (
            <View style={{ padding: 20, backgroundColor: 'gold', margin: 5, height: 300, width: 300 }}>

              <Text>{item}</Text>
            </View>
          )}
          keyExtractor={(item, idx) => idx}
        />
        <View style={styles.category_title_container}>
          <Text style={styles.category_title_text}>Category four</Text>
        </View>
        <FlatList
          data={category_4}
          horizontal={true}
          renderItem={({ item }) => (
            <View style={{ padding: 20, backgroundColor: 'gold', margin: 5, height: 300, width: 300 }}>

              <Text>{item}</Text>
            </View>
          )}
          keyExtractor={(item, idx) => idx}
        />
        <View style={styles.category_title_container}>
          <Text style={styles.category_title_text}>Category five</Text>
        </View>
        <FlatList
          data={category_5}
          horizontal={true}
          renderItem={({ item }) => (
            <View style={{ padding: 20, backgroundColor: 'gold', margin: 5, height: 300, width: 300 }}>

              <Text>{item}</Text>
            </View>
          )}
          keyExtractor={(item, idx) => idx}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  category_title_container: {
    padding: 10,
    width: '100%',
  },
  category_title_text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgb(120,90,140)'
  }
});

export default MainScreen;
