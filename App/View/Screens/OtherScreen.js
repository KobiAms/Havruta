
import React from 'react';
import { View, Text, StyleSheet, Touchable } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import IconIo from 'react-native-vector-icons/Ionicons';
import IconFA5 from 'react-native-vector-icons/FontAwesome5';
import IconFA from 'react-native-vector-icons/FontAwesome';

import { Dimensions } from 'react-native';


OtherScreen = ({ navigation, route }) => {

    const [isLoading, setIsLoading] = useState(true);
    const feed_type = route.name
    return (

        <View style={styles.main}>

            <TouchableOpacity
                onPress={() => navigation.navigate('ChatScreen')}
                style={styles.toScreen}>
                <IconIo
                    name={'chatbubbles'}
                    size={20}
                    color={'rgb(120,90,140)'}
                />
                <Text>Chats</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('DonationScreen')}
                style={styles.toScreen}>
                <IconFA5
                    name={'donate'}
                    size={20}
                    color={'rgb(120,90,140)'}
                />
                <Text>Donate</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('EventsScreen')}
                style={styles.toScreen}>
                <IconFA
                    name={'calendar'}
                    size={20}
                    color={'rgb(120,90,140)'}
                />
                <Text>Events</Text>
            </TouchableOpacity>


        </View>

    )
}

const styles = StyleSheet.create({

    main: {
        alignItems: 'center',
        backgroundColor: 'rgb(200,200,220)',
        flex: 1,
        width: Dimensions.get('screen').width,
        justifyContent: 'center',
    },
    toScreen: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: '#fff000',
        borderRadius: 20,
        padding: 10,
        margin: 10,
        width: Dimensions.get('screen').width * (85 / 100),
    },

});



export default OtherScreen;