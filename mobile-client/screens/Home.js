import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  TextInput,
  TouchableOpacity
} from 'react-native';

import {
  Button,
  Input
} from 'react-native-elements';

import Form from '../components/Form';

class Home extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Form />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8b332'
  },
  input: {
    color: '#3B61AB',
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
  }
})

export default Home;