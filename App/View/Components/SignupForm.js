import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

/** the component that display on the screen when non user want to register */
function SignupForm({ setUser }) {
    const [fullName, setFullName] = useState('testy test')
    const [email, setEmail] = useState('testy@test.com')
    const [password, setPassword] = useState('12344321')
    const [rePassword, setRePassword] = useState('12344321')
    const [loading, setLoading] = useState(false)

    function add_user_to_db(email, password, name) {
        firestore().collection('users').doc(email).set({
            about: '',
            dob: firestore.Timestamp.fromDate(new Date()),
            email: email,
            name: name,
            photo: '',
            role: 'user',
            isNew: true
        }).then(() => {
            auth().createUserWithEmailAndPassword(email, password)
                .then(() => {
                    setLoading(false);
                    setUser(auth().currentUser)
                })
                .catch((error) => {
                    Alert.alert("Oops..! Some Error Just happen. Please Try Again Later\n" + error, [{ text: "OK", }], { cancelable: false })
                    setLoading(false);
                })
        }).catch(() => {
            Alert.alert("Some Error Just Happened, Please try again later", [{ text: "OK", }], { cancelable: false })
        })
    }

    function signup() {
        if (loading)
            return;
        if (!(email && password && rePassword)) {
            Alert.alert("one of the fields are Missing", [{ text: "OK", }], { cancelable: false })
            return
        }
        if (password != rePassword) {
            Alert.alert("your passwords are not the same", [{ text: "OK", }], { cancelable: false })
            return
        }
        if (!validateEmail(email)) {
            Alert.alert("invalid email", [{ text: "OK", }], { cancelable: false })
            return
        }
        if (fullName.length < 5) {
            Alert.alert("Full Name must be at least 5 characters", [{ text: "OK", }], { cancelable: false })
            return
        }
        setLoading(true);
        auth().fetchSignInMethodsForEmail(email)
            .then(signInMethod => {
                if (signInMethod.length) {
                    Alert.alert('', 'This email already used', [{ text: 'OK' }], { cancelable: false });
                    setLoading(false);
                } else {
                    add_user_to_db(email, password, fullName)
                }
            })
            .catch(() => {
                Alert.alert('', 'Some Error Just Happened, Please try again later', [{ text: 'OK' }], { cancelable: false });
                setLoading(false);
            })
    }

    return (
        <View style={styles.form}>
            <TextInput
                autoCapitalize={'words'}
                style={styles.input}
                onChangeText={setFullName}
                value={fullName}
                placeholder={'Full Name'}
            />
            <TextInput
                autoCapitalize={'none'}
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                placeholder={'Enter Email'}
            />
            <TextInput
                autoCapitalize={'none'}
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                placeholder={'Enter Password'}
                secureTextEntry={true}
            />
            <TextInput
                autoCapitalize={'none'}
                style={styles.input}
                onChangeText={setRePassword}
                value={rePassword}
                placeholder={'Re-Enter Password'}
                secureTextEntry={true}
            />
            <TouchableOpacity style={styles.signup_button} onPress={() => signup()}>
                {loading ? <ActivityIndicator size={'small'} color={'#0d5794'} /> : <Text>Sign-Up Now!</Text>}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    form: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        width: '80%',
        borderWidth: 1,
        borderRadius: 20,
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
    signup_button: {
        width: '50%',
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#0d5794',
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
        margin: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
});


export default SignupForm