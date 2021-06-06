import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import HTMLRend from 'react-native-render-html';

function DonationScreen() {

    return (
        <View style={{ flex: 1 }}>
            <HTMLRend
                source={{ uri: 'https://havruta.org.il/donate/' }}
            >

            </HTMLRend>
        </View>
    )
}
export default DonationScreen;