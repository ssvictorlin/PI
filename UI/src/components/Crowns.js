import React, { Component } from 'react';
import { ScrollView, View, Image, Text } from 'react-native';
import { get, put } from '../../api.js';
import Card from './Card';
import CardSection from './CardSection';

export default class Crowns extends Component {
  constructor() {
    super();
    this.state = {
      crownHolder: "",
      pieChart: "",
      loading: false
    };
  }

  componentWillMount() {
    this.getData();
  }

  getData = async () => {
    this.setState({loading: true});
    try {
      const response = await get('crowns');
      const data = await response.json();
      this.setState({
        crownHolder: data.crownHolder,
        pieChart: data.pieChart,
        loading: false
      });
    }
    catch(err) {
      alert(err);
    }
  };

	render() {
    if (this.state.loading == true) {
      return <Text>Insert Loading GIF here</Text>
    } else {
  		return (
    	  <ScrollView>
				  <Card>
            <CardSection>
              <View style={ styles.container }>
                <View style={ styles.crownHolderContainer }>
                  <Image
                    style={ styles.crownHolder }
                    source={{ uri: this.state.crownHolder }}
                  />
                </View>
                <View style={ styles.crownHolderContainer }>
                  <Image
                    style={ styles.pieChart }
                    source={{ uri: this.state.pieChart }}
                  />
                </View>
              </View>
		  		  </CardSection>
          </Card>
          <Card>
            <CardSection>
              <View style={ styles.container }>
                <View style={ styles.crownHolderContainer }>
                  <Image
                    style={ styles.crownHolder }
                    source={{ uri: this.state.crownHolder }}
                  />
                </View>
                <View style={ styles.crownHolderContainer }>
                  <Image
                    style={ styles.pieChart }
                    source={{ uri: this.state.pieChart }}
                  />
                </View>
              </View>
            </CardSection>
          </Card>
      	</ScrollView>
    	);
    }
  }
};

const styles = {
  container: {
    borderBottomWidth: 1,
    padding: 5,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative'
  },
  crownHolder: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  crownHolderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  pieChart: {
    height: 100,
    width: 100
  }
}