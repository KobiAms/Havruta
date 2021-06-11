import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Keyboard,
    TouchableWithoutFeedback,
    Platform,
    KeyboardAvoidingView
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/stack';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import firestore from '@react-native-firebase/firestore';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import auth from '@react-native-firebase/auth';
import { ActivityIndicator } from 'react-native';

/**A wizard to complete all of the missing data about a new user */
export default function NewUserWizard() {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [editDate, setEditDate] = useState();
    const [userDOB, setuserDOB] = useState('6.9.1969');
    const [editAbout, setEditAbout] = useState('');
    const [loading, setLoading] = useState(false)
    const [userName, setuserName] = useState('');
    const headerHeight = useHeaderHeight() - 100;

    // create a readble date dd.mm.yyyy from Date obj
    dateToReadbleFormat = (date) => date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();

    // gets the date from date alert after confirm date
    const handleDateConfirm = (date) => {
        setEditDate(date)
        setuserDOB(dateToReadbleFormat(date))
        setDatePickerVisibility(false);
    };

    /**write the new data to the database */
    function setSubmit() {
        if (loading)
            return
        setLoading(true)
        if (editDate && userName && editAbout) {

            console.log("display name " + auth().currentUser.displayName);
            console.log("firebase name " + userName)
            firestore().collection('users').doc(auth().currentUser.email)
                .update({
                    about: editAbout,
                    dob: firestore.Timestamp.fromDate(editDate),
                    isNew: false
                })
                .then(() => { auth().currentUser.updateProfile({ displayName: userName }); setLoading(false) })
                .catch(err => console.log(err.code))
        }
        else {
            console.log('something went wrong')
        }
    }

    /**this useEffect gets this user information that are currently in the database */
    useEffect(() => {
        if (auth().currentUser) {
            const subscriber = firestore()
                .collection('users')
                .doc(auth().currentUser.email)
                .get()
                .then(doc => {
                    if (!doc.data()) return;
                    setuserName(doc.data().name);
                    setuserDOB(dateToReadbleFormat(doc.data().dob.toDate()));
                    setEditDate(doc.data().dob.toDate());
                    auth().currentUser.updateProfile({ displayName: userName });
                })
                .catch(err => console.log(err.code))
            return subscriber
        }
    }, [setuserName]);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={'padding'}
            keyboardVerticalOffset={headerHeight}>

            <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
                <View style={styles.main}>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        date={editDate}
                        onConfirm={handleDateConfirm}
                        onCancel={() => setDatePickerVisibility(false)}
                    />
                    <View style={{ margin: 10, alignItems: 'center' }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', margin: 10 }}>ברוכים הבאים {userName}!</Text>
                        <Text style={{ fontSize: 18, alignSelf: 'center' }}>איזה כיף שהצטרפת אלינו! בבקשה מלא את הפרטים הבאים כדי שנוכל להכיר אותך טוב יותר</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', margin: 10 }}>אנא בחר את תאריך הלידה שלך:</Text>
                        <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.editable}>
                            <Text style={{ fontSize: 18 }}>{userDOB}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ margin: 10, alignSelf: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', margin: 10 }}>ספר לנו קצת על עצמך.</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', margin: 10 }}>שים לב, משתמשים אחרים יכולו לקרוא את זה</Text>

                        <AutoGrowingTextInput
                            style={styles.editable}
                            value={editAbout}
                            onChangeText={setEditAbout}
                            placeholder={'ספר לנו על עצמך...'} />
                    </View>
                    <TouchableOpacity
                        style={styles.submit}
                        onPress={() => setSubmit()}>
                        {
                            loading ?
                                <ActivityIndicator color={'#fff'} />
                                :
                                <Text style={{ fontSize: 22, color: '#fff', fontWeight: 'bold' }}>סיים</Text>
                        }
                    </TouchableOpacity>
                </View >
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    main: {
        justifyContent: 'center',
        flex: 1,
        alignItems: 'center',
        padding: 15
    },
    editable: {
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
        padding: 7
    },
    submit: {
        backgroundColor: '#0d5794',
        width: Dimensions.get('screen').width * (85 / 100),
        alignItems: 'center',
        borderRadius: 50,
        height: 12 + Dimensions.get('screen').width / 10,
        margin: Dimensions.get('screen').width / 10,
        justifyContent: 'center',
    }
})