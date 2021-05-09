import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'
import auth from '@react-native-firebase/auth'
import LoginForm from '../Components/LoginForm'
import SignupForm from '../Components/SignupForm'


RegistrationScreen = ({ navigation, route }) => {
    const [login_mode, setLogin_mode] = useState(true)
    const [user, setUser] = useState(auth().currentUser)


    LogoutForm = () => {
        return (
            <View style={styles.form}>
                <TouchableOpacity style={styles.login_button} onPress={() => auth().signOut().then(() => setUser(auth().currentUser))}>
                    <Text>Log Out</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.main}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.register} onPress={() => navigation.goBack()}>
                    <Icon name={'arrow-left'} size={20} />
                </TouchableOpacity>
                <Text style={styles.screen_title}>
                    Havruta
                </Text>
                <View style={[styles.register, { backgroundColor: 'rgba(0,0,0,0)' }]}>
                </View>
            </View>
            {
                user ? <LogoutForm /> :
                    <View style={styles.form}>
                        {login_mode ? <LoginForm setUser={setUser} /> : <SignupForm setUser={setUser} />}
                        <TouchableOpacity style={{ marginTop: 5, borderBottomColor: 'rgb(0,127,255)', borderBottomWidth: 1 }} onPress={() => login_mode ? setLogin_mode(false) : setLogin_mode(true)}>
                            <Text style={styles.headline}>{login_mode ? 'Create New Account' : 'I Already Have Account'}</Text>
                        </TouchableOpacity>
                    </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        width: '100%',
        height: '10%',
        backgroundColor: 'purple',
        position: 'absolute',
        top: '0%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    screen_title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'rgb(255,255,255)'
    },
    headline: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'rgb(0,127,255)',
    },
    register: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    form: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        width: '80%',
        borderColor: 'rgb(0,0,0)',
        borderWidth: 1,
        borderRadius: 20,
        padding: 5,
        margin: 5
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
        justifyContent: 'center'
    }
});


export default RegistrationScreen;