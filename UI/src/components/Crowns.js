import React, { Component } from 'react';
import { ScrollView, Text} from 'react-native';
import { get, put } from '../../api.js';

class Crowns extends Component {
	render() {
  		return (
    	<ScrollView>
				<Text style={ styles.welcome }>
					Coming Soon
				</Text>
    	</ScrollView>
  	);
  }
};

const styles = {
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
}


export default Crowns;