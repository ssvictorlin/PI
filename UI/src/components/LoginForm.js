import React, { Component } from 'react';
import { Text } from 'react-native';
import { Button, Card, CardSection, Input, Spinner } from './common';
import { get } from '../../api.js';
//import firebase from 'firebase';

export default class LoginForm extends Component {

  onButtonPress() {
    this.props.attemptLogin()
    // if(this.props.attemptLogin() == false) {
    //   this.props.setError("error");
    // }
  }

  onLoginFail() {
    this.setState({loading: false });
    alert("log in failed");
  }

  onLoginSuccess() {
    this.setState({
      loading: false,
    });
    console.log("log in success");
  }

  renderButton() {
    if (this.props.loading) {
      return <Spinner size="small" />;
    }

    return (
      <Button onPress={this.onButtonPress.bind(this)}>
        Log in
      </Button>
    );
  }

  render() {
    return (
      <Card>
        <CardSection>
          <Input
            placeholder="user@gmail.com"
            label="Email"
            value={this.props.email}
            onChangeText={email => this.props.setEmail(email)}
          />
        </CardSection>

        <CardSection>
          <Input
            secureTextEntry
            placeholder="password"
            label="Password"
            value={this.props.password}
            onChangeText={password => this.props.setPassword(password)}
          />
        </CardSection>

        <Text style={styles.errorTextStyle}>
          {this.props.error}
        </Text>

        <CardSection>
          {this.renderButton()}
        </CardSection>
      </Card>
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
