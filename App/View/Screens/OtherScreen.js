import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text, StyleSheet } from 'react-native';
import Wizard from '../Components/NewUserWizard';
OtherScreen = ({ navigation, route }) => {
    const feed_type = route.name
    return (
        <View style={{ flex: 1 ,alignItems:'center' , justifyContent:'center' }}>

            <TouchableOpacity onPress={()=>{navigation.navigate("donateUs")}}>
                <Text>donate</Text>
            </TouchableOpacity>
        </View>

    )
}

const styles = StyleSheet.create({

});


export default OtherScreen;