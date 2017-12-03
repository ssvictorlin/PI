import React, { Component } from 'react';
import { ScrollView, View, Image, Text, ActivityIndicator, Button, ListView } from 'react-native';
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
      dataSource: null
    };
    this.userList = [];
  }

  componentWillMount() {
    this.fetchUsersFriends(); 
    var user = firebase.auth().currentUser;
    return get('app/fetchAllUsers?userEmail=' + user.email)
    .then((response) => response.json())
    .then((responseJson) => {
      let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({
        dataSource: ds.cloneWithRows(responseJson),
        loading: false
      }, function() {
        // In this block you can do something with new state.
        this.userList = responseJson ;
        console.log(this.userList);
      });
    })
    .catch((error) => {
      console.error(error);
    });
  }

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
        friends: data,
      });
    }
    catch(err) {
      alert(err);
    }
  };

  GetListViewItem (userName) {
    Alert.alert(userName);
  }

  SearchFilterFunction(term){
    const newData = this.userList.filter(function(item){
      const itemData = item.userName.toUpperCase()
      const textData = term.toUpperCase()
      return itemData.indexOf(textData) > -1
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

  renderRow (rowData, sectionID) {
    if (rowData.isFriend) {
      return (
        <ListItem
          roundAvatar
          key={sectionID}
          title={rowData.userName}
          subtitle='Friend'
          avatar={{uri:rowData.avatar}}
          hideChevron={true}
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
          // rightIcon={{name: 'plus', style: {marginRight: 10}, type: 'material-community'}}
        />
      )
    }
  }

  render() {
    /*
      CreateFriendList: loop through user's friend and return every friend item.
    */
    function CreateFriendList(props) {
      const friends = props.friends;
      const friendItems = friends.map((element, index) => 
        <Card key={index}>
          <CardSection>
            <View style={styles.container}>
              <Text>{ element.userName }</Text>
              <Image
                style={ styles.thumbnail }
                source={{ uri: element.avatar }}
              />
            </View>
          </CardSection>
        </Card>
      );
      return friendItems;
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
        <ScrollView>
          <SearchBar
            lightTheme
            onChangeText={(term) => this.SearchFilterFunction(term)}
            placeholder='Search friends'
          />
          { this.state.hasTermInSearchBar
              ? <List>
                  <ListView
                    renderRow={this.renderRow}
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
    backgroundColor: '#F5FCFF',
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
}