import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import IconFeather from 'react-native-vector-icons/Feather'
import IconFAW5 from 'react-native-vector-icons/FontAwesome5'

export default UserForm = ({ setUser, navigation }) => {
    const [userData, setUserData] = useState()
    const [userRole, setUserRole] = useState()

    useEffect(() => {
        const subscriber = firestore().collection('users').doc(auth().currentUser.email).get()
            .then(doc => {
                setUserData(doc.data())
                setUserRole(doc.data().role)
            })
            .catch(() => {

            })

        return subscriber;
    }, [setUserData, setUserRole])

    return (
        <View style={styles.form}>

            {
                userRole && userRole == 'admin' ?
                    <TouchableOpacity style={[styles.option, { borderTopWidth: 1 }]} onPress={() => navigation.navigate('Manage Users')} >
                        <Text style={{ color: '#888888', fontSize: 20 }}>Manage Users</Text>
                        <IconFAW5 name={"user-cog"} color={'#666666'} size={20} />
                    </TouchableOpacity>
                    : null
            }
            <TouchableOpacity style={styles.option} onPress={() => auth().signOut().then(() => setUser(auth().currentUser))} >
                <Text style={{ color: '#ff0000', fontSize: 20 }}>Log Out</Text>
                <IconFeather name={"log-out"} color={'#ff0000'} size={20} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({

    form: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    login_button: {
        width: '50%',
        borderColor: '#007fff',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        margin: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    option: {
        width: '100%',
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 30,
        borderBottomWidth: 1,
    }
});
