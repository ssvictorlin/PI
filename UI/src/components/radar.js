import React, { Component } from 'react';
import { ScrollView, View, Image, Text } from 'react-native';
import { get, put } from '../../api.js';
import { Card, CardSection } from './common';
import { Radar } from 'react-native-pathjs-charts';

export default class RadarGraph extends Component {
  onLabelPress = (label, value) => {
    alert(label + ':' + value);
  }

  render() {
    // let data = [{
    //   "Friend": 74,
    //   "Eater": 29,
    //   "Cardio": 40,
    //   "Strength": 40,
    //   "Relaxer": 30,
    //   "Worker": 25,
    //   "Example": 44,
    //   "Test": 20
    // }]

    let options = {
      width: 290,
      height: 290,
      margin: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      },
      r: 100,
      max: 100,
      fill: "#2980B9",
      stroke: "#2980B9",
      animate: {
        type: 'oneByOne',
        duration: 200
      },
      label: {
        fontFamily: 'Arial',
        fontSize: 14,
        fontWeight: true,
        fill: '#34495E',
        onLabelPress: this.onLabelPress
      }
    }

    return (
      <View style={styles.container}>
        <Radar data={this.props.data} options={options} />
      </View>
    )
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
}
