/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
    Switch,
    Image,
    Alert,
    SafeAreaView
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import LoadingComponent from './LoadingComponent';

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

    // set header title
    useLayoutEffect(() => {
        navigation.setOptions({
            title: route.params.data.name
        });
    }, [navigation])

    /**functionality of the admin swith */
    const toggleAdmin = () => {
        if (loading)
            return
        setLoading(true)
        let new_role;
        if (isAdmin) new_role = 'user'              //if now an admin, set new role to be user
        else {
            if (isReporter) setIsRepoter(false);    //if you are reporter right now then you are not any more
            new_role = 'admin';                     //because you are an admin now
        }
        setIsAdmin(!isAdmin)
        firestore().collection('users').doc(route.params.data.email).update({ role: new_role })
            .then(() => { setLoading(false) })
            .catch(() => { setIsAdmin(!isAdmin); setLoading(false) })
    };

    /**functionality of the reporter swith */
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
        firestore().collection('users').doc(route.params.data.email).update({ role: new_role })
            .then(() => { setLoading(false) })
            .catch(() => { setIsRepoter(!isReporter); setLoading(false); })
    };

    const toggleBlock = () => {
        setIsBlocked(!isBlocked)
    }

    function delete_user() {
        Alert.alert(
            'מחיקת משתמש לצמיתות!',
            'האם אתה בטוח?',
            [
                {
                    text: "ביטול",
                    style: "cancel"
                },
                {
                    text: "מחק",
                    onPress: () => {
                    },
                    style: 'destructive'
                }
            ]
        )
    }

    /**this useEffect update the state variables */
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
            <View style={{ flexDirection: 'row-reverse' }}>
                <View style={styles.aview}>
                    <Image source={userAvatar} style={{ width: '100%', height: '100%' }} />
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: '#333', fontWeight: 'bold', fontSize: 18 }}>{userName}</Text>
                    <Text style={{ color: '#333', fontSize: 16 }}>תאריך לידה: {userDOB}</Text>
                    <Text style={{ color: '#333', fontSize: 16 }}>מזהה משתמש: {userEmail}</Text>
                </View>
            </View>
            <View style={{ padding: 10, alignItems: 'flex-end' }}>
                <Text style={{ color: '#333', fontWeight: 'bold', fontSize: 18 }}>אודות המשתמש {userName}:</Text>
                <Text style={{ color: '#333', fontSize: 16 }}> {userAbout}</Text>
            </View>
            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-evenly' }}>
                <View style={styles.switch}>
                    <Text style={{ color: '#333', fontWeight: 'bold', fontSize: 18, padding: 5 }}>חסום</Text>
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
                    <Text style={{ color: '#333', fontWeight: 'bold', fontSize: 18, padding: 5 }}>כתב</Text>
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
                    <Text style={{ color: '#333', fontWeight: 'bold', fontSize: 18, padding: 5 }}>מנהל</Text>
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
                    color: '#e55a5a',
                    fontSize: 18,
                    fontWeight: 'bold',
                }}>מחק את המשתמש הזה</Text>
            </TouchableOpacity>
            {
                loading ?
                    <LoadingComponent />
                    :
                    null
            }
        </View >
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#f2f2f3',
        paddingTop: Dimensions.get('screen').height / 35,
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
        borderColor: '#999',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        margin: 10,
    },
    delete: {
        backgroundColor: '#f2f2f3',
        justifyContent: 'center',
        width: Dimensions.get('screen').width * (85 / 100),
        height: 12 + Dimensions.get('screen').width / 10,
        alignSelf: 'center',
        alignItems: 'center',
        margin: Dimensions.get('screen').width / 10,
        borderRadius: 50,
        borderColor: '#e55a5a',
        borderWidth: 1,
    },
});
