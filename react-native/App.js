/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

class Footer extends Component<{}> {
  render() {
    return(
      <Text style={styles.instructions}>
        Footer Text
      </Text>
    );
  }
}

export default class App extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Personality Insights
        </Text>
        <Footer />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    flex: 7,
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    flex: 1,
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
