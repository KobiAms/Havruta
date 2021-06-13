import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Image,
  Text,
} from 'react-native';

export default function LoadingComponent() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('../../Assets/logo_stretch.png')}
      />
      <View>
        <ActivityIndicator size={'large'} color={'#0d5794'} />
        <Text style={styles.text}>המתן מספר רגעים...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    zIndex: 1,
    position: 'absolute',
    flex: 1
  },
  image: {
    height: Dimensions.get('window').width / 2,
    width: Dimensions.get('window').width / 2,
    borderRadius: Dimensions.get('window').width / 4,
    borderWidth: 4,
    borderColor: '#0d5794',
    overflow: 'hidden',
    backgroundColor: 'rgb(200,200,220)',
  },
  text: {
    marginTop: 30,
    fontSize: 30,
    color: '#0d5794',
    fontWeight: 'bold',
  },
});
