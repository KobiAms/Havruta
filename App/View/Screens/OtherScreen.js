import React, { useEffect, useState } from 'react';
import { useLayoutEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { Dimensions } from 'react-native';
import { View, Text, StyleSheet } from 'react-native';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';

const secondLayout = [
    {
        width: 100,
        height: Dimensions.get('window').height * 0.02,
        marginBottom: 10,
    },
    {
        width: 200,
        height: Dimensions.get('window').height * 0.04,
        marginBottom: 10,
    },
    {
        width: '100%',
        height: Dimensions.get('window').height * 0.10,
        marginBottom: 10,
    },
    {
        width: "100%",
        height: Dimensions.get('window').height * 0.04,
    }
];

const INTERVAL_REFRESH = 3000;

OtherScreen = ({ navigation, route }) => {

    const [isLoading, setIsLoading] = useState(true);
    const feed_type = route.name
    return (
        <View style={{ flex: 1 }}>
            <SkeletonContent
                containerStyle={styles.skeleton}
                layout={secondLayout}
                isLoading={isLoading}>
            </SkeletonContent>
        </View>

    )
}

const styles = StyleSheet.create({

    skeleton: {
        margin: 5,
        borderRadius: 5,
        backgroundColor: 'rgb(220,220,240)',
        minWidth: '97%',
        padding: 20,
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 3.27,
        elevation: 10,
    }
});



export default OtherScreen;