import React, { Component } from 'react';
import { ScrollView, View, Text, Image, ActivityIndicator } from 'react-native';
import { get } from '../../api.js';
import RadarGraph from './radar.js';
import { Icon, List, ListItem, Button } from 'react-native-elements';
import firebase from 'firebase';
import Bar from './bar.js';

export default class GroupDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: null,
      groupName: null,
      groupObjective: null,
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
    try {
      const responseFromGroup = await get('app/readGroup?groupName=' + state.params.groupName);
      const dataFromGroup = await responseFromGroup.json();
      console.log(dataFromGroup);

      this.setState({
        groupName: state.params.groupName,
        avatar: dataFromGroup.avatar,
        groupData: dataFromGroup,
        groupObjective: dataFromGroup.groupObjective,
        loading: false,
        isJoined: state.params.isJoined
      });
    }
    catch(err) {
      alert(err);
    }
  };

  renderJoinButton = () => {
    var curUserEmail = firebase.auth().currentUser.email.replace(".", ",");
    if (this.state.isJoined) {
      return (
        <Button title='leave' onPress={async () => {
          try {
            console.log('curUserName: ' + this.state.curUserName);
            const response = await get('app/removeFromGroup?userEmail=' + curUserEmail
              + '&groupName=' + this.state.groupName);
            this.setState({isJoined: false});
            alert('You have left ' + this.state.groupName);
          }
          catch(err) {
            alert(err);
          }
          }}
        />
      );
    } else {
      return (
        <Button title='join' onPress={async () => {
          try {
            console.log('curUserName: ' + this.state.curUserName);
            const response = await get('app/addToGroup?groupName=' + this.state.groupName +
              '&userName=' + this.state.curUserName + '&userEmail=' + curUserEmail);
              this.setState({isJoined: true});
              alert('You have joined ' + this.state.groupName);
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
      // barList = {}
      // for (var i = 0; i < this.state.activityList.length; i++) {
      //   var acti = this.state.activityList[i]
      //   console.log(this.state.activityList[i])
      //   barList[acti] = this.state.userData['labels'][acti]
      // }

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
              <Text style={ styles.name }>{ this.state.groupName }</Text>
            </View>
            {this.renderJoinButton()}
          </View>
          {/* <RadarGraph data={[barList]} /> */}
          {/* <Text style={styles.subtitle}>{this.state.groupName}'s Activity Summary:</Text> */}
          {/* <Bar
            barList = { barList }
          /> */}
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
