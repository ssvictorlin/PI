import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Header extends Component {
  render() {
    return(
      <View style={styles.header}>
        <Icon size={20} style={styles.gear} name="cog"/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    alignItems: 'flex-end',
    backgroundColor: '#F5FCFF'
  },
  gear: {
    right: 20,
    top: 10
  }
});
