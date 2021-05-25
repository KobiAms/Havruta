/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
  Image,
  TextInput,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import IconFeather from 'react-native-vector-icons/Feather';
import IconFAW5 from 'react-native-vector-icons/FontAwesome5';
import IconAnt from 'react-native-vector-icons/AntDesign';
import { launchImageLibrary } from 'react-native-image-picker';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';

export default function UserForm({ setUser, navigation, setLoading }) {
  const [userRole, setUserRole] = useState();
  const [defaultStyle, setDefaultStyle] = useState(true);
  const [userName, setuserName] = useState('');
  const [userDOB, setuserDOB] = useState();
  const [userAbout, setUserAbout] = useState();
  const [userAvatar, setUserAvatar] = useState();
  const [editable, setEditable] = useState(false);
  const [editName, setEditName] = useState();
  const [editDate, setEditDate] = useState();
  const [editAbout, setEditAbout] = useState();


  // this function upload the avatar image into the storage
  function uploadNewAvatar() {
    // lunching the camera roll / gallery
    launchImageLibrary({}, async response => {
      setLoading(true);
      if (response.didCancel) {
        setLoading(false);
      } else if (response.error) {
        Alert.alert(
          'Error',
          response.errorCode + ': ' + response.errorMessage,
          [{ text: 'OK' }],
          { cancelable: false },
        );
        setLoading(false);
      } else {
        const reference = storage().ref(
          '/users/' + auth().currentUser.email + '/' + 'user_image.png',
        );
        await reference.putFile(response.uri);
        reference.getDownloadURL().then(url => {
          setUserAvatar({ uri: url });
          setLoading(false);
        });
      }
    });
  }
  /** function activated by pressing the edit icon. allow changes in the user name, date of birth, about */
  function setToEditable() {
    if (editable) {
      setEditable(false);
    } else {
      setEditName(userName);
      setEditDate(userDOB);
      setEditAbout(userAbout);
      setEditable(true);
    }
  }

  useEffect(() => {
    setLoading(true);
    const subscriber = firestore()
      .collection('users')
      .doc(auth().currentUser.email)
      .get()
      .then(doc => {
        if (!doc.data()) {
          return;
        }
        setUserAbout(doc.data().about);
        setUserRole(doc.data().role);
        const reference = storage().ref(
          '/users/' + auth().currentUser.email + '/' + 'user_image.png',
        );
        reference
          .getDownloadURL()
          .then(url => {
            //console.log(url);
            setUserAvatar({ uri: url });
            setLoading(false);
          })
          .catch(() => {
            setUserAvatar(require('../../Assets/POWERPNT_frXVLHdxnI.png'));
            setLoading(false);
          });
        doc.data().role === 'user' ? setDefaultStyle(!defaultStyle) : null;
        let DAT = new Date((7200 + doc.data().dob.seconds) * 1000);
        /*//times go by sec GMT, so in order to get the right date, need to add 2 hours and mult by 1000 in nanosec*/
        let DAT_parse =
          DAT.getDate() + '.' + (DAT.getMonth() + 1) + '.' + DAT.getFullYear();
        setuserDOB(DAT_parse);
        setuserName(doc.data().name);
      })
      .catch(() => { });
    return subscriber;
  }, [setUserAbout, setUserRole, setDefaultStyle, setuserName, setuserDOB]);

  return (
    <View style={styles.main}>
      <View style={styles.backline} >
        <TouchableOpacity onPress={() => { setToEditable(); }}>
          {editable ?
            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
              <IconFeather
                name={'check-square'}
                color={'#008800'}
                size={18}
                style={{ margin: 5 }} />
              <Text>Click to save changes</Text>
            </View>
            :
            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
              <IconFAW5
                name={'edit'}
                color={'#000000'}
                size={18}
                style={{ margin: 5 }} />
              <Text>Click to edit</Text>
            </View>}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.aview} onPress={() => uploadNewAvatar()}>
        {
          userAvatar ?
            <Image source={userAvatar} style={{ width: '100%', height: '100%' }} />
            :
            <ActivityIndicator color={'#007fff'} size={'large'} />
        }
      </TouchableOpacity>
      <View style={styles.row}>
        {
          editable ?
            <TextInput
              style={[styles.name, styles.editable]}
              value={editName}
              onChangeText={setEditName} />
            :
            <Text style={styles.name}>{userName}</Text>
        }
      </View>
      <View style={styles.row}>
        <Text style={{ margin: 5 }}>Date of Birth:</Text>
        {
          editable ?
            <TextInput
              style={[styles.editable, { fontSize: 18 }]}
              value={editDate}
              onChangeText={setEditDate} />
            :
            <Text style={{ fontSize: 18 }}>{userDOB}</Text>
        }
      </View>
      <View style={{ padding: 20 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 21 }}>About Me:</Text>
        {
          editable ?
            <AutoGrowingTextInput
              style={[styles.editable, { fontSize: 17 }]}
              value={editAbout}
              onChangeText={setEditAbout} />
            :
            <Text style={{ fontSize: 17 }}>{userAbout}</Text>
        }
      </View>

      {/*the following view contain the logout / manage users buttons*/}
      <View style={styles.chose}>
        {userRole && userRole == 'admin' ? (
          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate('Manage Users')}>
            <Text style={{ color: '#000000', fontSize: 20 }}>Manage Users</Text>
            <IconFAW5 name={'user-cog'} color={'#666666'} size={20} />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={styles.option}
          onPress={() =>
            auth()
              .signOut()
              .then(() => setUser(auth().currentUser))
          }>
          <Text style={{ color: '#ff0000', fontSize: 20 }}>Log Out</Text>
          <IconFeather name={'log-out'} color={'#ff0000'} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'rgb(200,200,220)',
  },
  row: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  name: {
    fontSize: 34,
    fontWeight: 'bold',
    margin: 5,
  },
  editable: {
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
    padding: -4,
  },
  chose: {
    alignItems: 'flex-end',
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  option: {
    flex: 1,
    backgroundColor: 'rgb(240,240,255)',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 15,
    borderWidth: 1,
  },
  backline: {
    backgroundColor: 'rgb(160,160,200)',
    height: Dimensions.get('screen').height / 10,
    marginBottom: -Dimensions.get('screen').height / 15,
    justifyContent: "flex-start"

  },
  aview: {
    alignSelf: 'center',
    height: 12 + Dimensions.get('screen').width / 3,
    width: 12 + Dimensions.get('screen').width / 3,
    borderRadius: Dimensions.get('screen').width / 1.5,
    backgroundColor: 'rgb(200,200,220)',
    borderColor: '#000',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
