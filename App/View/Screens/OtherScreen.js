import React from 'react';
import { View, Text, StyleSheet, Touchable } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import IconIo from 'react-native-vector-icons/Ionicons';


OtherScreen = ({ navigation, route }) => {
    const feed_type = route.name
    return (
        <View style={{ alignSelf: 'center' }}>

            <TouchableOpacity
                onPress={() => navigation.navigate('ChatScreen')}
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    backgroundColor: '#fff000',
                    borderRadius: 20,
                    height: 30,
                    width: '70%',

                }}>
                <IconIo
                    name={'chatbubbles'}
                    size={20}
                    color={'rgb(120,90,140)'}
                />
                <Text>ChatScreen</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('DonationScreen')}
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    backgroundColor: '#fff000',
                    borderRadius: 20,
                    height: 30,
                    width: '70%',

                }}>
                <IconIo
                    name={'chatbubbles'}
                    size={20}
                    color={'rgb(120,90,140)'}
                />
                <Text>Donate</Text>
            </TouchableOpacity>
        </View>

    )
}

const styles = StyleSheet.create({

});


export default OtherScreen;