import React, { useEffect, useState } from 'react';
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    View,
    Alert,
    Dimensions,
    TextInput,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native';
import auth from '@react-native-firebase/auth';
import IconIo from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';

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
        firestore()
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
    }, []);


    /**an item in the list. shows the details about the event. also makes it possible to attend/unattend */
    function EventItem({ data }) {
        const [isAttend, setisAttend] = useState(auth().currentUser ? data.attendings.includes(auth().currentUser.email) : false)

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

        return (
            <View style={styles.item}>
                <View >
                    <View style={styles.textRow}>
                        <Text>Event name: </Text>
                        <Text style={{ fontSize: 22, fontWeight: 'bold', padding: 8 }}>{data.name}</Text>
                    </View>
                    <View style={styles.textRow}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{data.attendings.length}</Text>
                        <Text style={{ padding: 8 }}> participants have so far confirmed their arrival</Text>
                    </View>
                    <View style={styles.textRow}>
                        <Text>Description: </Text>
                        <Text style={{ fontSize: 17, fontWeight: 'bold', width: '85%', padding: 8 }}>{data.description}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.attend}
                    onPress={() => attend(data.key)}>
                    <IconIo name={isAttend ? 'albums' : 'albums-outline'} size={20} style={{ margin: 8 }}></IconIo>
                    {isAttend ?
                        <Text>Unattend to {data.name}</Text>
                        : <Text>attend to {data.name}</Text>
                    }
                </TouchableOpacity>

            </View>
        );
    };

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
                        <IconIo name={'add-circle'} color={'rgb(120,90,140)'} size={65} />
                    </TouchableOpacity> : null}
            </View>
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: 'rgb(200,200,220)',
    },
    body: {
        height: '100%',
        width: '100%',
    },
    attend: {
        backgroundColor: '#fad000',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: Dimensions.get('screen').width / 3,
        width: Dimensions.get('screen').width * (70 / 100),
    },
    textRow: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
    },
    list_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        padding: 20,
        width: Dimensions.get('window').width,
        backgroundColor: 'rgb(250,250,255)',
        marginBottom: 4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
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