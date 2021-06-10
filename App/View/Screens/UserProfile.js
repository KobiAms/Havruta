/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

/**the main component of any user. when a user is loged in, this component is rendered */
export default function UserProfile({ data, navigation, route }) {
    const [userName, setuserName] = useState('');
    const [userDOB, setuserDOB] = useState();
    const [userAbout, setUserAbout] = useState();
    const [userAvatar, setUserAvatar] = useState(require('../../Assets/logo.png'));
    const [loadingAvatar, setLoadingAvatar] = useState(true);
    const [loading, setLoading] = useState(false)
    const userId = route.params.data;

    // create a readble date dd.mm.yyyy from Date obj
    dateToReadbleFormat = (date) => date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();

    useEffect(() => {
        setLoading(true);
        // set the avatar to the one related to the user
        //  setUserAvatar({ uri: auth().currentUser.photoURL });
        // gets the user data from the db 
        const subscriber = firestore()
            .collection('users')
            .doc(userId)
            .onSnapshot
            (doc => {
                if (!doc.data()) return;
                // updates the relevant states to shoe the received data
                setUserAbout(doc.data().about);
                if (doc.data().photo != '') setUserAvatar(doc.data().photo)
                /*//times go by sec GMT, so in order to get the right date, need to add 2 hours and mult by 1000 in nanosec*/
                setuserDOB(dateToReadbleFormat(doc.data().dob.toDate()));
                setuserName(doc.data().name);
                setLoading(false);
            })
        return subscriber;
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: userName
        });
    }, [navigation, setuserName])
    return (

        <View style={{ flex: 1 }}>
            <ScrollView style={styles.main}>
                <View style={styles.backline} />
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                    <View style={styles.aview} >
                        <Image source={userAvatar} style={{ width: '100%', height: '100%' }} onLoadEnd={() => setLoadingAvatar(false)} />
                        {
                            loadingAvatar ?
                                <ActivityIndicator style={{ position: 'absolute' }} color={'#007fff'} size={'large'} />
                                : null
                        }
                    </View>
                </View>
                <View style={styles.row}>
                    <Text style={[styles.name, styles.editcont]}>{userName}</Text>
                </View>
                <View style={[styles.row, { flexDirection: 'row' }]}>
                    <Text style={[{ fontSize: 18, padding: 4, color: '#333', textAlign: 'right' }, styles.editcont]}>{userDOB}</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 21, color: '#333' }}>תאריך לידה:</Text>
                </View>
                <View style={{ padding: 20 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 21, paddingLeft: 8, color: '#333', textAlign: 'right' }}>על {userName}:</Text>
                    <Text style={[{ fontSize: 17, padding: 4, color: '#333', textAlign: 'right' }, styles.editcont]}>{userAbout}</Text>
                </View>
            </ScrollView >
        </View >
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#f2f2f3',
        marginBottom: 5 + Dimensions.get('screen').height / 10,
    },
    row: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
    },
    name: {
        fontSize: 34,
        fontWeight: 'bold',
        margin: 5,
        padding: 4,
        color: '#333'
    },

    editcont: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#00000000',
        backgroundColor: '#FFFFFF00',
        padding: 8,
    },
    backline: {
        backgroundColor: '#a3cbe0',
        height: Dimensions.get('screen').height / 8,
        marginBottom: -Dimensions.get('screen').height / 10,
        justifyContent: "flex-start",
    },
    aview: {
        alignSelf: 'center',
        height: 12 + Dimensions.get('screen').width / 3,
        width: 12 + Dimensions.get('screen').width / 3,
        borderRadius: Dimensions.get('screen').width / 1.5,
        backgroundColor: '#f2f2f3',
        borderColor: '#a3cbe0',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
});