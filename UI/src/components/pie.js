import React, { Component } from 'react';
import { ScrollView, View, Image, Text, Dimensions } from 'react-native';
import { get, put } from '../../api.js';
import { Card, CardSection } from './common';
import { Pie } from 'react-native-pathjs-charts';
import { randomColor } from 'randomcolor';
/*
  PieGraph: draw a PieGraph with data passed in as prop
    Every entry need to have name and munutes.
    ...
    "name": "Angelique",
    "minutes": 7694,
    ...
*/
export default class PieGraph extends Component {
  onLabelPress = (label, value) => {
    alert(label + ':' + value);
  }

  componentWillMount() {
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getTop5Data() {
    var acti = this.props.activity
    result = []
    let rcolor = randomColor({
      luminosity: 'dark',
      format:'rgbArray'
    })
    for (var i = 0; i < this.props.top5List.length; i++) {
      let item = {
        "name": this.props.top5List[i]['userName'],
        "minutes": this.props.top5List[i]['labels'][acti],
        "color": {'r':rcolor[0],'g':this.getRandomInt(0,255),'b':rcolor[2]}
      }
      if (item['name'] == this.props.curUserName) {
        item['color'] = {'r':66,'g':111,'b':183}
        item['name'] = 'You'
      }
      result.push(item)
    }
    return result
  }

  render() {
    const deviceWidth = Dimensions.get('window').width
    const maxWidthForPie = Math.round(deviceWidth - 200)
    const radius = (maxWidthForPie-10)/2
    let data = this.getTop5Data()
    let options = {
      width: maxWidthForPie,
      height: maxWidthForPie,
      axisY: {min: true},
      //color: randomColor({ luminosity: 'dark' }),
      r: radius/4,
      R: radius,
      legendPosition: 'topRight',
      animate: {
          type: 'oneByOne',
          duration: 200,
          fillTransition: 3
      },
      label: {
          fontFamily: 'Arial',
          fontSize: 10,
          fontWeight: true,
          color: '#ECF0F1',
      }
    }

    return (
      <View style = {{justifyContent: 'center'}}>
          <Pie
          data={data}
          options={options}
          accessorKey="minutes"
          />
      </View>
    )
  }
}
