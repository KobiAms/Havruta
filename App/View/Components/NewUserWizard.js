import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Keyboard,
    TouchableWithoutFeedback,
    Image,
    KeyboardAvoidingView
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/stack';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import auth from '@react-native-firebase/auth';
import { ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons'
import { launchImageLibrary } from 'react-native-image-picker';
import { Alert } from 'react-native';
/**A wizard to complete all of the missing data about a new user */
export default function NewUserWizard() {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [editDate, setEditDate] = useState(new Date());
    const [userDOB, setuserDOB] = useState(new Date());
    const [editAbout, setEditAbout] = useState('');
    const [loading, setLoading] = useState(false)
    const [userName, setuserName] = useState('');
    const [userImage, setuserImage] = useState();
    const headerHeight = useHeaderHeight() - 100;

    // create a readble date dd.mm.yyyy from Date obj
    dateToReadbleFormat = (date) => date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();

    // gets the date from date alert after confirm date
    const handleDateConfirm = (date) => {
        setEditDate(date)
        setuserDOB(date)
        setDatePickerVisibility(false);
    };

    /**write the new data to the database */
    async function setSubmit() {
        if (loading)
            return
        setLoading(true)
        let user_new_data = {
            about: editAbout,
            dob: firestore.Timestamp.fromDate(editDate),
            isNew: false,
            photo: ''
        }

        if (userImage) {
            const reference = storage().ref(
                '/users/' + auth().currentUser.email + '/' + 'user_image.png',
            );
            await reference.putFile(userImage);
            reference.getDownloadURL()
                .then(url => {
                    user_new_data.photo = url;
                    firestore().collection('users').doc(auth().currentUser.email).update(user_new_data)
                        .then(() => {
                        })
                        .catch(err => {
                            Alert.alert('אירעה שגיאה!', 'אנא נסה שנית', [{ text: "בסדר", }], { cancelable: false })
                            setLoading(false)
                        })
                }).catch(err => {
                    Alert.alert('אירעה שגיאה!', 'אנא נסה שנית', [{ text: "בסדר", }], { cancelable: false })
                    setLoading(false)
                })
        }
        else {
            firestore().collection('users').doc(auth().currentUser.email).update(user_new_data).then(() => {
            }).catch(err => {
                Alert.alert('אירעה שגיאה!', 'אנא נסה שנית', [{ text: "בסדר", }], { cancelable: false })
                setLoading(false)
            })
        }
    }

    // this function upload the avatar image into the storage
    function selectImage() {
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
                setuserImage(response.uri)
            }
        });
    }

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

                        <Text style={{ fontSize: 18, alignSelf: 'center' }}>אנחנו שמחים שהצטרפת אלינו! בבקשה מלא את הפרטים הבאים כדי שנוכל להכיר אותך טוב יותר</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', margin: 10 }}>אנא בחר את תאריך הלידה שלך:</Text>
                        <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.editable}>
                            <Text style={{ fontSize: 18 }}>{dateToReadbleFormat(userDOB)}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ margin: 10, alignSelf: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', margin: 10 }}>ספר לנו קצת על עצמך.</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', margin: 10 }}>שים לב, משתמשים אחרים יכולו לקרוא את זה</Text>
                        <AutoGrowingTextInput
                            style={styles.editable}
                            value={editAbout}
                            onChangeText={setEditAbout}
                            placeholder={'ספר לנו על עצמך...'} />
                    </View>
                    <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', margin: 10 }}>בחר תמונת פרופיל:</Text>
                        <TouchableOpacity style={[styles.editable, { minWidth: 0 }]} onPress={() => selectImage()}>
                            {userImage ?
                                <Image style={{ height: 40, width: 50 }} source={{ uri: userImage }} />
                                :
                                <Icon name={'image'} size={40} color={'#0d5794'} />

                            }
                        </TouchableOpacity>
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