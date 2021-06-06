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
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import IconAw from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/AntDesign';
import { SafeAreaView } from 'react-native';
import { Button } from 'native-base';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';


export default EventsList = () => {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [list_to_show, setShow] = useState(events);

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

    EventItem = ({ name, attends, desc }) => {
        return (
            <TouchableOpacity style={styles.item}>
                {console.log(events)}
                <Text>{name}</Text>
                <Text>{attends}</Text>
                <Text>{desc}</Text>
            </TouchableOpacity>
        );
    };



    return (
        <View style={styles.main}>
            <SafeAreaView style={{ flex: 0, backgroundColor: 'rgb(120,90,140)' }} />
            <SafeAreaView style={styles.main}>
                <View style={styles.body}>

                    <View style={styles.list_container}>
                        {loading ? (
                            <ActivityIndicator size="large" color="dodgerblue" />
                        ) : (
                            <FlatList
                                style={styles.list}
                                data={list_to_show}
                                renderItem={({ item }) => (
                                    <View>
                                        <EventItem
                                            name={item.name}
                                            attends={item.attendings.length}
                                            desc={item.description}
                                        />
                                        <Button
                                            onPress={() => {
                                                if (auth().currentUser != null) {
                                                    auth().currentUser.updateProfile({})
                                                        .then(() => {
                                                            newAttends = item.attendings;

                                                            if (!newAttends.includes(auth().currentUser.email)) {
                                                                newAttends.push(auth().currentUser.email);
                                                                firestore().collection('Events').doc(item.key)
                                                                    .update({
                                                                        attendings: newAttends
                                                                    })
                                                                    .then(() => {
                                                                        Alert.alert("We will inform you the time and location!");
                                                                    })
                                                            }
                                                            else {
                                                                Alert.alert("You have already confirmed your attending");
                                                            }
                                                        })
                                                        .catch((error) => {
                                                            console.log(error.code)
                                                        })
                                                }
                                                else{
                                                    console.log("You have to be registered to attend an event");
                                                }
                                            }
                                            } title={item.key}>
                                            <Text>attend</Text>
                                        </Button>
                                    </View>
                                )}
                            />
                        )}
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
    },
    header: {
        width: '100%',
        height: '10%',
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
    body: {
        height: '90%',
        width: '100%',
    },

    search_button: {
        height: '80%',
        width: Dimensions.get('screen').width * 0.11,
        backgroundColor: 'rgba(238, 238, 238, 1)',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',
    },
    list_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height / 10,
        backgroundColor: 'rgb(230,230,250)',
        marginBottom: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
    },
});
