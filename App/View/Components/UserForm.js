/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { launchImageLibrary } from 'react-native-image-picker';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import NewUserWizard from './NewUserWizard';

/**the main component of any user. when a user is loged in, this component is rendered */
export default function UserForm({ setUser, navigation }) {
  const [userRole, setUserRole] = useState();
  const [defaultStyle, setDefaultStyle] = useState(true);
  const [userName, setuserName] = useState('');
  const [userDOB, setuserDOB] = useState();
  const [userAbout, setUserAbout] = useState();
  const [userAvatar, setUserAvatar] = useState();
  const [loadingAvatar, setLoadingAvatar] = useState(true);
  const [loading, setLoading] = useState(false)
  const [editable, setEditable] = useState(false);
  const [editName, setEditName] = useState();
  const [editDate, setEditDate] = useState();
  const [editAbout, setEditAbout] = useState();
  const [isNew, setIsNew] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // create a readble date dd.mm.yyyy from Date obj
  dateToReadbleFormat = (date) => date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();

  // gets the date from date alert after confirm date
  const handleDateConfirm = (date) => {
    setEditDate(date)
    setuserDOB(dateToReadbleFormat(date))
    setDatePickerVisibility(false);
  };

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
          firestore().collection('users').doc(auth().currentUser.email)
            .update({ photo: url })
            .catch(() => console.log('error updtae imageurl'))
          auth().currentUser.updateProfile({ photoURL: url })
            .catch(() => console.log('error updtae imageurl'))
          setLoading(false);
        });
      }
    });
  }

  /** function activated by pressing the edit icon. allow changes in the user name, date of birth, about */
  function setToEditable() {
    if (loading)
      return
    if (editable) {
      // the length of the new name < 5 Discard Changes
      if (editName.length < 5) {
        setEditName(userName);
        return
      }
      // show loading indicator
      setLoading(true)
      // update at firestore users collection the new data
      auth().currentUser.updateProfile({ displayName: editName })
        .then(() => {
          firestore().collection('users').doc(auth().currentUser.email)
            .update({
              about: editAbout,
              name: editName,
              dob: firestore.Timestamp.fromDate(editDate)
            })
            .then(() => {
              // updates the relevant views
              setuserName(editName)
              setUserAbout(editAbout)
              setEditable(false);
              setLoading(false);
            })
        })
        .catch((error) => {
          console.log(error.code)
        })
    } else {
      // discrad changes
      setEditName(userName);
      setEditAbout(userAbout);
      setEditable(true);
    }
  }

  useEffect(() => {
    setLoading(true);
    // set the avatar to the one related to the user
    setUserAvatar({ uri: auth().currentUser.photoURL });
    // gets the user data from the db 
    const subscriber = firestore()
      .collection('users')
      .doc(auth().currentUser.email)
      .onSnapshot
      (doc => {
        if (!doc.data()) return;
        // updates the relevant states to shoe the received data
        setUserAbout(doc.data().about);
        setUserRole(doc.data().role);
        doc.data().role === 'user' ? setDefaultStyle(!defaultStyle) : null;
        /*//times go by sec GMT, so in order to get the right date, need to add 2 hours and mult by 1000 in nanosec*/
        setuserDOB(dateToReadbleFormat(doc.data().dob.toDate()));
        setEditDate(doc.data().dob.toDate())
        setuserName(doc.data().name);
        setIsNew(doc.data().isNew);
        setLoading(false);
      })
    return subscriber;
  }, [setUserAbout, setUserRole, setDefaultStyle, setuserName, setuserDOB]);


  return (
    isNew ?
      <NewUserWizard />
      :
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.main}>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            date={editDate}
            onConfirm={handleDateConfirm}
            onCancel={() => setDatePickerVisibility(false)}
          />
          <View style={styles.backline} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>

            <TouchableOpacity onPress={() => setToEditable()}>
              <View style={{ alignItems: 'center', flexDirection: 'row', backgroundColor: '#ffffff80', padding: 5, borderRadius: 20 }}>
                <IconFeather
                  name={editable ? 'check-square' : 'edit'}
                  color={editable ? '#5ba92c' : '#333'}
                  size={30}
                  style={{ margin: 5 }} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.aview} onPress={() => uploadNewAvatar()}>
              <Image source={userAvatar} style={{ width: '100%', height: '100%' }} onLoadEnd={() => setLoadingAvatar(false)} />
              {
                loadingAvatar ?
                  <ActivityIndicator style={{ position: 'absolute' }} color={'#007fff'} size={'large'} />
                  : null
              }
            </TouchableOpacity>
            <TouchableOpacity onPress={() => editable ? setEditable(false) : null}>
              <View style={{ alignItems: 'center', flexDirection: 'row', backgroundColor: '#ffffff80', padding: 5, borderRadius: 20, borderColor: '#990000', opacity: editable ? 1 : 0 }}>
                <IconFeather
                  name={'x-square'}
                  color={'#e55a5a'}
                  size={30}
                  style={{ margin: 5 }} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            {
              editable ?
                <TextInput
                  style={[styles.name, styles.editable, { color: '#000' }]}
                  value={editName}
                  onChangeText={setEditName} />
                :
                <Text style={[styles.name, styles.editcont]}>{userName}</Text>
            }
          </View>
          <View style={[styles.row, { flexDirection: 'row' }]}>
            {
              editable ?
                <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.editable}>
                  <Text style={{ fontSize: 18, textAlign: 'right' }}>{userDOB}</Text>
                </TouchableOpacity>
                :
                <Text style={[{ fontSize: 18, padding: 4, color: '#333', textAlign: 'right' }, styles.editcont]}>{userDOB}</Text>
            }
            <Text style={{ fontWeight: 'bold', fontSize: 21, color: '#333' }}>תאריך לידה:</Text>
          </View>
          <View style={{ padding: 20 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 21, paddingLeft: 8, color: '#333', textAlign: 'right' }}>עלי:</Text>
            {
              editable ?
                <AutoGrowingTextInput
                  style={[styles.editable, { fontSize: 17, textAlign: 'right' }]}
                  value={editAbout}
                  onChangeText={setEditAbout} />
                :
                <Text style={[{ fontSize: 17, padding: 4, color: '#333', textAlign: 'right' }, styles.editcont]}>{userAbout}</Text>
            }
          </View>
        </ScrollView >
        {/*the following view contain the logout / manage users buttons*/}
        <View style={styles.chose}>

          <TouchableOpacity
            style={[styles.option, styles.logout]}
            onPress={() =>
              auth()
                .signOut()
                .then(() => setUser(auth().currentUser))
            }>
            <Text style={{ color: '#e55a5a', fontSize: 20 }}>התנתקות</Text>
            <IconFeather name={'log-out'} color={'#e55a5a'} size={20} style={{ transform: [{ rotateY: '180deg' }] }} />
          </TouchableOpacity>
          {userRole && userRole == 'admin' ? (
            <TouchableOpacity
              style={styles.option}
              onPress={() => navigation.navigate('Manage Users')}>
              <Text style={{ color: '#fff', fontSize: 20 }}>ניהול משתמשים</Text>
              <IconFAW5 name={'user-cog'} color={'#fff'} size={20} style={{ margin: 3 }} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View >
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#f2f2f3',
    marginBottom: 5 + Dimensions.get('screen').height / 10,
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
    padding: 4,
    color: '#333'
  },
  editable: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#aaa',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
    padding: 8,
  },
  editcont: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#00000000',
    backgroundColor: '#FFFFFF00',
    padding: 8,
  },
  chose: {
    alignItems: 'flex-end',
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    margin: Dimensions.get('screen').width / 50,
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
  },
  option: {
    flex: 1,
    backgroundColor: '#0d5794',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 15,
    borderRadius: 50,
    margin: 5,

  },
  backline: {
    backgroundColor: '#a3cbe0',
    height: Dimensions.get('screen').height / 8,
    marginBottom: -Dimensions.get('screen').height / 10,
    justifyContent: "flex-start",
  },
  aview: {
    alignSelf: 'center',
    height: 12 + Dimensions.get('screen').width / 3,
    width: 12 + Dimensions.get('screen').width / 3,
    borderRadius: Dimensions.get('screen').width / 1.5,
    backgroundColor: '#f2f2f3',
    borderColor: '#a3cbe0',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logout: {
    backgroundColor: '#f2f2f3',
    borderWidth: 1,
    borderColor: '#e55a5a'
  },
});