import React, { useEffect, useState } from 'react'
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    View,
    Alert,
    Dimensions,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import IconMI from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import { ActivityIndicator } from 'react-native';

dateToReadbleFormat = (date) => date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();

/**an item in the list. shows the details about the event. also makes it possible to attend/unattend */
export default function EventItem({ data, isAdmin, navigation }) {
    const [isAttend, setisAttend] = useState(auth().currentUser && data.attendings ? data.attendings.includes(auth().currentUser.email) : false)
    const [participent, setParticipent] = useState(data.attendings ? data.attendings.length : 0);
    const eventData = data
    const [deleted, setDeleted] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false)
    /** this function is add you or remove from a certian event in firebase */
    function attend(key) {
        if (auth().currentUser) {
            if (!isAttend) {
                firestore().collection('Events').doc(key).update({
                    attendings: firestore.FieldValue.arrayUnion(auth().currentUser.email)
                })
                    .then(() => { setisAttend(true); setParticipent(prev => prev + 1) })
                    .catch(err => console.log(err.code))
            }
            else {
                firestore().collection('Events').doc(key).update({
                    attendings: firestore.FieldValue.arrayRemove(auth().currentUser.email)
                })
                    .then(() => { setisAttend(false); setParticipent(prev => prev - 1) })
                    .catch(err => console.log(err.code))
            }
        }
        else {
            Alert.alert(
                'אינך מחובר!',
                'תרצה להתחבר כעת?',
                [
                    {
                        text: "ביטול",
                        style: "cancel"
                    },
                    {
                        text: "כן",
                        onPress: () => navigation.navigate('Registration'),
                        style: 'destructive'
                    }
                ]
            )
        }
    }

    function deleteEvent(key) {
        if (deleteLoading)
            return
        setDeleteLoading(true)
        if (!deleted) {
            Alert.alert(
                'מחיקת אירוע לצמיתות!',
                'האם אתה בטוח?',
                [
                    {
                        text: "ביטול",
                        style: "cancel"
                    },
                    {
                        text: "מחק",
                        onPress: () => {
                            firestore().collection('Events').doc('events').update({
                                events: firestore.FieldValue.arrayRemove(data)
                            })
                                .then(() => {
                                    setDeleted(true)
                                    setDeleteLoading(false)
                                })
                                .catch(err => {
                                    setDeleteLoading(false)
                                    alert(err);
                                })
                        },
                        style: 'destructive'
                    }
                ]
            )
        }
    }

    /**the render of the "EventItem" */
    return (
        <View style={[styles.item, { backgroundColor: deleted ? '#fffa' : '#fff' }]}>
            <View style={{ width: '100%', padding: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                {
                    deleteLoading ? (

                        <View onPress={() => deleteEvent(data.key)} style={{ position: 'absolute', padding: 10, left: 10 }}>
                            <ActivityIndicator color={'#0d5794'} size={'small'} />
                        </View>
                    )
                        :
                        null
                }
                {
                    isAdmin && !deleteLoading ? (

                        <TouchableOpacity onPress={() => deleteEvent(data.key)} style={{ position: 'absolute', padding: 10, left: 0 }}>
                            <IconMI color={deleted ? '#060' : '#500'} size={30} name={deleted ? 'replay-circle-filled' : 'cancel'} />
                        </TouchableOpacity>
                    )
                        :
                        null
                }
                <Text style={{ position: 'absolute', right: 10, fontSize: 17, color: '#444', padding: 8 }}>{dateToReadbleFormat(data.date.toDate())}</Text>
            </View>
            <Text style={{ fontSize: 22, fontWeight: 'bold', padding: 8 }}>{data.name}</Text>
            <Text style={{ fontSize: 17, padding: 8, width: '90%', textAlign: 'right' }}>{data.description}</Text>
            <TouchableOpacity style={[isAttend ? styles.unattend : styles.attend, { margin: 20 }]}
                onPress={() => attend(data.key)}>
                <View >
                    <Text style={{ color: isAttend ? '#e55a5a' : '#5ba92c', fontWeight: 'bold' }}>אני {isAttend ? 'לא' : ''} מגיע</Text>
                </View>
                <View style={{ position: 'absolute', left: 10, padding: 5 }}>
                    <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{participent}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    item: {
        width: Dimensions.get('window').width * 0.97,
        borderRadius: 5,
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 20,
        margin: 5,
        flex: 1,
        minWidth: '97%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 1,
        shadowRadius: 3.27,
        elevation: 5,

    },
    attend: {
        borderColor: '#5ba92c',
        borderWidth: 1.5,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: Dimensions.get('screen').width / 3,
        width: Dimensions.get('screen').width * (70 / 100),
    },
    unattend: {
        borderColor: '#e55a5a',
        padding: 10,
        borderWidth: 1.5,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: Dimensions.get('screen').width / 3,
        width: Dimensions.get('screen').width * (70 / 100),
    },
    textRow: {
        alignItems: 'center',
        margin: 10,
    },

});
