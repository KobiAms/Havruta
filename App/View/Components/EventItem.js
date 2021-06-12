import React, { useState } from 'react'
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    View,
    Alert,
    Dimensions,
    Image
} from 'react-native';
import auth from '@react-native-firebase/auth';
import IconMI from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { ActivityIndicator } from 'react-native';

// create a readble date dd.mm.yyyy hh:mm from Date obj
dateToReadbleFormat = (date) => date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + ' ' + (date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()) + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());

/**an item in the list. shows the details about the event. also makes it possible to attend/unattend */
export default function EventItem({ data, isAdmin, navigation, id, navigator }) {
    const [isAttend, setisAttend] = useState(auth().currentUser && data.attendings ? data.attendings.includes(auth().currentUser.email) : false)
    const [participent, setParticipent] = useState(data.attendings ? data.attendings.length : 0);
    const eventData = data
    const [deleted, setDeleted] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false)
    /** this function is add you or remove from a certian event in firebase */
    function attend() {
        if (auth().currentUser) {
            if (!isAttend) {
                firestore().collection('Events').doc(id).update({
                    attendings: firestore.FieldValue.arrayUnion(auth().currentUser.email)
                })
                    .then(() => { setisAttend(true); setParticipent(prev => prev + 1) })
                    .catch(err => console.log(err.code))
            }
            else {
                firestore().collection('Events').doc(id).update({
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

    function deleteEvent() {
        if (deleteLoading)
            return
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
                            setDeleteLoading(true)
                            firestore().collection('Events').doc(id).delete()
                                .then(() => {
                                    setDeleted(true)
                                    setDeleteLoading(false)
                                })
                                .catch(err => {
                                    setDeleteLoading(false)
                                    alert(err);
                                })
                            if (data.image && data.image.length > 0) {
                                const reference = storage().ref('/events/' + id + '.png');
                                reference.delete().catch(err => console.log(err))
                            }
                        },
                        style: 'destructive'
                    }
                ]
            )
        }
    }

    /**the render of the "EventItem" */
    return (

        <View style={[styles.item, { opacity: deleted ? 0.5 : 1 }]}>
            {
                data.image && data.image.length > 0 ?
                    <Image source={{ uri: data.image }} style={styles.backgroundImage} />
                    : null
            }
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', margin: 15 }}>
                <View style={{ width: '100%', padding: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    {
                        deleteLoading ? (

                            <View onPress={() => deleteEvent(id)} style={{ position: 'absolute', padding: 10, left: 10 }}>
                                <ActivityIndicator color={'#0d5794'} size={'small'} />
                            </View>
                        )
                            :
                            null
                    }
                    {
                        isAdmin && !deleted ? (

                            <TouchableOpacity onPress={() => deleteEvent(id)} style={{ position: 'absolute', padding: 10, left: 0 }}>
                                <IconMI color={deleted ? '#080' : '#900'} size={30} name={deleted ? 'replay-circle-filled' : 'cancel'} />
                            </TouchableOpacity>
                        )
                            :
                            null
                    }
                    <Text style={{ position: 'absolute', right: 10, fontSize: 17, color: '#444', padding: 8 }}>{ }</Text>
                </View>
                <Text style={{ color: '#0d5794', fontSize: 22, fontWeight: 'bold', textAlign: 'right', padding: 8, backgroundColor: '#fff8', borderRadius: 5, overflow: 'hidden' }}>{data.name}</Text>
                <Text style={{ color: '#0d5794', fontSize: 17, padding: 8, maxWidth: '90%', textAlign: 'right', borderRadius: 5, overflow: 'hidden', fontWeight: '400', backgroundColor: '#fffb', }}>{data.description}</Text>
                <TouchableOpacity style={[styles.attend, { margin: 20 }]}
                    onPress={() => attend(data.key)}>
                    <View >
                        <Text style={{ color: isAttend ? '#900' : '#080', fontWeight: 'bold' }}>אני {isAttend ? 'לא' : ''} מגיע</Text>
                    </View>
                    <View style={{ position: 'absolute', left: 10, padding: 5 }}>
                        <Text style={{ color: isAttend ? '#900' : '#080', fontSize: 17, fontWeight: 'bold' }}>{participent}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View >
    );
};


const styles = StyleSheet.create({
    item: {
        width: Dimensions.get('window').width * 0.97,
        borderRadius: 5,
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
        backgroundColor: '#fff'

    },
    attend: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: Dimensions.get('screen').width / 3,
        width: Dimensions.get('screen').width * (70 / 100),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 1,
        shadowRadius: 3.27,
        elevation: 3,
    },
    textRow: {
        alignItems: 'center',
        margin: 10,
    },
    backgroundImage: {
        height: '100%',
        width: '100%',
        resizeMode: 'cover', // or 'stretch'
        position: 'absolute',
        alignSelf: 'center',
        opacity: 0.35
    }

});
