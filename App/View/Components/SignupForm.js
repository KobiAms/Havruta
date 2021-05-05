import React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import auth from '@react-native-firebase/auth'


SignupForm = () => {
    const [password, setPassword] = useState()
    const [rePassword, setRePassword] = useState()
    const [email, setEmail] = useState()

    signup = () => {
        if (!(email && password && rePassword)) {
            Alert.alert("one of the fields are Missing", [{ text: "OK", }], { cancelable: false })
            return
        }
        if (password != rePassword) {
            Alert.alert("your passwords are not the same", [{ text: "OK", }], { cancelable: false })
            return
        }
        auth().createUserWithEmailAndPassword(email, password)
            .then((value) => {
                console.log(value)
            })
            .catch((error) => {
                Alert.alert("Oops..! Some Error Just happen. Please Try Again Later\n" + error.code, [{ text: "OK", }], { cancelable: false })
            })
    }

    return (
        <View style={styles.form}>
            <TextInput
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                placeholder={'Enter Email'}
            />
            <TextInput
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                placeholder={'Enter Password'}
                secureTextEntry={true}
            />
            <TextInput
                style={styles.input}
                onChangeText={setRePassword}
                value={rePassword}
                placeholder={'Re-Enter Password'}
                secureTextEntry={true}
            />
            <TouchableOpacity style={styles.signup_button} onPress={() => signup()}>
                <Text>Sign-Up Now!</Text>
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
        borderColor: 'rgb(0,0,0)',
        backgroundColor: 'rgb(255,255,255)',
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        margin: 5
    },
    signup_button: {
        width: '50%',
        borderColor: 'rgb(0,127,255)',
        backgroundColor: 'rgb(255,255,255)',
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        margin: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

    }
});


export default SignupForm