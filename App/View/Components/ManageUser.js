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

export default ManageUser = ({ navigation, route }) => {
    const [isBlocked, setIsBlocked] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userName, setuserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userDOB, setuserDOB] = useState();
    const [userAbout, setUserAbout] = useState();
    const [loading, setLoading] = useState(false);
    const [userAvatar, setUserAvatar] = useState();


    const toggleAdmin = () => {
        if (loading)
            return
        setLoading(true)
        let new_role = isAdmin ? 'user' : 'admin'
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

    delete_user = () => {
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
        setIsAdmin(route.params.data.role === 'admin')
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
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.back_button}
                        onPress={() => navigation.goBack()}>
                        <Icon name={'arrow-left'} size={20} />
                    </TouchableOpacity>
                    <Text style={styles.screen_title}>Havruta</Text>
                    <View
                        style={[styles.back_button, { backgroundColor: '#fffffff' }]}
                    >
                        {loading ?
                            <ActivityIndicator color={'black'} size={'large'} />
                            : null
                        }
                    </View>

                </View>


                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.aview}>
                        <Image source={userAvatar} style={{ width: '100%', height: '100%' }} />
                    </View>
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{userName}</Text>
                        <Text style={{ fontSize: 16 }}>{userDOB}</Text>
                        <Text style={{ fontSize: 16 }}>{userEmail}</Text>
                    </View>
                </View>

                <View style={{ padding: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>About {userName}:</Text>
                    <Text style={{ fontSize: 16 }}> {userAbout}</Text>
                </View>


                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <View style={[styles.switch, { marginLeft: 0 }]}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, padding: 5 }}>{isBlocked ? 'Block' : 'Block'}</Text>
                        <Switch
                            style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }], margin: 10 }}
                            trackColor={{ false: '#000000', true: '#faa' }}
                            thumbColor={isBlocked ? '#ff0000' : '#999999'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleBlock}
                            value={isBlocked}
                        />
                    </View>
                    <View style={[styles.switch, { marginRight: 0 }]}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, padding: 5 }}>Admin</Text>
                        <Switch
                            style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }], margin: 10 }}
                            trackColor={{ false: '#000000', true: '#007fff' }}
                            thumbColor={isAdmin ? '#00ffff' : '#999999'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleAdmin}
                            value={isAdmin}
                        />
                    </View>
                </View >
                <TouchableOpacity style={styles.delete} onPress={() => delete_user()}>
                    <Text style={{
                        color: 'rgb(255,255,255)',
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
        justifyContent: 'space-between'
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
        height: 12 + Dimensions.get('screen').width / 10,
        width: 12 + Dimensions.get('screen').width / 10,
        borderRadius: Dimensions.get('screen').width / 1.5,
        backgroundColor: 'rgb(200,200,220)',
        borderColor: '#000',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        margin: 10,
    },
    delete: {
        backgroundColor: 'rgb(255,40,40)',
        justifyContent: 'center',
        width: Dimensions.get('screen').width * (9 / 10),
        height: 12 + Dimensions.get('screen').width / 10,
        alignSelf: 'center',
        alignItems: 'center',
        margin: Dimensions.get('screen').width / 10,
        borderRadius: 50,
    },
});
