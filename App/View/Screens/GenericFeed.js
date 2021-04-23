import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import SubjectArticles from './SubjectArticles'
import ArticleScreen from './ArticleScreen'
const Stack = createStackNavigator();

GenericFeed = ({ navigation, route }) => {
    const feed_type = route.name
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="SubjectArticles"
                component={SubjectArticles}
                options={{
                    title: 'SubjectArticles',
                    headerStyle: {
                        backgroundColor: 'rgb(245,245,245)',
                        borderBottomWidth: 1,
                        borderBottomColor: 'rgb(200,200,200)'
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />
            <Stack.Screen
                name="ArticleScreen"
                component={ArticleScreen}
                options={{
                    title: 'ArticleScreen',
                    headerStyle: {
                        backgroundColor: 'rgb(245,245,245)',
                        borderBottomWidth: 1,
                        borderBottomColor: 'rgb(200,200,200)'
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />
        </Stack.Navigator>
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


export default GenericFeed;