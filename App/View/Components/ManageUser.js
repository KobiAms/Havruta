/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
    Switch,
    Image,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import app from '@react-native-firebase/app';
import Switcher from './MultiSwitcher';


export default ManageUser = ({ navigation, route }) => {
    const [isBlocked, setIsBlocked] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isReporter, setIsRepoter] = useState(false);
    const [userName, setuserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userDOB, setuserDOB] = useState();
    const [userAbout, setUserAbout] = useState();
    const [loading, setLoading] = useState(false);
    const [userAvatar, setUserAvatar] = useState(route.params.data.photo ? { uri: route.params.data.photo } : require('../../Assets/POWERPNT_frXVLHdxnI.png'));
    const [userRole, setuserRole] = useState('');

    const toggleAdmin = () => {
        if (loading)
            return
        setLoading(true)
        let new_role;
        if (isAdmin) new_role = 'user'
        else {
            if (isReporter) setIsRepoter(false);
            new_role = 'admin';
        }

        setIsAdmin(!isAdmin)
        firestore().collection('users').doc(route.params.data.email).update({
            role: new_role
        })
            .then(() => {
                setLoading(false)
            })
            .catch(() => {
                setIsAdmin(!isAdmin)
                setLoading(false)
            })
    };
    const toggleReporter = () => {
        if (loading)
            return
        setLoading(true)
        if (isAdmin)
            setIsAdmin(false)
        let new_role;
        if (!isReporter)
            new_role = 'reporter';
        if (isReporter)
            new_role = 'user';
        setIsRepoter(!isReporter);
        firestore().collection('users').doc(route.params.data.email).update({
            role: new_role
        })
            .then(() => {
                setLoading(false)
            })
            .catch(() => {
                setIsRepoter(!isReporter)
                setLoading(false)
            })
    };

    function delete_user() {
        Alert.alert(
            'Delete User Permanently!',
            'Are you sure?',
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => {
                    },
                    style: 'destructive'
                }
            ]
        )
    }

    const toggleBlock = () => {

        setLoading(!loading)
        setIsBlocked(!isBlocked)
    }

    useEffect(() => {
        setuserName(route.params.data.name);
        setUserAbout(route.params.data.about);
        setUserEmail(route.params.data.email);
        setuserRole(route.params.data.role);
        setIsAdmin(route.params.data.role === 'admin')
        setIsRepoter(route.params.data.role === 'reporter')
        if (route.params.data.dob) {
            let DAT = new Date((7200 + route.params.data.dob.seconds) * 1000);
            /*//times go by sec GMT, so in order to get the right date, need to add 2 hours and mult by 1000 in nanosec*/
            let DAT_parse =
                DAT.getDate() + '.' + (DAT.getMonth() + 1) + '.' + DAT.getFullYear();
            setuserDOB(DAT_parse);
        }
    }, [setuserDOB, setUserAbout, setIsAdmin, setuserDOB])
    return (
        <View style={styles.main}>
            <SafeAreaView style={{ flex: 0, backgroundColor: 'rgb(120,90,140)' }} />
            <View style={styles.main}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.aview}>
                        <Image source={userAvatar} style={{ width: '100%', height: '100%' }} />
                    </View>
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{userName}</Text>
                        <Text style={{ fontSize: 16 }}>Date of birth: {userDOB}</Text>
                        <Text style={{ fontSize: 16 }}>user id: {userEmail}</Text>
                    </View>
                </View>

                <View style={{ padding: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>About {userName}:</Text>
                    <Text style={{ fontSize: 16 }}> {userAbout}</Text>
                </View>


                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <View style={styles.switch}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, padding: 5 }}>{isBlocked ? 'Unblock' : 'Block'}</Text>
                        <Switch
                            style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }], margin: 15 }}
                            trackColor={{ false: '#444', true: '#DA0000' }}
                            thumbColor={isBlocked ? '#F75757' : '#bbb'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleBlock}
                            value={isBlocked}
                        />
                    </View>
                    <View style={styles.switch}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, padding: 5 }}>Reporter</Text>
                        <Switch
                            style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }], margin: 15 }}
                            trackColor={{ false: '#444', true: '#0075AF' }}
                            thumbColor={isReporter ? '#94C0D5' : '#bbb'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleReporter}
                            value={isReporter}
                        />
                    </View>
                    <View style={styles.switch}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, padding: 5 }}>Admin</Text>
                        <Switch
                            style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }], margin: 15 }}
                            trackColor={{ false: '#444', true: '#1DAF00' }}
                            thumbColor={isAdmin ? '#9BD5A1' : '#bbb'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleAdmin}
                            value={isAdmin}
                        />
                    </View>
                </View >


                <TouchableOpacity style={styles.delete} onPress={() => delete_user()}>
                    <Text style={{
                        color: 'rgb(255,40,40)',
                        fontSize: 18,
                        fontWeight: 'bold',
                    }}>Delete this user</Text>
                </TouchableOpacity>
            </View >
        </View >
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: 'rgb(200,200,220)',
        paddingTop: Dimensions.get('screen').height / 35
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
    back_button: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    switch: {
        margin: 10,
        alignItems: 'center',
    },
    aview: {
        alignSelf: 'center',
        height: 12 + Dimensions.get('screen').width / 9,
        width: 12 + Dimensions.get('screen').width / 9,
        borderRadius: Dimensions.get('screen').width / 1.5,
        backgroundColor: 'rgb(200,200,220)',
        borderColor: '#999',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        margin: 10,
    },
    delete: {
        backgroundColor: 'rgb(240,240,255)',
        justifyContent: 'center',
        width: Dimensions.get('screen').width * (85 / 100),
        height: 12 + Dimensions.get('screen').width / 10,
        alignSelf: 'center',
        alignItems: 'center',
        margin: Dimensions.get('screen').width / 10,
        borderRadius: 50,
        borderColor: 'rgb(255,40,40)',
        borderWidth: 1,
    },
});
