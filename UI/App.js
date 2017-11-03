import React, { Component } from 'react';
import TabNavigator from 'react-native-tab-navigator';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dimensions } from 'react-native';
import { get, put } from './api.js';
import Home from './src/components/Home';
import Profile from './src/components/Profile';
import Crowns from './src/components/Crowns';

const deviceW = Dimensions.get('window').width

const basePx = 375

function px2dp(px) {
  return px *  deviceW / basePx
}

export default class App extends Component<{}> {
  state= {
    selectedTab: 'home'
  };

  render() {
    return (
      <TabNavigator style={styles.container}>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'home'}
          title="Home"
          selectedTitleStyle={{color: "#3496f0"}}
          renderIcon={() => <Icon name="home" size={px2dp(22)} color="#666"/>}
          renderSelectedIcon={() => <Icon name="home" size={px2dp(22)} color="#3496f0"/>}
          badgeText="1"
          onPress={() => this.setState({selectedTab: 'home'})}>
          <Home/>
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'profile'}
          title="Profile"
          selectedTitleStyle={{color: "#3496f0"}}
          renderIcon={() => <Icon name="user" size={px2dp(22)} color="#666"/>}
          renderSelectedIcon={() => <Icon name="user" size={px2dp(22)} color="#3496f0"/>}
          onPress={() => this.setState({selectedTab: 'profile'})}>
          <Profile name="Butter Croissants"/>
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'crowns'}
          title="Cronws"
          selectedTitleStyle={{color: "#3496f0"}}
          renderIcon={() => <Icon name="user" size={px2dp(22)} color="#666"/>}
          renderSelectedIcon={() => <Icon name="user" size={px2dp(22)} color="#3496f0"/>}
          onPress={() => this.setState({selectedTab: 'crowns'})}>
          <Crowns />
        </TabNavigator.Item>
      </TabNavigator>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
}
