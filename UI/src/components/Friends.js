import React, { Component } from 'react';
import { ScrollView, View, Image, Text, ActivityIndicator, Button, ListView, TouchableHighlight } from 'react-native';
import { SearchBar, List, ListItem } from 'react-native-elements';
import { StackNavigator } from 'react-navigation';
import { Card, CardSection } from './common';
import { get } from '../../api.js';
import firebase from 'firebase';

export default class Friends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: [],
      loading: false,
      hasTermInSearchBar: false,
      term: '',
      dataSource: null,
      curUserName: null
      // userList: null
    };
    this.userList = [];
    // const { navigate } = this.props.navigation;
    // console.log(this.props.navigation.navigate);
  }

  componentWillMount() {
    this.fetchUsersFriends();
    this.getCurUser();
    var user = firebase.auth().currentUser;
    this.fetchAllUsers(user.email)
  }

  fetchAllUsers = async (userEmail) => {
    const response = await get('app/fetchAllUsers?userEmail=' + userEmail)
    .then((response) => response.json())
    .then((responseJson) => {
      let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({
        dataSource: ds.cloneWithRows(responseJson),
        loading: false,
        // userList: responseJson
      }, function() {
        // In this block you can do something with new state.
        this.userList = responseJson ;
        console.log(this.userList);
      });
    })
    .catch((error) => {
      console.error(error);
    });
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

  fetchUsersFriends = async () => {
    this.setState({loading: true});
    var user = firebase.auth().currentUser;

    if (user == null) {
      throw "user not signed in"
    }
    try {
      const response = await get('app/fetchUsersFriends?userEmail=' + user.email);
      const data = await response.json();
      console.log(data);
      this.setState({
        friends: data
      });
    }
    catch(err) {
      alert(err);
    }
  };

  SearchFilterFunction(term){
    const newData = this.userList.filter(function(item){
      console.log(item.length);
      const itemData = item.userName.toUpperCase();
      const textData = term.toUpperCase();
      return itemData.indexOf(textData) > -1;
    })
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(newData),
      term: term,
      hasTermInSearchBar: true
    })
    if (term == '') {
      this.setState({
        hasTermInSearchBar: false
      });
    }
  }

  render() {
    const { navigate } = this.props.navigation;

    function CreateFriendList(props) {
      const friends = props.friends;
      if (friends.length != 0) {
        const friendItems = friends.map((element, index) =>
          <ListItem
            key={index}
            title={element.userName}
            avatar={{ uri: element.avatar }}
            roundAvatar={true}

            onPress={() => navigate('FriendDetail', {
              userName: element.userName,
              userEmail: element.userEmail,
              isFriend: true
            })}
          />
        );
        return friendItems;
      } else {
        return (
          <Text>You don't have any friend!</Text>
        );
      }
    }

    function renderRow (rowData, sectionID) {
      console.log(rowData);
      if (rowData.isFriend) {
        return (
          <ListItem
            roundAvatar
            key={sectionID}
            title={rowData.userName}
            subtitle='Friend'
            avatar={{uri:rowData.avatar}}
            hideChevron={true}
            onPress={() => navigate('FriendDetail', {
              userName: rowData.userName,
              userEmail: rowData.userEmail,
              isFriend: rowData.isFriend
            })}
          />
        )
      } else {
        return (
          <ListItem
            roundAvatar
            key={sectionID}
            title={rowData.userName}
            subtitle='Stranger'
            avatar={{uri:rowData.avatar}}
            hideChevron={true}
            onPress={() => navigate('FriendDetail',
            { userName: rowData.userName,
              userEmail: rowData.userEmail,
              isFriend: rowData.isFriend
            })}
          />
        )
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
      return (
        <ScrollView style={{backgroundColor: '#FFF'}}>
          <SearchBar
            lightTheme
            onChangeText={(term) => this.SearchFilterFunction(term)}
            placeholder='Search friends'
          />
          { this.state.hasTermInSearchBar
              ? <List>
                  <ListView
                    renderRow={renderRow}
                    dataSource={this.state.dataSource}
                  />
                </List>
              : <CreateFriendList
                  friends={this.state.friends}
                />
          }
        </ScrollView>
      );
    }
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
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
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10
  }
}
