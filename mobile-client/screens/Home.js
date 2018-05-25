import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  TextInput,
  TouchableOpacity,
  Dimensions
} from 'react-native';

import {
  Button,
  Input
} from 'react-native-elements';

import { LinearGradient } from 'expo';

import Form from '../components/Form';

class Home extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Form />
        <LinearGradient 
          style={styles.gradient}
          colors={['transparent', '#262d48']}
          start={[1, 0]}
          end={[1, 1]} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3B61AB'
  },
  input: {    
    fontSize: 25,
    fontWeight: 'bold',
    padding: 10,
    margin: 5,
    backgroundColor: 'white'
  },
  button: {
    backgroundColor: '#3B61AB',
    padding: 10,
    margin: 10,
    borderRadius: 5
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center'
  },
  gradient: {
    zIndex: 1,
    opacity: 0.9,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: Dimensions.get('window').height,
  }
})

export default Home;