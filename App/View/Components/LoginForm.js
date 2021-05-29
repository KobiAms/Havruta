import React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth'


LoginForm = ({ setUser }) => {
    const [password, setPassword] = useState("12344321")
    const [email, setEmail] = useState("testy@test.com")
    const [loading, setLoading] = useState(false)


    login = () => {
        if (loading)
            return;
        if (!(email && password)) {
            Alert.alert("Email or Password Missing", [{ text: "OK", }], { cancelable: false })
            return
        }
        setLoading(true)
        auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                setLoading(false)
                setUser(auth().currentUser)
            })
            .catch(errorType => {
                setLoading(false);
                let errorMsg;
                console.log(errorType)
                if (errorType.code == "auth/wrong-password")
                    errorMsg = "The password is invalid";
                else
                    errorMsg = "Some Error just happend\n" + errorType.code;
                Alert.alert("Oops!.. Login Failed", errorMsg, [{ text: "OK", }], { cancelable: false })
            })
    }
    return (

        <View style={styles.form}>
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
            <TouchableOpacity style={styles.login_button} onPress={() => login()}>
                {loading ? <ActivityIndicator size={'small'} color={'#000000'} /> : <Text>Log-In</Text>}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({

    form: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
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
    login_button: {
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


export default LoginForm