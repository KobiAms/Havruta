import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Dimensions,
    RefreshControl,
    FlatList,
} from 'react-native';
import IconIo from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import EventItem from '../Components/EventItem'


/** A screen that displays all the events in the that is in the firestore collection */
function EventsScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [events, setEvents] = useState(['loading', 'loading', 'loading', 'loading']);
    const [isAdmin, setIsAdmin] = useState(false);

    // listen to auth state and get the user data if is log-in
    function onAuthStateChanged(user_state) {
        setIsAdmin(false)
        if (user_state) {
            firestore().collection('users').doc(user_state.email).get()
                .then(doc => {
                    if (!doc) {
                        return
                    } else {
                        setIsAdmin(doc.data().role == 'admin')
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'האירועים שלנו',
        });
    }, [navigation])

    function loadEvents() {
        setEvents(['loading', 'loading', 'loading', 'loading']);
        firestore()
            .collection('Events')
            .get().then(docs => {
                const updated_events = [];
                if (!docs) return;
                docs.forEach(documentSnapshot => {
                    updated_events.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                });
                setEvents(updated_events);
                setRefreshing(false)
            });
    }

    /*this useEffect update the state array "events" and "list_to_show", and put an array of objects.
   each object contains all the information about an event in the collection
   this goes onSnapshot, which mean every update that happen on the server side will be push automaticly to the local device */
    useEffect(() => {
        const subscriber = firestore().collection('Events').doc('events')
            .onSnapshot(doc => {
                if (!(doc && doc.data()))
                    return
                const tmp_events = doc.data().events;
                setEvents(tmp_events)
            })
        return subscriber
    }, []);

    // this function return the correct item to render, choose between: skeleton,item,end
    function item_to_render(item) {
        if (item == 'loading') {
            return (
                <SkeletonContent
                    containerStyle={styles.skeleton}
                    layout={[
                        { width: 100, height: Dimensions.get('screen').height * 0.02, marginBottom: 10, },
                        { width: 200, height: Dimensions.get('screen').height * 0.04, marginBottom: 10, },
                        { width: '100%', height: Dimensions.get('screen').height * 0.10, marginBottom: 10, },
                        { width: "100%", height: Dimensions.get('screen').height * 0.04, }
                    ]}
                    isLoading={true}
                    highlightColor={'#f3f3f4'}
                    boneColor={'#dfdfdf'}>
                </SkeletonContent>
            )
        } else if (item == 'end_list') {
            return (<View style={{ height: 40 }} />)
        } else {
            return (
                <EventItem data={item} isAdmin={isAdmin} navigation={navigation} />
            )
        }
    }

    /**the render of "EventScreen" */
    return (
        <View style={styles.main}>
            <View style={styles.list_container}>
                <FlatList
                    data={[...events, 'end_list']}
                    renderItem={({ item }) => item_to_render(item)}
                    keyExtractor={(item, index) => index}
                    refreshControl={
                        <RefreshControl
                            enabled={true}
                            refreshing={refreshing}
                            onRefresh={() => { setRefreshing(true); loadEvents(); }}
                        />
                    }
                />
            </View>
            {isAdmin ?
                <TouchableOpacity
                    style={styles.adder}
                    onPress={() => navigation.navigate('AddEvent', { data: events })}>
                    <IconIo name={'add-circle'} color={'#0d5794'} size={65} />
                </TouchableOpacity> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#f0fbff',
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
        width: Dimensions.get('window').width * 0.97,
        borderRadius: 5,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
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
        borderRadius: 38,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        margin: 20,
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
    skeleton: {
        margin: 5,
        borderRadius: 5,
        backgroundColor: '#fff',
        minWidth: '97%',
        padding: 20,
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 1,
        shadowRadius: 3.27,
        elevation: 5,
    }
});
export default EventsScreen;