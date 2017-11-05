import React, { Component } from 'react';
import TabNavigator from 'react-native-tab-navigator';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dimensions, View } from 'react-native';
import { get, put } from './api.js';
import Friends from './src/components/Friends.js';
import Profile from './src/components/Profile.js';
import Crowns from './src/components/Crowns.js';
import Header from './src/components/Header.js';

const deviceW = Dimensions.get('window').width

const basePx = 375

function px2dp(px) {
  return px *  deviceW / basePx
}

export default class App extends Component<{}> {
  state= {
    selectedTab: 'profile'
  };

  render() {
    return (
      <View style={{flex:1}}>
        <Header style={{flex:1}} />
        <TabNavigator style={styles.container}>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'friends'}
            title="Friends"
            selectedTitleStyle={{color: "#3496f0"}}
            renderIcon={() => <Icon name="users" size={px2dp(22)} color="#666"/>}
            renderSelectedIcon={() => <Icon name="users" size={px2dp(22)} color="#3496f0"/>}
            onPress={() => this.setState({selectedTab: 'friends'})}>
            <Friends />
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'profile'}
            title="Profile"
            selectedTitleStyle={{color: "#3496f0"}}
            renderIcon={() => <Icon name="user" size={px2dp(22)} color="#666"/>}
            renderSelectedIcon={() => <Icon name="user" size={px2dp(22)} color="#3496f0"/>}
            onPress={() => this.setState({selectedTab: 'profile'})}>
            <Profile />
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'crowns'}
            title="Crowns"
            selectedTitleStyle={{color: "#3496f0"}}
            renderIcon={() => <Icon name="trophy" size={px2dp(22)} color="#666"/>}
            renderSelectedIcon={() => <Icon name="trophy" size={px2dp(22)} color="#3496f0"/>}
            onPress={() => this.setState({selectedTab: 'crowns'})}>
            <Crowns />
          </TabNavigator.Item>
        </TabNavigator>
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
