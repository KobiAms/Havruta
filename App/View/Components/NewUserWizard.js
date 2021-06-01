import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import firestore from '@react-native-firebase/firestore';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import auth from '@react-native-firebase/auth';

export default function NewUserWizard() {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [editDate, setEditDate] = useState();
    const [userDOB, setuserDOB] = useState('6.9.1969');
    const [editAbout, setEditAbout] = useState('');
    const [userName, setuserName] = useState('');

    // create a readble date dd.mm.yyyy from Date obj
    dateToReadbleFormat = (date) => date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();

    // gets the date from date alert after confirm date
    const handleDateConfirm = (date) => {
        setEditDate(date)
        setuserDOB(dateToReadbleFormat(date))
        setDatePickerVisibility(false);
    };

    function setSubmit() {
        if (auth().currentUser.displayName === userName) {
            firestore().collection('users').doc(auth().currentUser.email)
                .update({
                    about: editAbout,
                    dob: firestore.Timestamp.fromDate(editDate)
                })
                .then()
                .catch(err => {
                    console.log(err.code);
                })
        }
    }
    useEffect(() => {
        const subscriber = firestore()
            .collection('users')
            .doc(auth().currentUser.email)
            .get()
            .then(doc => {
                if (!doc.data()) {
                    return;
                }
                setuserName(doc.data().name);
                setuserDOB(dateToReadbleFormat(doc.data().dob.toDate()))
                setEditDate(doc.data().dob.toDate())
                auth().currentUser.updateProfile({ displayName: userName })
            })
            .catch(err => console.log(err.code))

        return subscriber
    }, [setuserName])
    return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

            <View style={styles.main}>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    date={editDate}
                    onConfirm={handleDateConfirm}
                    onCancel={() => setDatePickerVisibility(false)}
                />
                <Text style={{ fontSize: 24, fontWeight: 'bold', margin: 10 }}>Welcome {userName}!</Text>
                <Text style={{ fontSize: 18, alignSelf: 'center' }}>It is great having you in our comunity. please fill in your information so we can get to know you better.</Text>
                <View style={{ margin: 10, alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', margin: 10 }}>Please chose your date of birth:</Text>
                    <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.editable}>
                        <Text style={{ fontSize: 18 }}>{userDOB}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ margin: 10, alignSelf: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', margin: 10 }}>Please tell us about yourself. note that other users can see it.</Text>
                    <AutoGrowingTextInput
                        style={styles.editable}
                        value={editAbout}
                        onChangeText={setEditAbout}
                        placeholder={'Add your about here...'} />
                </View>
                <TouchableOpacity
                    style={styles.submit}
                    onPress={() => setSubmit()}>
                    <Text style={{ fontSize: 22, color: '#000', fontWeight: 'bold' }}>Submit</Text>
                </TouchableOpacity>
            </View >
        </TouchableWithoutFeedback>
    )
}
const styles = StyleSheet.create({
    main: {
        justifyContent: 'center',
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgb(200,200,220)',
        padding: 15
    },
    editable: {
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
        backgroundColor: 'rgb(0,240,50)',
        width: Dimensions.get('screen').width * (85 / 100),
        alignItems: 'center',
        borderRadius: 50,
        height: 12 + Dimensions.get('screen').width / 10,
        margin: Dimensions.get('screen').width / 10,
        justifyContent: 'center',
    }
})