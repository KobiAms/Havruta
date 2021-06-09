import React, { useEffect, useState } from 'react';
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    View,
    Alert,
    Dimensions,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native';
import auth from '@react-native-firebase/auth';
import IconIo from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';

/** A screen that displays all the events in the that is in the firestore collection */
function EventsScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [list_to_show, setShow] = useState(events);
    const [isAdmin, setIsAdmin] = useState(false);

    /*this useEffect update the state "isAdmin" after checking it's role on firebase*/
    useEffect(() => {
        const subscriber = firestore()
            .collection('users')
            .doc(auth().currentUser.email)
            .get().then(doc => {
                if (!doc) return;
                if (doc.data().role === 'admin') setIsAdmin(true);
            })
            .catch(err => console.log(err.code))
        return subscriber;
    }, []);

    /*this useEffect update the state array "events" and "list_to_show", and put an array of objects.
   each object contains all the information about an event in the collection
   this goes onSnapshot, which mean every update that happen on the server side will be push automaticly to the local device */
    useEffect(() => {
        const subscriber = firestore()
            .collection('Events')
            .onSnapshot(querySnapshot => {
                const events = [];
                if (!querySnapshot) return;
                querySnapshot.forEach(documentSnapshot => {
                    events.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                });
                setEvents(events);
                setShow(events);
                setLoading(false);
            });
        return subscriber;
    }, []);


    /**an item in the list. shows the details about the event. also makes it possible to attend/unattend */
    function EventItem({ data }) {
        const [isAttend, setisAttend] = useState(auth().currentUser && data.attendings ? data.attendings.includes(auth().currentUser.email) : false)
        const [participent, setParticipent] = useState([]);

        /** this function is add you or remove from a certian event in firebase */
        function attend(key) {
            if (auth().currentUser) {
                if (!isAttend) {
                    firestore().collection('Events').doc(key).update({
                        attendings: firestore.FieldValue.arrayUnion(auth().currentUser.email)
                    })
                        .then(() => { setisAttend(true); Alert.alert("We will inform you the time and location!"); })
                        .catch(err => console.log(err.code))
                }
                else {
                    firestore().collection('Events').doc(key).update({
                        attendings: firestore.FieldValue.arrayRemove(auth().currentUser.email)
                    })
                        .then(() => { setisAttend(false); Alert.alert("you have been removed yourself from attending this event") })
                        .catch(err => console.log(err.code))
                }
            }
            else {
                Alert.alert("You must be registered in order to attend an event");
            }
        }
        /**on render, this useEffect update the number of participents.  */
        useEffect(() => {
            if (data) {
                if (data.attendings) setParticipent(data.attendings.length);
                else setParticipent(0);
            }
        }, [])

        /**the render of the "EventItem" */
        return (
            <View style={styles.item}>
                {data ? (<View>
                    <View>
                        <View style={{}}>
                            <Text>שם האירוע: </Text>
                            <Text style={{ fontSize: 22, fontWeight: 'bold', padding: 8, textAlign: 'right' }}>{data.name}</Text>
                        </View>
                        <View style={styles.textRow}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{participent}</Text>
                            <Text style={{ padding: 8 }}> משתמשים אישרו הגעה.</Text>
                        </View>
                        <View style={{}}>
                            <Text>תיאור: </Text>
                            <Text style={{ fontSize: 17, fontWeight: 'bold', padding: 8, textAlign: 'right' }}>{data.description}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={isAttend ? styles.unattend : styles.attend}
                        onPress={() => attend(data.key)}>
                        <IconIo name={isAttend ? 'albums' : 'albums-outline'} size={22} style={{ margin: 8 }} color={isAttend ? '#e55a5a' : '#5ba92c'}></IconIo>
                        {isAttend ?
                            <Text style={{ color: '#e55a5a', fontWeight: 'bold' }}>אני לא אגיע ל {data.name}</Text>
                            : <Text style={{ color: '#5ba92c', fontWeight: 'bold' }}>אני מגיע ל{data.name}</Text>
                        }
                    </TouchableOpacity>
                </View>) : null}
            </View>
        );
    };

    /**the render of "EventScreen" */
    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.body}>
                <View style={styles.list_container}>
                    {loading ? (
                        <ActivityIndicator size="large" color="dodgerblue" />
                    ) : (
                        <FlatList
                            data={list_to_show}
                            renderItem={({ item }) => (<EventItem data={item} />)}
                        />
                    )}
                </View>
                {isAdmin ?
                    <TouchableOpacity
                        style={styles.adder}
                        onPress={() => navigation.navigate('AddEvent', { data: events })}>
                        <IconIo name={'add-circle'} color={'#0d5794'} size={65} />
                    </TouchableOpacity> : null}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#f0fbff',
        direction: 'rtl',
    },
    body: {
        height: '100%',
        width: '100%',
    },
    attend: {
        //backgroundColor: '#5ba92c',
        borderColor: '#5ba92c',
        borderWidth: 3.5,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        padding: 5,
        borderRadius: Dimensions.get('screen').width / 3,
        width: Dimensions.get('screen').width * (70 / 100),
    },
    unattend: {
        //backgroundColor: '#e55a5a',
        borderColor: '#e55a5a',
        borderWidth: 3.5,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        padding: 5,
        borderRadius: Dimensions.get('screen').width / 3,
        width: Dimensions.get('screen').width * (70 / 100),
    },
    textRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        margin: 10,
    },
    list_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        width: Dimensions.get('window').width * (97 / 100),
        borderRadius: 5,
        alignSelf: 'center',
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 10,
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
    adder: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        zIndex: 1,
        margin: 20,
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
});
export default EventsScreen;