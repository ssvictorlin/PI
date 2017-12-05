import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Button, Card, CardSection, Input, Spinner } from './common';
import { get } from '../../api.js';
import firebase from 'firebase';

export default class GroupForm extends Component {
  state = {
    groupName: '',
    objective: '',
    loading: false
  };

  createGroup = async () => {
    this.setState({loading: true});
    var user = firebase.auth().currentUser;

    if (user == null) {
      throw "user not signed in"
    }
    try {
      const response = await get('app/createGroup?userEmail=' + user.email.replace('.',',') + 
        '&groupName=' + this.state.groupName + '&groupObjective=' + this.state.objective)
        alert('Group created!');
        this.props.navigation.goBack();
    }
    catch(err) {
      alert(err);
    }
  };

  renderButton() {
    if (this.state.loading) {
      return <Spinner size="small" />;
    }

    return (
      <Button onPress={this.createGroup.bind(this)}>
        Create
      </Button>
    );
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Card>
          <CardSection>
            <Input
              placeholder="Enter group name here"
              label="Name"
              value={this.state.groupName}
              onChangeText={groupName => this.setState({ groupName })}
            />
          </CardSection>

          <CardSection>
            <Input
              placeholder="Enter group objective"
              label="Objective"
              value={this.state.objective}
              onChangeText={objective => this.setState({ objective })}
            />
          </CardSection>

          <CardSection>
            {this.renderButton()}
          </CardSection>
        </Card>
      </View>
    );
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red'
  }
};