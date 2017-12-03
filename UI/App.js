import React, { Component } from 'react';
import TabNavigator from 'react-native-tab-navigator';
// import Icon from 'react-native-vector-icons/FontAwesome';
import { Header, SearchBar, List, ListItem, Icon } from 'react-native-elements';
import { Dimensions, View, Modal, Text, TouchableHighlight, ListView, ActivityIndicator, Alert } from 'react-native';
import { get, put } from './api.js';
import Groups from './src/components/Groups';
import Friends from './src/components/Friends';
import Profile from './src/components/Profile';
import Crowns from './src/components/Crowns';
import Setting from './src/components/Setting';
import LoginForm from './src/components/LoginForm';
import RegisterForm from './src/components/RegisterForm';
import SettingModal from './src/components/SettingModal';
import { Button, Spinner } from './src/components/common';
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
      loading: false,
      loginErr: '',
      activityList: ['Sitting', 'Standing', 'Walking', 'With friends', 'At home', 'Phone in hand'],
      registerErr: ''
    };
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
      .then(() => {
        this.setState({
          loggedIn: true,
          loading: false,
          modalVisible: false
        });
      })
      .catch((err) => { this.setState({loginErr: err.message, loading: false})});
  }

  attemptRegister(email, password, username) {
    this.setState({ error: '', loading: true });
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
      console.log(err);
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
  }

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  }

  logout = () => {
    this.setState({
      loggedIn: false,
      username: null,
      password: null,
      email: null,
      modalVisible: false
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
              modalVisible={this.state.modalVisible}
              email={this.state.email}
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
              <Groups />
            </TabNavigator.Item>
            <TabNavigator.Item
              selected={this.state.selectedTab === 'friends'}
              title="Friends"
              selectedTitleStyle={{color: "#3496f0"}}
              renderIcon={() => <Icon name="users" type="font-awesome" size={px2dp(22)} color="#666"/>}
              renderSelectedIcon={() => <Icon name="users" type="font-awesome" size={px2dp(22)} color="#3496f0"/>}
              onPress={() => this.setState({selectedTab: 'friends'})}
            >
              <Friends />
            </TabNavigator.Item>
            <TabNavigator.Item
              selected={this.state.selectedTab === 'profile'}
              title="Profile"
              selectedTitleStyle={{color: "#3496f0"}}
              renderIcon={() => <Icon name="user" type="font-awesome" size={px2dp(22)} color="#666"/>}
              renderSelectedIcon={() => <Icon name="user" type="font-awesome" size={px2dp(22)} color="#3496f0"/>}
              onPress={() => this.setState({selectedTab: 'profile'})}
            >
              <Profile email={this.state.email}/>
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
  },
  rowViewContainer: {
    fontSize: 17,
    padding: 10
  }
}