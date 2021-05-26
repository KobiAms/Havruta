import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'

export default ManageUser = ({ navigation, route }) => {
    return (
        <View style={styles.main}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.back_button} onPress={() => navigation.goBack()}>
                    <Icon name={'arrow-left'} size={20} />
                </TouchableOpacity>
                <Text style={styles.screen_title}>
                    Havruta
                </Text>
                <View style={[styles.back_button, { backgroundColor: 'rgba(0,0,0,0)' }]}>
                </View>
            </View>
            <View style={styles.body}>
                <Text>{JSON.stringify(route.params.data)}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
    },
    header: {
        width: '100%',
        height: Dimensions.get('screen').height / 10,
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
        color: 'rgb(255,255,255)'
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
        justifyContent: 'center'
    },
    body: {
        width: '100%',
        height: Dimensions.get('screen').height * (9 / 10),
        alignItems: 'center',
        justifyContent: 'center'
    }
})