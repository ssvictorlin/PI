import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Button, Card, CardSection, Input, Spinner } from './common';
import { get } from '../../api.js';
import firebase from 'firebase';

export default class RegisterForm extends Component {
  state = { email: '', password: '', username: '', error: '', loading: false };

  onButtonPress() {
    this.setState({loading: true})
    this.props.attemptRegister(this.state.email, this.state.password, this.state.username);
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size="small" />;
    }

    return (
      <Button onPress={this.onButtonPress.bind(this)}>
        Register
      </Button>
    );
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Text style={{alignSelf: 'stretch', height: 50, fontSize: 30, textAlign: 'center', color: 'white', backgroundColor: 'lightblue'}}>Register</Text>
        <Card>
          <CardSection>
            <Input
              placeholder="user@gmail.com"
              label="Email"
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
            />
          </CardSection>

          <CardSection>
            <Input
              placeholder="username"
              label="Username"
              value={this.state.username}
              onChangeText={username => this.setState({ username })}
            />
          </CardSection>

          <CardSection>
            <Input
              secureTextEntry
              placeholder="password"
              label="Password"
              value={this.state.password}
              onChangeText={password => this.setState({ password })}
            />
          </CardSection>

          <Text style={styles.errorTextStyle}>
            {this.state.error}
          </Text>

          <CardSection>
            {this.renderButton()}
          </CardSection>

          <CardSection>
            <Button onPress={() => this.props.showLogin()}>
              Back
            </Button>
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
