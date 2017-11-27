import React, { Component } from 'react';
import { ScrollView, View, Image, Text } from 'react-native';
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
    console.log("Activity to piechart is: "+ this.props.activity)
  }
  
  /* 
    getTop5List: will use his.props.friendsObjList to find out top 5 people
    (including current user) that have the most minutes on the activity 
    this piechart is for. It will skip zero minute usage.
  */
  getTop5List() {
    var acti = this.props.activity
    function compare(a,b) {
      if (a['labels'][acti] < b['labels'][acti])
        return 1;
      if (a['labels'][acti] > b['labels'][acti])
        return -1;
      return 0;
    }
    var sortedObjList = this.props.friendsObjList.slice(0)
    sortedObjList.sort(compare)
    result = []
    
    for (var i = 0; i < 5; i++) {
      if (sortedObjList[i]['labels'][acti] == 0) break; 
      let item = {
        "name": sortedObjList[i]['userName'],
        "minutes": sortedObjList[i]['labels'][acti]
      }
      if (item['name'] == this.props.friendsObjList[0]['userName']) {
        item['color'] = {'r':66,'g':111,'b':183}
        item['name'] = 'You'

      }
      result.push(item)
    }
    return result
  }

  render() {
    let data = this.getTop5List()
    console.log("data is: %O", data)
    
    let options = {
      width: 180,
      height: 180,
      color: randomColor({ luminosity: 'dark' }),
      r: 20,
      R: 90,
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
      <View>
          <Pie
          data={data}
          options={options}
          accessorKey="minutes" />
      </View>
    )
  }
}
