import React, { Component } from 'react';
import { View,
         Text,
         Animated,
         StyleSheet,
         Dimensions
} from 'react-native'
import { Icon, List, ListItem } from 'react-native-elements';
import { randomColor } from 'randomcolor';

export default class Bar extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }
    componentWillReceiveProps(nextProps) {
      var newState = {};
      var itemNameList = []
      for(var k in nextProps.barList) {
        itemNameList.push(k)
      }
      const width = this.getWidth(itemNameList)
      newState['itemNameList'] = itemNameList
      for(var k in width) {
        newState[k] = width[k]
      }
      this.setState( newState );
    }
    componentWillMount() {
        var newState = {};
        var itemNameList = [];
        for(var k in this.props.barList) {
          itemNameList.push(k)
        }
        const width = this.getWidth(itemNameList)
        newState['itemNameList'] = itemNameList
        for(var k in width) {
          newState[k] = width[k]
        }
        console.log("newState: " + JSON.stringify(newState));
        this.setState( newState );
    }

    getWidth (itemNameList) {
        const deviceWidth = Dimensions.get('window').width
        const maxWidth = Math.round(deviceWidth - 50)
        const unit = maxWidth / (360*1.0)
        let width = {}
        let widthCap // Give with a max cap
        console.log(unit);
        itemNameList.forEach(item => {
          /* React-Native bug: if width=0 at first time, the borderRadius can't be implemented in the View */
          widthCap = Math.round(this.props.barList[item] * unit)
          width[item] = widthCap
        })
        console.log('MaxWidth', maxWidth)
        width['maxWidth'] = maxWidth
        return width
    }

    handeleAnimation () {
        const timing = Animated.timing
        const width = {pts: 200, ast: 100, reb: 500} // new values to switch to
        Animated.parallel(this.state.itemNameList.map(item => {
            return timing(this.state[item], {toValue: width[item]})
        })).start()
    }


    render () {
        var barItems = this.state.itemNameList.map((element, index) =>
            <View key = {index} style={styles.container}>
              <View style={styles.item}>
                <Text style={styles.label}>{element}</Text>
                <View style={styles.data}>
                    <Animated.View style={[styles.bar,  {backgroundColor: randomColor()},
                      {width: ((this.state[element] <= this.state['maxWidth']) ? this.state[element] : this.state['maxWidth'])}]} />
                    <Text style={styles.dataNumber}>{this.state[element]}</Text>
                </View>
              </View>
            </View>
    );
    return barItems;
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginTop: 6
  },
  // Item
  item: {
    flexDirection: 'column',
    marginBottom: 1,
    paddingHorizontal: 5
  },
  label: {
    color: '#5b5b5b',
    flex: 1,
    fontSize: 12,
    position: 'relative',
    top: 2,
    marginBottom: 3,
  },
  data: {
    flex: 2,
    flexDirection: 'row'
  },
  dataNumber: {
    color: '#5b5b5b',
    fontSize: 11
  },
  // Bar
  bar: {
    alignSelf: 'center',
    borderRadius: 5,
    height: 8,
    marginRight: 5
  },
  barcolor: {
    backgroundColor: randomColor()
  },
  // Controller
  controller: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15
  },
  button: {
    flex: 1,
    position: 'relative',
    top: -1
  },
  chevronLeft: {
    alignSelf: 'flex-end',
    height: 28,
    marginRight: 10,
    width: 28
  },
  chevronRight: {
    alignSelf: 'flex-start',
    height: 28,
    marginLeft: 10,
    width: 28
  },
  date: {
    color: '#6B7C96',
    flex: 1,
    fontSize: 22,
    fontWeight: '300',
    height: 28,
    textAlign: 'center'
  }

})
