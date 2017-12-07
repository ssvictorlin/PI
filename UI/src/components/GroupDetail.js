import React, { Component } from 'react';
import { ScrollView, View, Text, Image, ActivityIndicator } from 'react-native';
import { get } from '../../api.js';
import RadarGraph from './radar.js';
import { Icon, List, ListItem, Button, Card, Avatar } from 'react-native-elements';
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
      top3: null,
      groupData: null,
      memberList: null,
      friendsInGroup: [],
      loading: false,
      barList: {},
      isJoined: false,
      curUserName: null
    };
  }

  componentWillMount() {
    this.getData();
    this.getCurUser();
  }

  getData = async () => {
    const {state} = this.props.navigation;
    this.setState({loading: true, groupName: state.params.groupName});
    try {
      const responseFromGroup = await get('app/readGroup?groupName=' + state.params.groupName)
      .then((response) => response.json())
      .then((dataFromGroup) => {
        console.log(dataFromGroup);
        this.setState({
          groupName: state.params.groupName,
          avatar: dataFromGroup.avatar,
          groupData: dataFromGroup,
          groupObjective: dataFromGroup.objective,
          memberList: dataFromGroup.memberList,
          isJoined: state.params.isJoined,
          top3: dataFromGroup.top3
        }, function() {
          // In this block you can do something with new state.
          console.log(this.state.groupName);
          this.fetchUsersFriendsInGroup();
        });
      })
      .catch((error) => {
        console.error(error);
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

  fetchUsersFriendsInGroup = async () => {
    var user = firebase.auth().currentUser;
    if (user == null) {
      throw "user not signed in"
    }
    try {
      console.log(user.email);
      console.log(this.state.groupName);
      const response = await get('app/fetchUsersFriendsInGroup?userEmail=' + user.email + 
        '&groupName=' + this.state.groupName);
      console.log(response);
      const data = await response.json();
      console.log(data);
      this.setState({
        friendsInGroup: data,
        loading: false
      });
      console.log(this.state.friendsInGroup);
    }
    catch(err) {
      alert(err);
    }
  };

  renderJoinButton = () => {
    var curUserEmail = firebase.auth().currentUser.email.replace(".", ",");
    if (this.state.isJoined) {
      return (
        <Button
          title='Leave'
          backgroundColor='#03A9F4'
          fontFamily='Lato'
          buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
          onPress={async () => {
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
        <Button
          title='Join'
          backgroundColor='#03A9F4'
          fontFamily='Lato'
          buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
          onPress={async () => {
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
    function RenderFriendList(props) {
      const friends = props.friends;
      if (friends.length != 0) {
        const friendItems = friends.map((element, index) => 
          <View key={index}>
            <Avatar
              medium
              rounded
              source={{uri: element.avatar}}
              title={element.userName}
              onPress={() => console.log("Works!")}
              activeOpacity={0.7}
            />
            <Text>{element.userName}</Text>
          </View>
        );
        return friendItems;
      } else {
        return (
          <Text>No friends are in this group!</Text>
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
      for (var i = 0; i < this.state.top3.length; i++) {
        var acti = this.state.top3[i]
        console.log(this.state.top3[i])
        console.log(this.state.groupData['labels'])
        barList[acti] = this.state.groupData['labels'][acti]
      }

      return (
        <ScrollView>
          <Card
            title={this.state.groupObjective}
            image={{ uri: this.state.avatar }}>
            <Text style={{marginBottom: 10}}>Top 3 Activities</Text>
            <Bar barList = { barList } />
            <Text style={{marginBottom: 10}}>Friends in the group</Text>
            <View style={styles.buttonContainer}>
              <RenderFriendList friends={this.state.friendsInGroup} />
            </View>
            {this.renderJoinButton()}
          </Card>
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
    height: 80,
    flexDirection: 'row',
  },
  friendButton: {
    height: 50,
    width: 50 ,
    borderRadius: 100,
    marginTop: 10,
    marginLeft: 10
  }
}
