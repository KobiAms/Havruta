import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  TextInput,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import IconAw from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/AntDesign';
import { SafeAreaView } from 'react-native';

export default ManageUsers = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [list_to_show, setShow] = useState(users);
  const [filter, setFilter] = useState();

  useEffect(() => {
    firestore()
      .collection('users')
      .onSnapshot(querySnapshot => {
        const users = [];
        if (!querySnapshot) return;
        querySnapshot.forEach(documentSnapshot => {
          let colorTmp;
          if (documentSnapshot.data().role == 'admin') {
            colorTmp = '#15B525';
          } else if (documentSnapshot.data().role == 'user') {
            colorTmp = '#666666';
          } else if (documentSnapshot.data().role == 'reporter') {
            colorTmp = '#007fff';
          } else {
            colorTmp = '#f00'
          }
          users.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
            color: colorTmp,
          });
        });
        setUsers(users);
        setShow(users);
        setLoading(false);
      });
  }, []);

  UserItem = ({ headline, color, onPress }) => {
    return (
      <TouchableOpacity style={styles.item} onPress={onPress}>
        <IconAw style={styles.dot} name={'circle'} size={16} color={color} />
        <Text>{headline}</Text>
        <Icon2
          style={styles.arrow_right}
          name={'right'}
          size={20}
          color={'gray'}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.main}>
      <SafeAreaView style={{ flex: 0, backgroundColor: 'rgb(120,90,140)' }} />
      <SafeAreaView style={styles.main}>
        <View style={styles.body}>
          <View style={styles.search_container}>
            <TextInput
              placeholder="Search Here"
              style={styles.search_box}
              onChangeText={text => {
                setShow(
                  users.filter(item =>
                    item.name.toLowerCase().includes(text.toLowerCase()),
                  ),
                );
                setFilter(text);
              }}
              value={filter}
            />
          </View>
          <View style={styles.list_container}>
            {loading ? (
              <ActivityIndicator size="large" color="dodgerblue" />
            ) : (
              <FlatList
                style={styles.list}
                data={list_to_show}
                renderItem={({ item }) => (
                  <UserItem
                    headline={item.name}
                    color={item.color}
                    onPress={() =>
                      navigation.navigate('Manage User', { data: item })
                    }
                  />
                )}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    height: '10%',
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
  headline: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'rgb(0,127,255)',
  },
  back_button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    height: '100%',
    width: '100%',
  },
  search_container: {
    width: '100%',
    // height: Dimensions.get('screen').height / 16,
    height: 50,
    backgroundColor: 'rgba(180,180,200, 1)',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    borderColor: '#999',
    borderBottomWidth: 1,
  },
  search_box: {
    width: '90%',
    height: '80%',
    backgroundColor: 'rgba(238, 238, 238, 1)',
    borderRadius: 15,
    paddingLeft: 10,
  },
  search_button: {
    height: '80%',
    width: Dimensions.get('screen').width * 0.11,
    backgroundColor: 'rgba(238, 238, 238, 1)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 10,
    backgroundColor: 'rgb(230,230,250)',
    marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,

    elevation: 2,
  },
});
