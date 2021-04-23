import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

ArticleScreen = ({ navigation }) => {
    const feed_type = route.name
    return (
        <View style={styles.main}>
            <Text style={styles.headline}>
                {feed_type}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    headline: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'rgb(0,127,255)'
    }
});


export default ArticleScreen;