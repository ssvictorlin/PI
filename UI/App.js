import React, { Component } from 'react';
import TabNavigator from 'react-native-tab-navigator';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Header } from 'react-native-elements';
import { Dimensions, View, Modal, Text, TouchableHighlight } from 'react-native';
import { get, put } from './api.js';
import Friends from './src/components/Friends';
import Profile from './src/components/Profile';
import Crowns from './src/components/Crowns';
import Setting from './src/components/Setting';
import LoginForm from './src/components/LoginForm';
import { Button, Spinner } from './src/components/common';
import firebase from 'firebase';

const deviceW = Dimensions.get('window').width

const basePx = 375

function px2dp(px) {
  return px *  deviceW / basePx
}

export default class App extends Component<{}> {
  state = {
    selectedTab: 'profile',
    modalVisible: false,
    loggedIn: true,
  };

  componentWillMount() {
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyA9XhQ19knvbKb7DqXp4vwGVSGkQPuqyzw",
      authDomain: "ubiquitouspi-ddcb0.firebaseapp.com",
      databaseURL: "https://ubiquitouspi-ddcb0.firebaseio.com",
      projectId: "ubiquitouspi-ddcb0",
      storageBucket: "ubiquitouspi-ddcb0.appspot.com",
      messagingSenderId: "909294414727"
    };

    firebase.initializeApp(config);
  }

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  }

  logout = () => {
    this.setState({ loggedIn: false });
  }

  renderContent = () => {
    if (this.state.loggedIn) {
      return (<View style={{flex:1}}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => this.setModalVisible(false)}
          >
            <View style={{marginTop: 22}}>
              <View>
                <Text>Setting</Text>
                <TouchableHighlight onPress={() => {
                  this.setModalVisible(!this.state.modalVisible)
                }}>
                  <Text>Hide Modal</Text>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {
                  this.logout()
                }}>
                  <Text>Logout</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
          <Header
            centerComponent={{ text: 'PersonalityInsights', style: { fontSize: 26, color: '#fff' } }}
            rightComponent={<Setting openModal={this.setModalVisible.bind(this)}/>}
          />
          <TabNavigator style={styles.container}>
            <TabNavigator.Item
              selected={this.state.selectedTab === 'friends'}
              title="Friends"
              selectedTitleStyle={{color: "#3496f0"}}
              renderIcon={() => <Icon name="users" size={px2dp(22)} color="#666"/>}
              renderSelectedIcon={() => <Icon name="users" size={px2dp(22)} color="#3496f0"/>}
              onPress={() => this.setState({selectedTab: 'friends'})}
            >
              <Friends />
            </TabNavigator.Item>
            <TabNavigator.Item
              selected={this.state.selectedTab === 'profile'}
              title="Profile"
              selectedTitleStyle={{color: "#3496f0"}}
              renderIcon={() => <Icon name="user" size={px2dp(22)} color="#666"/>}
              renderSelectedIcon={() => <Icon name="user" size={px2dp(22)} color="#3496f0"/>}
              onPress={() => this.setState({selectedTab: 'profile'})}
            >
              <Profile />
            </TabNavigator.Item>
            <TabNavigator.Item
              selected={this.state.selectedTab === 'crowns'}
              title="Crowns"
              selectedTitleStyle={{color: "#3496f0"}}
              renderIcon={() => <Icon name="trophy" size={px2dp(22)} color="#666"/>}
              renderSelectedIcon={() => <Icon name="trophy" size={px2dp(22)} color="#3496f0"/>}
              onPress={() => this.setState({selectedTab: 'crowns'})}
            >
              <Crowns />
            </TabNavigator.Item>
          </TabNavigator>
        </View>)
      } else {
        return (<LoginForm />);
      }
  }

  render() {
    return (
      <View style={{flex:1}}>
        {this.renderContent()}
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
}
