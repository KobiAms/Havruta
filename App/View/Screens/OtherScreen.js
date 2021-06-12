/* eslint-disable prettier/prettier */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Touchable } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import IconIo from 'react-native-vector-icons/Ionicons';
import IconFA5 from 'react-native-vector-icons/FontAwesome5';
import IconFA from 'react-native-vector-icons/FontAwesome';

import { Dimensions } from 'react-native';



function OtherScreen({ navigation, route }) {
    const [isLoading, setIsLoading] = useState(true);
    const feed_type = route.name;

    return (
        <View style={styles.main}>
            <TouchableOpacity
                onPress={() => navigation.navigate('AboutScreen')}
                style={styles.toScreen}>
                <IconFA
                    name={'question-circle'}
                    size={20}
                    color={'#fff'}
                />
                <Text style={{ color: '#fff' }}>על העמותה</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('DonationScreen')}
                style={styles.toScreen}>
                <IconFA5
                    name={'donate'}
                    size={20}
                    color={'#fff'}
                />
                <Text style={{ color: '#fff' }}>לתרומה לחץ כאן</Text>
            </TouchableOpacity>
            <View style={{ padding: 5 }}>
                <Text>הנה עוד כמה קטגוריות לכתבות:</Text>
                <View style={{ flexDirection: 'row-reverse' }}>
                    <TouchableOpacity style={styles.toFeed} onPress={() => navigation.navigate('GenericFeed', { category_id: 122 })}>
                        <Text style={{ color: '#fff' }}>חדשות</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.toFeed} onPress={() => navigation.navigate('GenericFeed', { category_id: 117 })}>
                        <Text style={{ color: '#fff' }}>אירועים</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.toFeed} onPress={() => navigation.navigate('GenericFeed', { category_id: 122 })}>
                        <Text style={{ color: '#fff' }}>מגזין א</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row-reverse' }}>
                    <TouchableOpacity style={styles.toFeed} onPress={() => navigation.navigate('GenericFeed', { category_id: 122 })}>
                        <Text style={{ color: '#fff' }}>מגזין א</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.toFeed} onPress={() => navigation.navigate('GenericFeed', { category_id: 122 })}>
                        <Text style={{ color: '#fff' }}>מגזין א</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.toFeed} onPress={() => navigation.navigate('GenericFeed', { category_id: 122 })}>
                        <Text style={{ color: '#fff' }}>מגזין א</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    main: {
        alignItems: 'center',
        backgroundColor: '#f0fbff',
        flex: 1,
        width: Dimensions.get('screen').width,
        justifyContent: 'center',
    },
    toScreen: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: '#0d5794',
        borderRadius: 20,
        padding: 10,
        margin: 10,
        width: Dimensions.get('screen').width * (85 / 100),
    },
    toFeed: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: '#0d5794',
        borderRadius: 20,
        padding: 10,
        margin: 10,
        width: Dimensions.get('screen').width * (25 / 100),

    },

});

export default OtherScreen;