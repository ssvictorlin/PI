import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Setting = (props) => {
  return (
    <View hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}>
      <Icon size={30} style={styles.gear} name="cog" onPress={() => {props.openModal(true)}} />
    </View>
  );
}

const styles = StyleSheet.create({
  gear: {
    color: '#fff',
  }
});

export default Setting;