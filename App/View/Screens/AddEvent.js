import React, { useState, useLayoutEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableWithoutFeedback, Keyboard, TextInput, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useHeaderHeight } from '@react-navigation/stack';
import { launchImageLibrary } from 'react-native-image-picker';
import { KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons'
import { Image } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { Platform } from 'react-native';

function AddEvent({ navigation, route }) {
    const [eventName, setEventName] = useState('');
    const [eventDesc, setEventDesc] = useState('');
    const [eventTime, setEventTime] = useState(new Date());
    const [eventImage, setEventImage] = useState()
    const [loading, setLoading] = useState(false)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const headerHeight = useHeaderHeight()

    // create a readble date dd.mm.yyyy hh:mm from Date obj
    dateToReadbleFormat = (date) => date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + ' ' + (date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()) + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
    const handleDateConfirm = (date) => {
        setEventTime(date)
        setDatePickerVisibility(false);
    };



    // set header title
    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'צור אירוע חדש'
        });
    }, [navigation])

    function makeid(length) {  //function to generate random chat id incase that the id is already in use.
        var result = [];
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result.push(characters.charAt(Math.floor(Math.random() *
                charactersLength)));
        }
        return result.join('');
    }

    function fillAllFields() {      //alert function in case there is name or premission missing
        Alert.alert(
            "Please fill all the fields",
            "ok?", [{ text: "OK", style: "cancel" }],
            { cancelable: true }
        );
    }



    // this function upload the avatar image into the storage
    function selectImage() {
        // lunching the camera roll / gallery
        // lunching the camera roll / gallery
        launchImageLibrary({ maxWidth: 600, maxHeight: 400 }, async response => {
            if (response.didCancel) {
                return;
            } else if (response.error) {
                Alert.alert(
                    'Error',
                    response.errorCode + ': ' + response.errorMessage,
                    [{ text: 'OK' }],
                    { cancelable: false },
                );
            } else {
                setEventImage(response.uri)
            }
        });


    }

    async function createEvent() {        //creating new event into firestore
        if (loading)
            return;
        if (eventName.length < 1 || eventDesc.length < 1) {
            fillAllFields()
            return
        }
        setLoading(true)
        let event_id = makeid(20);
        let new_event = {
            attendings: [],
            description: eventDesc,
            date: firestore.Timestamp.fromDate(eventTime),
            name: eventName,
            key: event_id,
            image: ''
        }
        if (eventImage) {
            const reference = storage().ref('/events/' + event_id + '.png');
            await reference.putFile(eventImage);
            reference.getDownloadURL().then(url => {
                new_event.image = url
                firestore().collection('Events').doc(event_id).set(new_event)
                    .then(() => { navigation.goBack() }).catch((error) => { setLoading(false); alert(error) })
            })
                .catch((error) => { setLoading(false); alert(error) })
        } else {
            firestore().collection('Events').doc(event_id).set(new_event)
                .then(() => { navigation.goBack() }).catch((error) => { setLoading(false); alert(error) })
        }

    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                keyboardVerticalOffset={headerHeight}
                style={styles.main}
                behavior={Platform.OS == 'ios' ? "padding" : false} >
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', margin: 5 }}>
                        אנא בחר את שם האירוע החדש
                    </Text>
                    <TextInput
                        style={styles.editable}
                        value={eventName}
                        autoCorrect={false}
                        autoCompleteType={'off'}
                        onChangeText={setEventName}
                        placeholder={'הכנס את שם האירוע כאן...'} />
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', margin: 5 }}>
                        הוסף תיאור לאירוע
                    </Text>
                    <TextInput
                        style={styles.editable}
                        value={eventDesc}
                        onChangeText={setEventDesc}
                        placeholder={'הכנס את התיאור כאן...'} />
                </View>
                <View style={{ width: '90%', alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <View style={{ width: '100%', alignItems: 'center', justifyContent: 'space-evenly' }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', margin: 5 }}>מתי יתקיים האירוע?</Text>
                        <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.editable}>
                            <Text style={{ fontSize: 18 }}>{dateToReadbleFormat(eventTime)}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: '80%', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', margin: 5 }}>תמונת האירוע:</Text>
                        <TouchableOpacity style={[styles.editable, { minWidth: 0 }]} onPress={() => selectImage()}>
                            {eventImage ?
                                <Image style={{ height: 40, width: 50 }} source={{ uri: eventImage }} />
                                :
                                <Icon name={'image'} size={40} color={'#0d5794'} />

                            }
                        </TouchableOpacity>
                    </View>
                </View>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode='datetime'
                    date={eventTime}
                    onConfirm={handleDateConfirm}
                    onCancel={() => setDatePickerVisibility(false)}
                />
                <TouchableOpacity
                    style={styles.submit}
                    onPress={() => createEvent()}>
                    {loading ?
                        <ActivityIndicator color={'#fff'} size={'small'} />
                        :
                        <Text style={{ fontSize: 22, color: '#fff', fontWeight: 'bold' }}>קבע את האירוע</Text>
                    }
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    main: {
        justifyContent: 'space-evenly',
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f2f2f3',
        padding: 15
    },
    editable: {
        minWidth: 100,
        textAlign: 'right',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#aaa',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 3,
        padding: 8
    },
    submit: {
        backgroundColor: '#0d5794',
        width: Dimensions.get('screen').width * (85 / 100),
        alignItems: 'center',
        borderRadius: 50,
        height: 12 + Dimensions.get('screen').width / 10,
        justifyContent: 'center',
    }
});
export default AddEvent;