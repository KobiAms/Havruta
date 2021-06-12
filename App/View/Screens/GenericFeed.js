/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { Dimensions, RefreshControl, StyleSheet, View, SafeAreaView } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import PostInFeed from '../Components/PostInFeed';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import axios from 'axios'
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import { ActivityIndicator } from 'react-native';

// function to parse date object to required format: dd.mm.yyyy
dateToReadbleFormat = (date) => date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();

/* -----------------------------------------------------
* this function return the GenericFeed components that disaply an
* array of articles that received from wordpress spesific request
* and request the relevant data (if exsists) from firestore
**/// ---------------------------------------------------
export default function GenericFeed({ navigation, route }) {

    // attribute to hold the articles with the data from FB
    const [fullArticles, setFullArticles] = useState(['loading', 'loading', 'loading', 'loading', 'loading', 'loading', 'loading']);
    const [user, setUser] = useState();
    const [isAdmin, setIsAdmin] = useState(false);
    const [range, setRange] = useState(0)
    const [loading, setLoading] = useState(true)
    const baseURL = 'https://havruta.org.il/wp-json'
    let api = axios.create({ baseURL });

    let parameter;

    useLayoutEffect(() => {
        let title = ''
        if (route.params.toSearch) {
            title = route.params.toSearch
        } else if (route.params.title) {
            title = route.params.title
        } else {
            title = ''
        }
        navigation.setOptions({
            title: title,
        });
    })

    // check if parameter to show received
    if (route.params) {
        // check if in search mode
        if (route.params.toSearch) {
            parameter = 'search=' + route.params.toSearch
        } else {
            parameter = 'categories=' + route.params.category_id
        }
    } else {
        return new Error('GenericFeed: parameter to show must received by the route')
    }

    async function getArticles(params, toAppend) {
        if (range < 0)
            return
        setLoading(true)
        let articles;
        try {
            articles = await api.get('/wp/v2/posts?' + params + "&page=" + (range + 1));
            setRange(prev => prev + 1)
        } catch (error) {
            console.log(error)
            setLoading(false)
            setRange(-1)
            return
        }
        let arts_wp = [];
        for (let i = 0; i < articles.data.length; i++) {
            let obj = {
                id: articles.data[i].id + '',
                content: articles.data[i].content.rendered,
                short: articles.data[i].excerpt.rendered,
                date: dateToReadbleFormat(new Date(articles.data[i].date)),
                autor: articles.data[i].author,
                headline: articles.data[i].title.rendered,
                image_link: articles.data[i]._links['wp:featuredmedia'] ? articles.data[i]._links['wp:featuredmedia'][0].href : undefined
            }
            arts_wp.push(obj)
        }
        if (toAppend) {
            setFullArticles([...fullArticles, ...arts_wp])
            setLoading(false)
        } else {
            setFullArticles(arts_wp)
        }

    }


    // listen to auth state and get the user data if is log-in
    function onAuthStateChanged(user_state) {
        setIsAdmin(false)
        setUser(undefined)
        if (user_state) {
            firestore().collection('users').doc(user_state.email).get()
                .then(doc => {
                    if (!doc.data()) {
                        return
                    } else {
                        const user_tmp = doc.data()
                        setUser(user_tmp);
                        setIsAdmin(user_tmp.role == 'admin')
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber
    }, []);

    /**this useEffect get all the articles from wp and then from fb */
    useEffect(() => {
        getArticles(parameter)
    }, [])


    // this function return the correct item to render, choose between: skeleton,item,end
    function item_to_render(item) {
        if (item == 'loading') {
            return (
                <SkeletonContent
                    containerStyle={styles.skeleton}
                    layout={[
                        { width: 100, height: Dimensions.get('screen').height * 0.02, marginBottom: 10, },
                        { width: 200, height: Dimensions.get('screen').height * 0.04, marginBottom: 10, },
                        { width: '100%', height: Dimensions.get('screen').height * 0.10, marginBottom: 10, },
                        { width: "100%", height: Dimensions.get('screen').height * 0.04, }
                    ]}
                    isLoading={loading}
                    highlightColor={'#f3f3f4'}
                    boneColor={'#dfdfdf'}>
                </SkeletonContent>
            )
        } else if (item == 'end_list') {
            return (<View style={{ height: 40 }} />)
        } else {
            return (
                <PostInFeed
                    onPress={(extraData) => navigation.navigate('ArticleScreen', { data: item, extraData: extraData, isAdmin: isAdmin })}
                    data={item}
                    isAdmin={auth().currentUser && user ? user.role == 'admin' : false}
                />
            )
        }
    }

    // trolly loading animation to give the user the filling of the refresh option
    const [refreshing, setRefreshing] = useState(false);
    const wait = (timeout) => { return new Promise(resolve => setTimeout(resolve, timeout)); }
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);


    function renderFooter() {
        //it will show indicator at the bottom of the list when data is loading otherwise it returns null
        if (!loading) return null;
        return (
            <ActivityIndicator size={'large'}
                style={{ color: '#0d5794' }}
            />
        );
    };

    return (
        <View style={styles.main}>
            <SafeAreaView style={{ flex: 0, backgroundColor: '' }} />
            <View style={styles.main}>
                <FlatList
                    data={[...fullArticles, 'end_list']}
                    scrollIndicatorInsets={{ right: 1 }}
                    refreshControl={
                        <RefreshControl
                            enabled={true}
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    ListFooterComponent={() => renderFooter()}
                    onEndReachedThreshold={0}
                    onEndReached={() => getArticles(parameter, true)}
                    renderItem={({ item }) => item_to_render(item)}
                    keyExtractor={(item, idx) => idx}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#f0fbff',
    },
    skeleton: {
        margin: 5,
        borderRadius: 5,
        backgroundColor: '#fff',
        minWidth: '97%',
        padding: 20,
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 1,
        shadowRadius: 3.27,
        elevation: 5,
    }
});
