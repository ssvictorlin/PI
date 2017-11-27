import React, { Component } from 'react';
import { Dimensions, View, Modal, Text, TouchableHighlight } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

export default class SettingModal extends Component {
  constructor(props) {
		super(props);
    this.state = {
			settingsView: false
    };
  }

  showDetailed() {
    this.setState(settingsView: true);
  }

  hideDetailed() {
    this.setState(settingsView: false);
  }

  render() {
    // TODO: If else on this.state.settingsView
    return (
      <View style={{marginTop: 22}}>
        <TouchableHighlight
          style={{marginBottom: 10, alignSelf:'flex-end', marginRight: 20}}
          onPress={() => {
          this.setState({settingsView: false});
          this.props.setModalVisible(!this.props.modalVisible);}
        }>
          <Text style={{fontSize: 20}}>X</Text>
        </TouchableHighlight>
        <Text>
          Hi, {this.props.email}!
        </Text>
        <View style={{marginTop: 10}}>
          <TouchableHighlight style={{marginBottom: 10}} onPress={() => {
            this.showDetailed();
          }}>
            <Text style={{marginBottom: 10}}>Display Settings</Text>
          </TouchableHighlight>
          <TouchableHighlight style={{marginBottom: 10}} onPress={() => {
            this.props.logout()
          }}>
            <Text>Logout</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}
