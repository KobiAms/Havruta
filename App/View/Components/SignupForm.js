/* eslint-disable prettier/prettier */
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
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rePassword, setRePassword] = useState('')
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
                    Alert.alert("אירעה שגיאה!", 'אנא נסה שנית', [{ text: "בסדר", }], { cancelable: false })
                    setLoading(false);
                })
        }).catch(() => {
            Alert.alert("אירעה שגיאה!", 'אנא נסה שנית', [{ text: "בסדר", }], { cancelable: false })
        })
    }

    function signup() {
        if (loading)
            return;
        if (!(fullName, email && password && rePassword)) {
            Alert.alert("לא כל השדות מלאים", [{ text: "בסדר", }], { cancelable: false })
            return
        }
        if (password !== rePassword) {
            Alert.alert('אירעה שגיאה!', 'הסיסמאות אינן תואמות', [{ text: "בסדר", }], { cancelable: false })
            return
        }
        if (!validateEmail(email)) {
            Alert.alert('אירעה שגיאה!', 'האימייל אינו חוקי', [{ text: "בסדר", }], { cancelable: false })
            return
        }
        if (fullName.length < 2) {
            Alert.alert('אירעה שגיאה!', 'שם המשתמש קצר מידיי', [{ text: "בסדר", }], { cancelable: false })
            return
        }
        setLoading(true);
        auth().fetchSignInMethodsForEmail(email)
            .then(signInMethod => {
                if (signInMethod.length) {
                    Alert.alert('אירעה שגיאה', 'אימייל זה כבר תפוס', [{ text: 'בסדר' }], { cancelable: false });
                    setLoading(false);
                } else {
                    add_user_to_db(email, password, fullName)
                }
            })
            .catch(() => {
                Alert.alert('אירעה שגיאה', 'אנא נסה שנית', [{ text: 'בסדר' }], { cancelable: false });
                setLoading(false);
            })
    }

    return (
        <View style={styles.form}>
            <TextInput
                textAlign={'center'}
                autoCapitalize={'words'}
                style={styles.input}
                onChangeText={setFullName}
                value={fullName}
                placeholder={'ישראל ישראלי'}
            />
            <TextInput
                textAlign={'center'}
                autoCapitalize={'none'}
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                placeholder={'israel@israeli.co.il'}
            />
            <TextInput
                textAlign={'center'}
                autoCapitalize={'none'}
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                placeholder={'הכנס סיסמא'}
                secureTextEntry={true}
            />
            <TextInput
                textAlign={'center'}
                autoCapitalize={'none'}
                style={styles.input}
                onChangeText={setRePassword}
                value={rePassword}
                placeholder={'הכנס סיסמא שוב'}
                secureTextEntry={true}
            />
            <TouchableOpacity style={styles.signup_button} onPress={() => signup()}>
                {loading ? <ActivityIndicator size={'small'} color={'#FFFFFF'} /> : <Text style={{ color: '#fff', fontSize: 18, fontWeight: '500' }}>צור לי משתמש 😎</Text>}
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
    signup_button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        height: 50,
        paddingRight: 50,
        paddingLeft: 50,
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


export default SignupForm