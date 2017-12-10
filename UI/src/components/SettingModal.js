import React, { Component } from 'react';
import { Dimensions, View, Modal, Text, TouchableHighlight, ScrollView } from 'react-native';
import { Icon, CheckBox } from 'react-native-elements';

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
    return this.props.fullList.map((x) =>
      <CheckBox key={x[0]} title={x[0]} checked={x[1]}
        onPress={() => this.props.setActivityList(x[0])}
        />
    );
  }

  render() {
    if (this.state.settingsView) {
      return (
        <View style={{marginTop: 22, marginLeft: 2}}>
          <TouchableHighlight
            style={{marginBottom: 10, alignSelf:'flex-end', marginRight: 20}}
            onPress={() => {
            this.setState({settingsView: false});
            this.props.setModalVisible(!this.props.modalVisible);}
          }>
          <View hitSlop={{top: 10, bottom: 10, left: 0, right: 0}}>
            <Text style={{fontSize: 40}}>X</Text>
          </View>          
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              this.setState({settingsView: false});
            }
          }>
          <View hitSlop={{top: 10, bottom: 10, left: 0, right: 0}} style={{flexDirection: 'row', marginBottom: 20}}>
            <Icon name='arrow-back'/><Text style={{fontSize: 20}}>Back</Text>
          </View>
          </TouchableHighlight>
          <Text>Select your preferred insight labels (we recommend between 4 and 10 labels)</Text>
          <ScrollView>
            <View>
              {this.makeCheckList()}
            </View>
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View style={{marginTop: 22, marginLeft: 2}}>
          <TouchableHighlight
            style={{marginBottom: 10, alignSelf:'flex-end', marginRight: 20}}
            onPress={() => {
            this.setState({settingsView: false});
            this.props.setModalVisible(!this.props.modalVisible);}
          }>
          <View hitSlop={{top: 10, bottom: 10, left: 0, right: 0}}>
            <Text style={{fontSize: 40}}>X</Text>
          </View>
          </TouchableHighlight>
          <Text style={{fontSize: 20, borderBottomWidth: 2}}>
            Hi, {this.props.email}!
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
