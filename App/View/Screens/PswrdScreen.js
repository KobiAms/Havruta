/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    TextInput,
    Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';



function PswrdScreen({ navigation, route }) {
    const [password, setPassword] = useState('')
    let item = route.params.data;
    let mode = route.params.mode;
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
                            onChangeText={setPassword}
                            value={password}
                            placeholder={'הכנס סיסמא'}
                            secureTextEntry={true}
                        />
                        <TouchableOpacity style={styles.submit} onPress={() => validPassword(password)}>
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>התחבר</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    null
            }
        </View>
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
