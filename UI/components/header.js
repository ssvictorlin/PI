import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text
} from 'react-native';

export default class Header extends Component {
  render() {
    return(
      <Text style={styles.header}> Header </Text>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'skyblue';
  }
});
