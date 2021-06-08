import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Dimensions, StyleSheet, TouchableWithoutFeedback, Keyboard, TextInput, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler';
import SwitchSelector from "react-native-switch-selector";
import DateTimePickerModal from "react-native-modal-datetime-picker";

// create a readble date dd.mm.yyyy hh:mm from Date obj
dateToReadbleFormat = (date) => date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();

function AddEvent({ navigation, route }) {
    const existEvents = route.params.data
    const [eventName, setEventName] = useState('');
    const [eventDesc, setEventDesc] = useState('');
    const [eventTime, setEventTime] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    // create a readble date dd.mm.yyyy hh:mm from Date obj
    dateToReadbleFormat = (date) => date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
    const handleDateConfirm = (date) => {
        setEventTime(date)
        setDatePickerVisibility(false);
    };

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

    function createEvent() {
        if (eventName.length < 1 || eventDesc.length < 1) {
            fillAllFields()
            return
        }
        let event_id = makeid(eventName);
        let new_event = {
            attending: [],
            description: eventDesc,
            details: firestore.Timestamp.fromDate(new Date()),
            name: eventName,
        }
        firestore().collection('Events').doc(event_id)
            .set(new_event)
            .then(() => {
                navigation.goBack()
            })
            .catch((error) => {
                alert(error)
            })
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

            <View style={styles.main}>
                <View style={{ margin: 10, alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', margin: 10 }}>
                        Please chose the new Event name
                    </Text>
                    <TextInput
                        style={styles.editable}
                        value={eventName}
                        onChangeText={setEventName}
                        placeholder={'Add your event name here...'} />
                </View>
                <View style={{ margin: 10, alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', margin: 10 }}>
                        You can add some description about this new event
                    </Text>
                    <TextInput
                        style={styles.editable}
                        value={eventDesc}
                        onChangeText={setEventDesc}
                        placeholder={'Add your description for the event here...'} />
                </View>
                <View style={{ margin: 10, alignItems: 'center' }}>
                    <Text>When the event will take place?</Text>
                    <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={[styles.editable, { minWidth: 100 }]}>
                        <Text style={{ fontSize: 18 }}>{dateToReadbleFormat(eventTime)}</Text>
                    </TouchableOpacity>
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
                    <Text style={{ fontSize: 22, color: '#fff', fontWeight: 'bold' }}>Submit</Text>
                </TouchableOpacity>
            </View >
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    main: {
        justifyContent: 'space-evenly',
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgb(200,200,220)',
        padding: 15
    },
    editable: {
        minWidth: 200,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 6,
        padding: 8,
    },
    submit: {
        backgroundColor: 'rgb(40,120,190)',
        width: Dimensions.get('screen').width * (85 / 100),
        alignItems: 'center',
        borderRadius: 50,
        height: 12 + Dimensions.get('screen').width / 10,
        margin: Dimensions.get('screen').width / 10,
        justifyContent: 'center',
    }
})

export default AddEvent;