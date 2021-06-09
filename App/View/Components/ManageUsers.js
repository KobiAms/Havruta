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
import firestore from '@react-native-firebase/firestore';
import IconAw from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/AntDesign';
import { SafeAreaView } from 'react-native';

/**Admin manage users screen. display a list of all the users and by chosing one you can manage it */
export default function ManageUsers({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [list_to_show, setShow] = useState(users);
  const [filter, setFilter] = useState();

  /**this useEffect gets all the data about the users onSnapshot - so it is updating upon new data in the database */
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

  /**An item that represent a user.
   * on the left side a color indicate the role of the user:
   * admin - green, reporters - blue, users- gray, blocked user - red  */
  function UserItem({ headline, color, onPress }) {
    return (
      <TouchableOpacity style={styles.item} onPress={onPress}>
        <IconAw style={styles.dot} name={'circle'} size={20} color={color} />
        <Text>{headline}</Text>
        <Icon2
          style={{}}
          name={'right'}
          size={20}
          color={'gray'}
        />
      </TouchableOpacity>
    );
  };

  /**render of the manage users screen */
  return (
    <View style={styles.main}>
      <SafeAreaView style={{ flex: 0, backgroundColor: '#0d5794' }} />
      <View style={styles.main}>
        <View style={styles.body}>
          <View style={styles.search_container}>
            <TextInput
              placeholder="חפש כאן"
              style={styles.search_box}
              onChangeText={text => {
                setShow(users.filter(item => item.name.toLowerCase().includes(text.toLowerCase())));
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
                data={[...list_to_show, 'end_list']}
                renderItem={({ item, index }) => {
                  if (index == list_to_show.length)
                    return <View style={{ height: 40, width: '100%' }}></View>
                  else
                    return (
                      <UserItem
                        headline={item.name}
                        color={item.color}
                        onPress={() => navigation.navigate('Manage User', { data: item })}
                      />
                    )
                }}
                keyExtractor={(item, idx) => idx}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f0fbff',
  },
  body: {
    height: '100%',
    width: '100%',
  },
  search_container: {
    width: '100%',
    height: 50,
    backgroundColor: '#a3cbe0',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    borderColor: '#999',
    borderBottomWidth: 1,
  },
  search_box: {
    width: '90%',
    height: '80%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10
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
    padding: 10,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 14,
    backgroundColor: '#fff',
    marginBottom: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 1,
  },
});