/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
    View, Text, TouchableOpacity, Dimensions, StyleSheet, TouchableWithoutFeedback, Keyboard,
    TextInput, Alert, Switch,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

function PswrdScreen({ navigation, route }) {
    const [inputPass, setInputPass] = useState('');
    const [password, setpassword] = useState('');
    const [validEdit, setValidEdit] = useState(false);
    const [isSafe, setisSafe] = useState();
    let item = route.params.data;
    let mode = route.params.mode;
    let id = route.params.id;

    function resetPassword(tryPass) {
        if (id && password === '') {
            firestore().collection('chats').doc(id).get().then(doc => {
                if (!doc.data().isProtected) {
                    setValidEdit(true);
                    setisSafe(false);
                    return;
                }
                if (tryPass === doc.data().password) {
                    setValidEdit(true);
                    setisSafe(doc.data().isProtected);
                }
                else {
                    setpassword(doc.data().password);
                    setisSafe(doc.data().isProtected);
                    Alert.alert('הסיסמא שהוזנה שגויה',
                        'אנא נסה שוב במידה ויש ברשותך את הסיסמא', [{ text: 'OK', style: 'cancel' }],
                        { cancelable: true });
                }
            }).catch(err => console.log(err));
        }
        if (password !== '' && isSafe) {
            if (tryPass === password)
                setValidEdit(true);
            else Alert.alert('הסיסמא שהוזנה שגויה',
                'אנא נסה שוב במידה ויש ברשותך את הסיסמא', [{ text: 'OK', style: 'cancel' }],
                { cancelable: true });
        }
    }
    function updatePassword() {
        if ((inputPass.length >= 4 && isSafe) || !isSafe)
            firestore().collection('chats').doc(id).update({
                isProtected: isSafe,
                password: inputPass,
            }).then(() => { navigation.goBack(); }).catch(e => console.log(e));
        else Alert.alert('הסיסמא שבחרת קצרה מדי', 'בחר סיסמא באורך לפחות 4 תויים', [{ text: 'OK', style: 'cancel' }],
            { cancelable: false });
    }
    function validPassword(tryPass) {
        console.log(item);
        if (item.data.password === tryPass)
            navigation.replace('GenericChat', { id: item.id, chat_name: item.data.name })
        else {
            Alert.alert('הסיסמא שהוזנה שגויה',
                'אנא נסה שוב במידה ויש ברשותך את הסיסמא', [{ text: 'OK', style: 'cancel' }],
                { cancelable: true });
            return;
        }
    }
    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'הזן סיסמא כדי להמשיך',
        });
    }, [navigation])
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.main}>
                {
                    mode === 'INSERT' ?
                        <View style={styles.popup}>
                            <Text style={{ fontSize: 16, fontWeight: '500', margin: 10 }}>צ׳אט זה מוגן באמצעות סיסמא</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', margin: 10 }}>הזן סיסמא כדי להמשיך</Text>
                            <TextInput
                                textAlign={'center'}
                                autoCapitalize={'none'}
                                style={styles.input}
                                onChangeText={setInputPass}
                                value={inputPass}
                                placeholder={'הכנס סיסמא'}
                                secureTextEntry={true}
                            />
                            <TouchableOpacity style={styles.submit} onPress={() => validPassword(inputPass)}>
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>התחבר</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        null
                }
                {validEdit && mode === 'RESET' ?
                    <View style={styles.popup}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', margin: 10 }}>האם לנעול בסיסמא?</Text>
                        <Switch
                            style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }], margin: 15 }}
                            trackColor={{ false: '#444', true: '#DA0000' }}
                            thumbColor={isSafe ? '#F75757' : '#bbb'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => setisSafe(!isSafe)}
                            value={isSafe}
                        />
                        <Text style={{ fontSize: 18, fontWeight: 'bold', margin: 10 }}>הזן סיסמא חדשה</Text>
                        {isSafe ?
                            <TextInput
                                textAlign={'center'}
                                autoCapitalize={'none'}
                                style={styles.input}
                                onChangeText={setInputPass}
                                value={inputPass}
                                placeholder={'הכנס סיסמא'}
                                secureTextEntry={true}
                            /> : <View style={styles.noInput}><Text> ללא סיסמא</Text></View>}
                        <TouchableOpacity style={styles.submit} onPress={() => updatePassword()}>
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>עדכן הגדרות נעילה</Text>
                        </TouchableOpacity>
                    </View> : null
                }
                {!validEdit && mode === 'RESET' ?
                    <View style={styles.popup}>
                        <Text style={{ fontSize: 16, fontWeight: '500', margin: 10 }}>לשינוי הסיסמא והגדרות הנעילה</Text>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', margin: 10 }}>הזן את הסיסמא הנוכחית</Text>
                        <TextInput
                            textAlign={'center'}
                            autoCapitalize={'none'}
                            style={styles.input}
                            onChangeText={setInputPass}
                            value={inputPass}
                            placeholder={'הכנס סיסמא נכוחית'}
                            secureTextEntry={true}
                        />
                        <TouchableOpacity style={styles.submit} onPress={() => resetPassword(inputPass)}>
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>הזן סיסמא</Text>
                        </TouchableOpacity>
                    </View> : null
                }
            </View>
        </TouchableWithoutFeedback>
    );
}
const styles = StyleSheet.create({
    main: {
        backgroundColor: '#00000099',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    popup: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        backgroundColor: '#fff',
        margin: 5,
        width: Dimensions.get('screen').width * 0.9,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 1,
        shadowRadius: 3.27,
        elevation: 5,
    },
    input: {
        width: '80%',
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#0d5794',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        height: 35,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 3,
        padding: 8,
        margin: 5
    },
    noInput: {
        width: '80%',
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#aaa',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        height: 35,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 0,
        padding: 0,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submit: {
        backgroundColor: '#0d5794',
        width: '80%',
        alignItems: 'center',
        borderRadius: 50,
        height: Dimensions.get('screen').width / 10,
        margin: Dimensions.get('screen').width / 12,
        justifyContent: 'center',
    },
});
export default PswrdScreen;
