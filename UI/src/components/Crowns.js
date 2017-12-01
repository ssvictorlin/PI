import React, { Component } from 'react';
import { ScrollView, View, Image, Text, ActivityIndicator } from 'react-native';
import { get } from '../../api.js';
import { Card, CardSection } from './common';
import PieGraph from './pie.js'
import firebase from 'firebase';

export default class Crowns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      crownHolder: "",
      pieChart: "",
      loading: false,
      friendsObjList: [] // friends' objects list
    };
  }

  componentWillMount() {
    this.getData()
  }
  /*
    getData: will get page data (i.e. images etc.) and friends' data 
    and will store the data in the state of Crown
  */
  getData = async () => {
    this.setState({loading: true});
    var user = firebase.auth().currentUser
    
    if (user == null) {
      throw "user not signed in"
    }
    try {
      const response = await get('app/crowns')
      const pageData = await response.json()
     
      const email = user.email.replace('.',',')
      const res = await get('app/readUser'+'?userEmail='+email)
      const userData = await res.json()
      var result = []
      result.push(userData)
      for (var key in userData.friends) {
        const r = await get('app/readUser'+'?userEmail='+key)
        const d = await r.json()
        result.push(d)
      }

      this.setState({
        crownHolder: pageData.crownHolder,
        pieChart: pageData.pieChart,
        loading: false,
        friendsObjList: result
      });
    }
    catch(err) {
      alert(err);
    }
  };

	render() {
    /*
      CreatePieList: loop through activityList and return every piechart item.
    */
    function CreatePieList(props) {
      const activityList = props.activities
      const pieItems = activityList.map((element, index) => 
        <Card key={index}>
          <CardSection>
            <View style={ styles.container }>
              <View style={ styles.crownHolderContainer }>
                <Text style={ styles.subtitle }> { element } </Text>
                <Image
                  style={ styles.crownHolder }
                  source={{ uri: props.crownHolder }}
                />
              </View>
              <PieGraph activity={ element }
              friendsObjList={props.friendsObjList}/>
            </View>
          </CardSection>
        </Card>
      );
      return pieItems;
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
          <CreatePieList
            activities={this.props.activityList}
            crownHolder={this.state.crownHolder}
            friendsObjList={this.state.friendsObjList}
          />
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
  subtitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 0,
    width: 150,
  },
  crownHolder: {
    height: 80,
    width: 80,
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
    width: 100,
  },
  centering: {
		alignItems: 'center',
    justifyContent: 'center',
		padding: 8
	}
}
