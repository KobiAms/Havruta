/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
    Switch,
    Image
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default ManageUser = ({ navigation, route }) => {
    const [isBlocked, setIsBlocked] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userName, setuserName] = useState('');
    const [userDOB, setuserDOB] = useState();
    const [userAbout, setUserAbout] = useState();
    const [userAvatar, setUserAvatar] = useState();
    const toggleAdmin = () => setIsAdmin(previousState => !previousState);

    const toggleBlock = () => setIsBlocked(previousState => !previousState);



    useEffect(() => {
        setuserName(route.params.data.name);
        setUserAbout(route.params.data.about);
        'admin' === route.params.data.role ? setIsAdmin(true) : null;
        if (route.params.data.dob) {
            let DAT = new Date((7200 + route.params.data.dob.seconds) * 1000);
            /*//times go by sec GMT, so in order to get the right date, need to add 2 hours and mult by 1000 in nanosec*/
            let DAT_parse =
                DAT.getDate() + '.' + (DAT.getMonth() + 1) + '.' + DAT.getFullYear();
            setuserDOB(DAT_parse);
        }
    }, [setuserDOB])
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
                        style={[styles.back_button, { backgroundColor: 'rgba(0,0,0,0)' }]}
                    />
                </View>


                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.aview}>
                        <Image source={userAvatar} style={{ width: '100%', height: '100%' }} />
                    </View>
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{userName}</Text>
                        <Text style={{ fontSize: 16 }}>{userDOB}</Text>
                    </View>
                </View>
                <View style={{ padding: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>About {userName}:</Text><Text style={{ fontSize: 16 }}> {userAbout}</Text>
                </View>


                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <View style={[styles.switch, { marginLeft: 0 }]}>
                        {isBlocked ? <Text>
                            Block</Text> : <Text>Block</Text>}
                        <Switch
                            style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }], margin: 10 }}
                            trackColor={{ false: '#000000', true: '#007fff' }}
                            thumbColor={isBlocked ? '#00ffff' : '#999999'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleBlock}
                            value={isBlocked}
                        />
                    </View>
                    <View style={[styles.switch, { marginRight: 0 }]}>
                        {isAdmin ? <Text>Admin</Text> : <Text>Admin</Text>}
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
                <TouchableOpacity style={styles.delete} onPress={() => { console.log('deleting the user ' + userName) }}>
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
        justifyContent: 'center',
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
