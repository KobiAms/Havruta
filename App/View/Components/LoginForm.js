import React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth'


function LoginForm({ setUser }) {
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)

    /**the function that activate the login flow */
    function login() {
        if (loading)
            return;
        if (!(email && password)) {         //incase some data is missing
            Alert.alert('האימייל או הסיסמא אינם נכונים', [{ text: "בסדר", }], { cancelable: false })
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
                    errorMsg = 'האימייל או הסיסמא אינם נכונים';
                else if (errorType.code == "auth/user-not-found")
                    errorMsg = 'האימייל או הסיסמא אינם נכונים';
                else
                    errorMsg = "\n אנא נסה שוב";
                Alert.alert("אירעה שגיאה בהתחברות", errorMsg, [{ text: "בסדר", }], { cancelable: false })
            })
    }
    return (
        <View style={styles.form}>
            <TextInput
                autoCapitalize={'none'}
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                textAlign={'center'}
                placeholder={'israel@israeli.co.il'}
            />
            <TextInput
                autoCapitalize={'none'}
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                placeholder={'**********'}
                textAlign={'center'}
                secureTextEntry={true}
            />
            <TouchableOpacity style={styles.login_button} onPress={() => login()}>
                {loading ? <ActivityIndicator size={'small'} color={'#FFFFFF'} /> : <Text style={{ color: '#fff', fontSize: 18, fontWeight: '500' }}> התחבר 😎</Text>}
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
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#0d5794',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        height: 35,
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
    login_button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        height: 50,
        paddingRight: 100,
        paddingLeft: 100,
        borderRadius: 20,
        backgroundColor: '#0d5794',
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
    }
});
export default LoginForm