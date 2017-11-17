import React, { Component } from 'react';
import { ScrollView, View, Image, Text } from 'react-native';
import { get, put } from '../../api.js';
import { Card, CardSection } from './common';
import { Pie } from 'react-native-pathjs-charts';

export default class PieGraph extends Component {
  onLabelPress = (label, value) => {
    alert(label + ':' + value);
  }

  render() {
    let data = [{
        "name": "Angelique",
        "minutes": 7694
        }, {
        "name": "Zinon",
        "minutes": 2584
        }, {
        "name": "Vikki",
        "minutes": 659
        }, {
        "name": "Martin",
        "minutes": 728
        }]

        let options = {
        margin: {
            top: 20,
            left: 20,
            right: 20,
            bottom: 20
        },
        width: 180,
        height: 180,
        color: '#5f42f4',
        r: 15,
        R: 90,
        legendPosition: 'topLeft',
        animate: {
            type: 'oneByOne',
            duration: 200,
            fillTransition: 3
        },
        label: {
            fontFamily: 'Arial',
            fontSize: 8,
            fontWeight: true,
            color: '#ECF0F1',
            position: 'absolute'
        }
        }

        return (
        <View>
            <Pie
            data={data}
            options={options}
            accessorKey="minutes" />
        </View>
        )
    }
}
