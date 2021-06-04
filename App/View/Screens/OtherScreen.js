import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Wizard from '../Components/NewUserWizard';
OtherScreen = ({ navigation, route }) => {
    const feed_type = route.name
    return (
        <View style={{ flex: 1 }}>

            <Wizard />
        </View>

    )
}

const styles = StyleSheet.create({

});


export default OtherScreen;