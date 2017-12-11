import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
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

  registerPress() {
    alert("TODO");
  }

  renderButton() {
    if (this.props.loading) {
      return  <CardSection><Spinner size="small" /></CardSection>;
    }

    return (
      <CardSection>
        <Button onPress={this.onButtonPress.bind(this)}>
          Log in
        </Button>
        <Button onPress={() => this.props.showRegister()}>
          Register
        </Button>
      </CardSection>
    );
  }

  render() {
    const resizeMode = 'cover';
    return (
      <View style={styles.roundEdges}>
        <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          >
            <Image
              style={{
                flex: 1,
                resizeMode,
              }}
              source={require('../bg.jpg')}
            />
        </View>
        <Card>
          <View>
            <Text style={styles.header}>Personality Insights</Text>
          </View>
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
          {this.renderButton()}
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
  },
  header: {
    fontSize: 40,
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
    color: '#FFF',
    backgroundColor: '#778899',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  roundEdges: {
    flex: 1,
    justifyContent: 'center'
  }
};
