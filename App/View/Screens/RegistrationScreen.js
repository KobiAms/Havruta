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
      title: user ? user.displayName : 'התחברות'
    });
  }, [navigation])

  function setUserState(user) {
    navigation.setOptions({
      title: user ? user.displayName : 'התחברות'
    });
    setUser(user)
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.main}>
        <SafeAreaView style={{ flex: 0, backgroundColor: 'rgb(120,90,140)' }} />
        <SafeAreaView style={styles.main}>
          {user ? (
            <UserForm style={{ flex: 1 }} setUser={setUserState} navigation={navigation} setLoading={setLoading} />
          ) : (
            <View style={styles.body}>
              <View style={styles.form}>
                {login_mode ? (
                  <LoginForm setUser={setUserState} />
                ) : (
                  <SignupForm setUser={setUserState} />
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
    backgroundColor: '#f2f2f3',
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
  form: {
    height: '50%',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 1,
    borderRadius: 30,
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
    margin: 5
  },
});

export default RegistrationScreen;
