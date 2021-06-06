import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Keyboard, TouchableWithoutFeedback } from 'react-native';
import IconIC from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import LoginForm from '../Components/LoginForm';
import SignupForm from '../Components/SignupForm';
import UserForm from '../Components/UserForm';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { SafeAreaView } from 'react-native';
import { ActivityIndicator } from 'react-native';

GoogleSignin.configure({
  webClientId: '',
});

RegistrationScreen = ({ navigation }) => {
  const [login_mode, setLogin_mode] = useState(true);
  const [user, setUser] = useState(auth().currentUser);
  const [loading, setLoading] = useState(false)
  async function signInGoogle() {
    return;
    const { idToken } = await GoogleSignin.signIn();
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={[styles.loading_comp, { backgroundColor: '#fffffff' }]}
        >
          {loading ?
            <ActivityIndicator color={'black'} size={'small'} />
            : null
          }
        </View>
      ),
    });
  }, [navigation])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.main}>
        <SafeAreaView style={{ flex: 0, backgroundColor: 'rgb(120,90,140)' }} />
        <SafeAreaView style={styles.main}>
          {user ? (
            <UserForm style={{ flex: 1 }} setUser={setUser} navigation={navigation} setLoading={setLoading} />
          ) : (
            <View style={styles.body}>
              <View style={styles.form}>
                {login_mode ? (
                  <LoginForm setUser={setUser} />
                ) : (
                  <SignupForm setUser={setUser} />
                )}
                <TouchableOpacity
                  style={{
                    marginTop: 5,
                    borderBottomColor: 'rgb(0,127,255)',
                    borderBottomWidth: 1,
                  }}
                  onPress={() =>
                    login_mode ? setLogin_mode(false) : setLogin_mode(true)
                  }>
                  <Text style={styles.headline}>
                    {login_mode ? 'Create New Account' : 'I Already Have Account'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.social_login}>
                <TouchableOpacity style={styles.social_login_button}>
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <IconIC size={30} name={'md-logo-apple'} />
                  </View>
                  <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>{login_mode ? 'Continue' : 'Register'} With Apple</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.social_login_button} onPress={() => signInGoogle()}>
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <IconIC size={30} name={'ios-logo-google'} />
                  </View>
                  <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>{login_mode ? 'Continue' : 'Register'} With Google</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.social_login_button}>
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <IconIC size={30} name={'ios-logo-facebook'} color={'#3577ea'} />
                  </View>
                  <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>{login_mode ? 'Continue' : 'Register'} With Facebook</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgb(200,200,220)',
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
  headline: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'rgb(0,127,255)',
  },
  loading_comp: {
    padding: 5,
    paddingRight: 20,
    paddingLeft: 20,
    borderRadius: 15,
    overflow: 'hidden'
  },
  body: {
    height: Dimensions.get('screen').height * (9 / 10),
    width: '100%',
    paddingTop: '10%',
  },
  container: {
    height: '50%',
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: 'green',
  },
  form: {
    height: '50%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  login_button: {
    width: '50%',
    borderColor: 'rgb(0,0,0)',
    borderWidth: 1,
    borderRadius: 20,
    padding: 5,
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  social_login: {
    height: '30%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 10,
  },
  social_login_button: {
    flexDirection: 'row',
    width: '80%',
    padding: 5,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#fff',
    borderRadius: 30,
    borderWidth: 1,
  },
});

export default RegistrationScreen;
