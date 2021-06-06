import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Image,
  Text,
} from 'react-native';
import { Item, Input } from 'native-base';

export default function SearchBox() {
  return (
    <View style={styles.container}>
        <Item rounded>
            <Input placeholder='Rounded Textbox'/>
        </Item>
      {/* <View>
        <ActivityIndicator size={'large'} color={'rgb(200,200,220)'} />
        <Text style={styles.text}>Please Wait...</Text>
      </View> */}
    </View>
  );
}





const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: 'rgb(160,160,210)',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    zIndex: 1,
    position: 'absolute',
  },
  image: {
    height: Dimensions.get('window').width / 2,
    width: Dimensions.get('window').width / 2,
    borderRadius: Dimensions.get('window').width / 4,
    borderWidth: 4,
    borderColor: 'rgb(200,200,220)',
    overflow: 'hidden',
    backgroundColor: 'rgb(200,200,220)',
  },
  text: {
    marginTop: 30,
    fontSize: 30,
    color: 'rgb(200,200,220)',
    fontWeight: 'bold',
  },
});
