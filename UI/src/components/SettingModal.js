import React, { Component } from 'react';
import { Dimensions, View, Modal, Text, TouchableHighlight, ScrollView } from 'react-native';
import { CheckBox } from 'react-native-elements';

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
      <CheckBox center key={x[0]} title={x[0]} checked={x[1]}
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
            <Text style={{fontSize: 20}}>X</Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              this.setState({settingsView: false});
            }
          }>
            <Text style={{fontSize: 20, borderBottomWidth: 2, marginBottom: 10}}>{'<-- '}Back</Text>
          </TouchableHighlight>
          <Text>Select your preferred insight labels (min 4, max 10)</Text>
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
            <Text style={{fontSize: 20}}>X</Text>
          </TouchableHighlight>
          <Text style={{fontSize: 20, borderBottomWidth: 2}}>
            Hi, {this.props.email}!
          </Text>
          <View style={{marginTop: 10}}>
            <TouchableHighlight style={{marginBottom: 10, borderBottomWidth: 2}}
              onPress={() => {
              this.showDetailed();
            }}>
              <Text style={{marginBottom: 10}}>Insight Settings</Text>
            </TouchableHighlight>
            <TouchableHighlight style={{marginBottom: 10, borderBottomWidth: 2}}
              onPress={() => {
              this.props.logout()
            }}>
              <Text style={{marginBottom: 10}}>Logout</Text>
            </TouchableHighlight>
          </View>
        </View>
      );
    }
  }
}
