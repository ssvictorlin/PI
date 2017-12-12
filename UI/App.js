import React, { Component } from 'react';
import TabNavigator from 'react-native-tab-navigator';
import { Header, SearchBar, List, ListItem, Icon } from 'react-native-elements';
import { Dimensions, View, Modal, Text, TouchableHighlight, ListView, ActivityIndicator, Alert } from 'react-native';
import { get, put } from './api.js';
import Profile from './src/components/Profile';
import Crowns from './src/components/Crowns';
import Setting from './src/components/Setting';
import LoginForm from './src/components/LoginForm';
import RegisterForm from './src/components/RegisterForm';
import SettingModal from './src/components/SettingModal';
import { Button, Spinner } from './src/components/common'
import { FriendStack, GroupStack } from './src/router';

import firebase from 'firebase';

const deviceW = Dimensions.get('window').width

const basePx = 375

function px2dp(px) {
  return px *  deviceW / basePx
}

export default class App extends Component<{}> {
  constructor() {
    super();
    this.state = {
      selectedTab: 'profile',
      modalVisible: false,
      loggedIn: false,
      registering: false,
      email: null,
      password: null,
      username: null,
      loading: true,
      loginErr: '',
      activityList: ['Sitting', 'Standing', 'Walking', 'With friends', 'At home', 'Phone in hand'],
      fullList: [],
      registerErr: ''
    };
  }

  setActivityList(str) {
    var oldList = this.state.activityList;
    var i = oldList.indexOf(str);
    if (i > -1) {
      oldList.splice(i, 1);
    } else {
      oldList.push(str);
    }
    this.setState({activityList: oldList});
  }

  setEmail(str) {
    this.setState({email: str});
  }

  setPassword(str) {
    this.setState({password: str});
  }

  getEmail() {
    return this.state.email;
  }

  setUsername(str) {
    this.setState({username: str});
  }

  attemptLogin() {
    this.setState({loading: true});
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(async() => {
        const fullResponse = await get('app/readUser?userEmail=' + this.state.email.replace(".", ","));
        const fullData = await fullResponse.json();
        this.setState({
          fullList: Object.entries(fullData.labels),
          loggedIn: true,
          loading: false,
          modalVisible: false
        });
      })
      .catch((err) => { this.setState({loginErr: err.message, loading: false})});
  }

  attemptRegister(email, password, username) {
    this.setState({
      error: '',
      loading: true,
    });
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(this.sendUserData(email, username))
      .catch((error) => {
      this.setState({registerErr: error.message, loading: false});
    });
  }

  // set login information to backend by POST request
  sendUserData = async (email, username) => {
    try {
      const response = await get('app/register?username='+ username+ '&email=' + email);
      this.setState({
        loading: false,
        registering: false
      })
    }
    catch(err) {
      // handle error
    }
  }

  showRegister() {
    this.setState({registering: true});
  }

  showLogin() {
    this.setState({registering: false});
  }

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

    const authObserver = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        get('app/readUser?userEmail=' + user.email.replace(".", ",")).then((response) => {
          const fullData = JSON.parse(response._bodyText);
          this.setState({
            fullList: Object.entries(fullData.labels),
            loggedIn: true,
            loading: false,
            modalVisible: false,
            email: user.email,
            username: fullData.userName
          });
        });
        authObserver();
      } else {
        this.setState({loading: false})
      }
    });
  }

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  }

  logout = () => {
    firebase.auth().signOut().then(() => {
      this.setState({
        loggedIn: false,
        username: null,
        password: null,
        email: null,
        modalVisible: false
      });
    });
  }

  renderContent = () => {
    if (this.state.loggedIn) {
      return (
        <View style={{flex:1}}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => this.setModalVisible(false)}
          >
            <SettingModal
              logout={this.logout.bind(this)}
              setModalVisible={this.setModalVisible.bind(this)}
              setActivityList={this.setActivityList.bind(this)}
              modalVisible={this.state.modalVisible}
              email={this.state.email}
              fullList={this.state.fullList.map(x => {
                if (this.state.activityList.includes(x[0])) {
                  return [x[0], true];
                } else {
                  return [x[0], false];
                }
              })}
            />
          </Modal>
          <Header
            outerContainerStyles={{height: 50, padding: 10}}
            centerComponent={{ text: 'PersonalityInsights', style: { fontSize: 24, color: '#fff' } }}
            rightComponent={<Setting openModal={this.setModalVisible.bind(this)}/>}
          />
          <TabNavigator style={styles.container}>
            <TabNavigator.Item
              selected={this.state.selectedTab === 'groups'}
              title="Groups"
              selectedTitleStyle={{color: "#3496f0"}}
              renderIcon={() => <Icon name="object-group" type="font-awesome" size={px2dp(22)} color="#666"/>}
              renderSelectedIcon={() => <Icon name="object-group" type="font-awesome" size={px2dp(22)} color="#3496f0"/>}
              onPress={() => this.setState({selectedTab: 'groups'})}
            >
              <GroupStack />
            </TabNavigator.Item>
            <TabNavigator.Item
              selected={this.state.selectedTab === 'friends'}
              title="Friends"
              selectedTitleStyle={{color: "#3496f0"}}
              renderIcon={() => <Icon name="users" type="font-awesome" size={px2dp(22)} color="#666"/>}
              renderSelectedIcon={() => <Icon name="users" type="font-awesome" size={px2dp(22)} color="#3496f0"/>}
              onPress={() => this.setState({selectedTab: 'friends'})}
            >
              <FriendStack />
            </TabNavigator.Item>
            <TabNavigator.Item
              selected={this.state.selectedTab === 'profile'}
              title="Profile"
              selectedTitleStyle={{color: "#3496f0"}}
              renderIcon={() => <Icon name="user" type="font-awesome" size={px2dp(22)} color="#666"/>}
              renderSelectedIcon={() => <Icon name="user" type="font-awesome" size={px2dp(22)} color="#3496f0"/>}
              onPress={() => this.setState({selectedTab: 'profile'})}
            >
              <Profile
                email={this.state.email}
                activityList={this.state.activityList}
              />
            </TabNavigator.Item>
            <TabNavigator.Item
              selected={this.state.selectedTab === 'crowns'}
              title="Crowns"
              selectedTitleStyle={{color: "#3496f0"}}
              renderIcon={() => <Icon name="trophy" type="font-awesome" size={px2dp(22)} color="#666"/>}
              renderSelectedIcon={() => <Icon name="trophy" type="font-awesome" size={px2dp(22)} color="#3496f0"/>}
              onPress={() => this.setState({selectedTab: 'crowns'})}
            >
              <Crowns activityList={this.state.activityList}/>
            </TabNavigator.Item>
          </TabNavigator>
        </View>)
      } else {
        if (this.state.registering) {
          return (
            <RegisterForm
              attemptRegister={this.attemptRegister.bind(this)}
              showLogin={this.showLogin.bind(this)}
            />
          )
        } else {
          return (
            <LoginForm
              attemptLogin={this.attemptLogin.bind(this)}
              setEmail={this.setEmail.bind(this)}
              setUsername={this.setUsername.bind(this)}
              setPassword={this.setPassword.bind(this)}
              showRegister={this.showRegister.bind(this)}
              email={this.state.email}
              username={this.state.username}
              password={this.state.password}
              loading={this.state.loading}
              error={this.state.loginErr}
            />
          );
      }
    }
  }

  render() {
    return (
      <View style={{flex:1, backgroundColor: '#fff'}}>
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
    backgroundColor: '#FFF',
  },
  rowViewContainer: {
    fontSize: 17,
    padding: 10
  }
}
