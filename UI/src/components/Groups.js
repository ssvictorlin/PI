import React, { Component } from 'react';
import { ScrollView, View, Image, Text, ActivityIndicator, Button } from 'react-native';
import { Card, CardSection } from './common';
import { get } from '../../api.js';
import firebase from 'firebase';

export default class Groups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      loading: false
    };
  }

  componentWillMount() {
    this.getData();
  }

  getData = async () => {
    this.setState({loading: true});
    var user = firebase.auth().currentUser;

    if (user == null) {
      throw "user not signed in"
    }
    try {
      const response = await get('app/groups?email=' + user.email);
      const data = await response.json();
      console.log(data);
      this.setState({
        groups: data,
        loading: false
      });
    }
    catch(err) {
      alert(err);
    }
  };

  renderGroups = () => {
    return this.state.groups.map(group =>
      <Group key={ group.groupName } group={ group } />
    );
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
              <Button title="Join" />
            </View>
            <View>
              <Text>{ element.top3[0] }</Text>
              <Text>{ element.top3[1] }</Text>
              <Text>{ element.top3[2] }</Text>
            </View>
            <View>
              <Text>{ element.intersectList[0] }</Text>
              <Text>{ element.intersectList[1] }</Text>
              <Text>is also in this group</Text>
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
          <CreateGroupList
            groups={this.state.groups}
          />
      	</ScrollView>
    	);
    }
    return (
      <ScrollView>
        { this.renderGroups }
      </ScrollView>
    )
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