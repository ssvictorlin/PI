import React, { Component } from 'react';
import { ScrollView, View, Image, Text, ActivityIndicator, Button, ListView } from 'react-native';
import { SearchBar, List, ListItem } from 'react-native-elements';
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
      dataSource: null
    };
    this.groupList = [];
  };

  componentWillMount() {
    this.fetchGroupsUserIn();
    var user = firebase.auth().currentUser;
    return get('app/fetchAllGroups?userEmail=' + user.email)
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

  GetListViewItem (groupName) {
    Alert.alert(groupName);
  }

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

  renderRow (rowData, sectionID) {
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
          hideChevron={true}
        />
      )
    }
  }

  render() {
    /*
      CreateGroupList: loop through groups and return every group item.
    */
    function CreateGroupList(props) {
      const groups = props.groups;
      const groupItems = groups.map((element, index) => 
        <Card key={index}>
          <CardSection>
            <View style={styles.container}>
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
          </CardSection>
        </Card>
      );
      return groupItems;
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
          { this.state.hasTermInSearchBar
              ? <List>
                  <ListView
                    renderRow={this.renderRow}
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