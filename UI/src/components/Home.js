import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { get, put } from '../../api.js';

class Home extends Component {
  constructor() {
    super();
    this.state = {
      data: "no data",
      loading: false,
    };
    //this.fetchComments = fetchComments.bind(this);
  }

  fetchComments = async () => {
    this.setState({loading: true})
    try {
      const response = await get('testroute');
      const dummy = await response.json();
      this.setState({data: dummy.DummyData,
      loading: false});
    }
    catch(err) {
      alert(err);
    }
  };

  render() {
    let fillertext = this.state.loading ? "Loading" : this.state.data;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          {fillertext}
        </Text>

        <Button onPress={this.fetchComments} title="Test" />
      </View>
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
}

export default Home;