import React, { Component } from 'react';
import { ScrollView, View, Text, Image, ActivityIndicator } from 'react-native';
import { get } from '../../api.js';
import RadarGraph from './radar.js';
import { Icon, List, ListItem, Button } from 'react-native-elements';
import firebase from 'firebase';
import Bar from './bar.js';

export default class FriendDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: null,
      name: null,
      avatar: null,
      userData: null,
      loading: false,
      barList: {},
      activityList: ['Sitting', 'Standing', 'Walking', 'With friends', 'At home', 'Phone in hand'],
      isFriend: false,
      curUserName: null
    };
  }

  componentWillMount() {
    this.getData();
    this.getCurUser();
  }

  getCurUser = async () => {
    var user = firebase.auth().currentUser;
    try {
      const response = await get('app/readUser?userEmail=' + user.email);
      console.log(user.email);
      const data = await response.json();
      console.log(data);
      this.setState({
        curUserName: data['userName']
      });
    }
    catch(err) {
      alert(err);
    }
  };

  getData = async () => {
    this.setState({loading: true});
    const {state} = this.props.navigation;
    console.log(state.params.fetchUsersFriends);
    try {
      const email = state.params.userEmail.replace('.',',')
      const responseFromUser = await get('app/readUser'+'?userEmail='+ email)
      const dataFromUser = await responseFromUser.json()

      this.setState({
        email: state.params.userEmail,
        name: dataFromUser.userName,
        avatar: dataFromUser.avatar,
        userData: dataFromUser,
        loading: false,
        isFriend: state.params.isFriend
      });
    }
    catch(err) {
      alert(err);
    }
  };

  renderAddFriendButton = () => {
    var curUserEmail = firebase.auth().currentUser.email.replace(".", ",");
    if (this.state.isFriend) {
      return (
        <Button title='unfriend' onPress={async () => {
          try {
            console.log('friendEmail: ' + this.state.email);
            console.log('userEmail: ' + curUserEmail);
            const response = await get('app/deleteFriend?friendEmail=' + this.state.email
              + '&userEmail=' + curUserEmail);
            this.setState({isFriend: false});
            alert('You unfriend ' + this.state.name + '!');
          }
          catch(err) {
            alert(err);
          }
          }}
        />
      );
    } else {
      return (
        <Button title='add' onPress={async () => {
          try {
            console.log('friendEmail: ' + this.state.email);
            console.log('userEmail: ' + curUserEmail);
            const response = await get('app/addFriend?friendName=' +
              this.state.name + '&friendEmail=' + this.state.email +
                '&userName=' + this.state.curUserName + '&userEmail=' + curUserEmail);
              this.setState({isFriend: true});
              alert('You and ' + this.state.name + ' are friends now!');
            }
            catch(err) {
              alert(err);
            }
          }}
        />
      );
    }
  }

  render() {
    if (this.state.loading == true) {
      return (
        <ActivityIndicator
          animating={this.state.loading}
          style={[styles.centering, {height: 80}]}
          size="large"
        />
      );
    } else {
      barList = {}
      for (var i = 0; i < this.state.activityList.length; i++) {
        var acti = this.state.activityList[i]
        console.log(this.state.activityList[i])
        barList[acti] = this.state.userData['labels'][acti]
      }

      return (
        <ScrollView>
          <View style={styles.container}>
            <View style={ styles.thumbnailContainer }>
              <Image
                style={ styles.thumbnail }
                source={{ uri: this.state.avatar }}
              />
            </View>
            <View style={ styles.nameContainer }>
              <Text style={ styles.name }>{ this.state.name }</Text>
            </View>
            {this.renderAddFriendButton()}
          </View>
          <RadarGraph data={[barList]} />
          <Text style={styles.subtitle}>{this.state.name}'s Activity Summary:</Text>
          <Bar
            barList = { barList }
          />
        </ScrollView>
      );
    }
  }
};

const styles = {
  container: {
    borderBottomWidth: 1,
    padding: 5,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative'
  },
  nameContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  name: {
    fontSize: 24
  },
  thumbnail: {
    height: 80,
    width: 80,
    borderRadius: 50,
  },
  thumbnailContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10
  },
  image: {
    height: 300,
    flex: 1,
    width: null,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 5
  },
  activity: {
    height: 40,
    fontSize: 18
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8
  }
}
