import React, { Component } from 'react';
import { Dimensions, View, Modal, Text, TouchableHighlight, ScrollView } from 'react-native';
import { Icon, CheckBox, Header } from 'react-native-elements';

export default class SettingModal extends Component {
  constructor(props) {
		super(props);
    this.state = {
			settingsView: false,
      checked: false
    };
  }

  showDetailed() {
    this.setState({settingsView: true});
  }

  hideDetailed() {
    this.setState({settingsView: false});
  }

  toggleCheck(b) {
    var i = this.props.fullList.indexOf(b);
    // set fullList in App.js
  }

  makeCheckList() {
    return this.props.fullList.map((x) => {
      if (!x[0].includes("shower") && x[0] !== "At work" &&
          !x[0].includes("Drive")) {
          return (<CheckBox key={x[0]} title={x[0]} checked={x[1]}
          onPress={() => this.props.setActivityList(x[0])}
          />);
        }
      }
    );
  }

  render() {
    if (this.state.settingsView) {
      return (
        <View>
          <Text style={{height: 40, backgroundColor: "#778899", fontSize: 30, color:"#fff", paddingLeft: 2}}>Settings</Text>
          <TouchableHighlight
            style={{position: 'absolute', top: 7, alignSelf:'flex-end', right: 10}}
            onPress={() => {
            this.setState({settingsView: false});
            this.props.setModalVisible(!this.props.modalVisible);}
          }>
          <View hitSlop={{top: 5, bottom: 10, left: 0, right: 0}}>
            <Text style={{fontSize: 20, color:"#fff"}}>X</Text>
          </View>
          </TouchableHighlight>
          <TouchableHighlight
            style={{top: 0}}
            onPress={() => {
              this.setState({settingsView: false});
            }
          }>
          <View hitSlop={{top: 10, bottom: 10, left: 0, right: 0}} style={{flexDirection: 'row', marginTop: 20, marginBottom: 20}}>
            <Icon name='arrow-back'/><Text style={{fontSize: 20}}>Back</Text>
          </View>
          </TouchableHighlight>
          <Text style={{marginLeft: 10, marginRight: 10}}>Select your preferred insight labels (we recommend between 4 and 10 labels)</Text>
          <ScrollView style={{height: 400}}>
            <View>
              {this.makeCheckList()}
            </View>
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View>
          <Text style={{height: 40, backgroundColor: "#778899", fontSize: 30, color:"#fff", paddingLeft: 2}}>Settings</Text>
          <TouchableHighlight
            style={{position: 'absolute', top: 7, alignSelf:'flex-end', right: 10}}
            onPress={() => {
            this.setState({settingsView: false});
            this.props.setModalVisible(!this.props.modalVisible);}
          }>
          <View hitSlop={{top: 5, bottom: 10, left: 0, right: 0}}>
            <Text style={{fontSize: 20, color:"#fff"}}>X</Text>
          </View>
          </TouchableHighlight>
          <Text style={{fontSize: 20, marginLeft: 10}}>
            Hi, {this.props.email}!
          </Text>
          <Text style={{marginLeft: 10}}>
           Thank you for trying out this prototype of Personality Insights.
           We hope you like it! Some features that we hope to implement in the future include Myer Briggs
           personality scores and Strength Finder tests.
          </Text>
          <Text style={{fontStyle: 'italic', marginLeft: 10, marginRight: 10, marginBottom: 5, borderBottomWidth: 1, borderColor: "#000"}}>
           -- PI Team
          </Text>
          <View style={{marginTop: 10}}>
            <TouchableHighlight style={{marginBottom: 10, borderBottomWidth: 2}}
              onPress={() => {
              this.showDetailed();
            }}>
              <Text style={{marginBottom: 10, fontSize: 24}}>Insight Settings</Text>
            </TouchableHighlight>
            <TouchableHighlight style={{marginBottom: 10, borderBottomWidth: 2}}
              onPress={() => {
              this.props.logout()
            }}>
              <Text style={{marginBottom: 10, fontSize: 24}}>Logout</Text>
            </TouchableHighlight>
          </View>
        </View>
      );
    }
  }
}
