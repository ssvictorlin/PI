import React, { Component } from 'react';
import { ScrollView, View, Text, Image, ActivityIndicator } from 'react-native';
import { get } from '../../api.js';
import RadarGraph from './radar.js';
import { Icon, List, ListItem, Button, Avatar } from 'react-native-elements';
import firebase from 'firebase';
import Bar from './bar.js';

export default class FriendDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: null,
      name: null,
      avatar: null,
      memberofGroup: null,
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

  getData = async () => {
    this.setState({loading: true});
    const {state} = this.props.navigation;
    try {
      const email = state.params.userEmail.replace('.',',')
      const responseFromUser = await get('app/readUser'+'?userEmail='+ email)
        .then((response) => response.json())
        .then((friendData) => {
          this.setState({
            email: state.params.userEmail,
            name: friendData.userName,
            avatar: friendData.avatar,
            userData: friendData,
            isFriend: state.params.isFriend
          }, function() {
            // In this block you can do something with new state.
            this.fetchGroupsUserIn();
          });
        })
        .catch((error) => {
          // handle error
        });
    }
    catch(err) {
      alert(err);
    }
  };


  getCurUser = async () => {
    var user = firebase.auth().currentUser;
    try {
      const response = await get('app/readUser?userEmail=' + user.email);
      const data = await response.json();
      this.setState({
        curUserName: data['userName']
      });
    }
    catch(err) {
      alert(err);
    }
  };

  fetchGroupsUserIn = async () => {
    try {
      const response = await get('app/fetchGroupsUserIn?userEmail=' + this.state.email);
      const data = await response.json();
      this.setState({
        memberofGroup: data,
        loading: false
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
    function RenderGroupList(props) {
      const groups = props.groups;
      if (groups.length != 0) {
        const groupItems = groups.map((element, index) =>
          <View key={index}>
            <Avatar
              medium
              rounded
              source={{uri: element.avatar}}
              title={element.userName}
              onPress={() => console.log("Works!")}
              activeOpacity={0.7}
            />
            <Text>{element.groupName}</Text>
          </View>
        );
        return groupItems;
      } else {
        return (
          <Text>Doesn't join any group!</Text>
        );
      }
    }

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
          <Text style={styles.subtitle}>Groups</Text>
          <View style={styles.buttonContainer}>
              <RenderGroupList groups={this.state.memberofGroup} />
            </View>
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
  },
  buttonContainer: {
    paddingTop: 10,
    height: 80,
    flexDirection: 'row',
  },
  groupButton: {
    height: 50,
    width: 50 ,
    borderRadius: 100,
    paddingTop: 10,
    paddingLeft: 10
  }
}
