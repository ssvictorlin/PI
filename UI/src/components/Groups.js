import React, { Component } from 'react';
import { ScrollView, View, Image, Text, ActivityIndicator, ListView, TouchableHighlight } from 'react-native';
import { SearchBar, List, ListItem, Button } from 'react-native-elements';
import { StackNavigator } from 'react-navigation';
import { Card, CardSection } from './common';
import { get } from '../../api.js';
import firebase from 'firebase';

export default class Groups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      loading: false,
      hasTermInSearchBar: false,
      term: '',
      dataSource: null,
      curUserName: null
    };
    this.groupList = [];
  };

  componentWillMount() {
    this.fetchGroupsUserIn();
    this.getCurUser();
    var user = firebase.auth().currentUser;
    this.fetchAllGroups(user.email);
  }

  fetchAllGroups = async (userEmail) => {
    const response = await get('app/fetchAllGroups?userEmail=' + userEmail)
    .then((response) => response.json())
    .then((responseJson) => {
      let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({
        dataSource: ds.cloneWithRows(responseJson),
        loading: false
      }, function() {

        // In this block you can do something with new state.
        this.groupList = responseJson ;
      });
    })
    .catch((error) => {
      console.error(error);
    });
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

  fetchGroupsUserIn = async () => {
    this.setState({loading: true});
    var user = firebase.auth().currentUser;

    if (user == null) {
      throw "user not signed in"
    }
    try {
      const response = await get('app/fetchGroupsUserIn?userEmail=' + user.email);
      const data = await response.json();
      console.log(data);
      this.setState({
        groups: data,
      });
    }
    catch(err) {
      alert(err);
    }
  };

  SearchFilterFunction(term){
    const newData = this.groupList.filter(function(item){
      const itemData = item.groupName.toUpperCase()
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

  render() {
    const { navigate } = this.props.navigation;

    function CreateGroupList(props) {
      const groups = props.groups;
      if (groups.length != 0) {
        const groupItems = groups.map((element, index) => 
          <Card key={index}>
            <CardSection>
              <TouchableHighlight
                style={styles.container}
                onPress={() => navigate('GroupDetail', {
                  groupName: element.groupName,
                  groupEmail: element.groupEmail,
                  isJoined: true,
                  groupObjective: element.groupObjective
                })}
              >
                <View>
                  <View>
                    <Text>{ element.groupName }</Text>
                    <Image
                      style={ styles.thumbnail }
                      source={{ uri: element.avatar }}
                    />
                  </View>
                  <View>
                    <Text>{ element.top3[0] }</Text>
                    <Text>{ element.top3[1] }</Text>
                    <Text>{ element.top3[2] }</Text>
                  </View>
                </View>
              </TouchableHighlight>
            </CardSection>
          </Card>
        );
        return groupItems;
      } else {
        return (
          <Text>You haven't joined any group!</Text>
        );
      }
    }

    function renderRow (rowData, sectionID) {
      if (rowData.isJoined) {
        return (
          <ListItem
            roundAvatar
            key={sectionID}
            title={rowData.groupName}
            subtitle={rowData.subtitle}
            avatar={{uri:rowData.avatar}}
            rightTitle='Joined'
            hideChevron={true}
            onPress={() => navigate('GroupDetail', {
              groupName: rowData.groupName,
              groupEmail: rowData.groupEmail,
              isJoind: rowData.isJoined,
              groupObjective: rowData.groupObjective
            })}
          />
        )
      } else {
        return (
          <ListItem
            roundAvatar
            key={sectionID}
            title={rowData.groupName}
            subtitle={rowData.subtitle}
            avatar={{uri:rowData.avatar}}
            rightTitle='Not Joined'
            hideChevron={true}
            onPress={() => navigate('GroupDetail', {
              groupName: rowData.groupName,
              groupEmail: rowData.groupEmail,
              isJoind: rowData.isJoined,
              groupObjective: rowData.groupObjective
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
    	  <ScrollView>
          <SearchBar
            lightTheme
            onChangeText={(term) => this.SearchFilterFunction(term)}
            placeholder='Search groups'
          />
          <Button
            large
            icon={{name: 'plus', type: 'font-awesome'}}
            title='Create group'
            backgroundColor='#ff9966'
            onPress={() => navigate('GroupForm')}
          />
          { this.state.hasTermInSearchBar
              ? <List>
                  <ListView
                    renderRow={renderRow}
                    dataSource={this.state.dataSource}
                  />
                </List>
              : <CreateGroupList
                  groups={this.state.groups}
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