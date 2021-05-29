import React, { useState } from 'react';
import { Text, FlatList, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
let { width } = Dimensions.get('window')

let listlength = 0;

export default function MultiSwitcher({ onSelect, list }) {
    if (!onSelect)
        throw new Error('onSelect is undefined')
    else if (!list)
        throw new Error('list is undefined')
    listlength = list.length;

    const [selected, setSelected] = useState({ emoji: undefined, name: undefined });
    select = item => {
        onSelect(item)
        setSelected(item)
    }

    const renderItem = ({ item }) => <Item item={item} onPress={() => select(item)} />

    const Item = ({ item }) => (
        (item.emoji === selected.emoji) ?
            <TouchableOpacity item={selected} style={{
                height: 40,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                borderRadius: 20,
                borderWidth: 2,
                borderColor: 'rgba(123, 123, 123, 0.3)',
                width: (width * 0.9) / listlength,

            }}>
                <Text style={styles.title}>{item.emoji}</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity item={selected} onPress={() => select(item)} style={{
                height: 40,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
                width: (width * 0.90) / listlength,

            }}>
                <Text style={styles.title}>{item.emoji}</Text>
            </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList horizontal={true} data={list}
                renderItem={renderItem}
                keyExtractor={item => item.name}
                scrollEnabled={false} />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        width: width * 0.905,
        height: 42,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(123, 123, 123, 0.3)',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.5)',
    },
    title: {
        fontSize: 20
    },
});


