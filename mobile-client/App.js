import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  StatusBar 
} from 'react-native';
import { Constants } from 'expo';
import { StackNavigator } from 'react-navigation';

// Screens
import Home from './screens/Home';

function AppStatusBar({backgroundColor, ...props}){
  return(
    <View style={{backgroundColor, height: Constants.statusBarHeight}} >
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  )
}

const MainNavigator = StackNavigator({
  Home: { screen: Home },
  initialRouteName: 'Home'
}, {
  navigationOptions: {
    header: null
  }
})

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <AppStatusBar backgroundColor={'#283450'} barStyle='light-content' />
        <MainNavigator />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
