import React, { Component } from 'react';
import { ScrollView, View, Image, Text, ActivityIndicator, Dimensions } from 'react-native';
import { get } from '../../api.js';
import { Card, CardSection } from './common';
import PieGraph from './pie.js'
import firebase from 'firebase';

export default class Crowns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      crownIcon: 'https://image.ibb.co/kna94b/icons8_crown_48.png',
      loading: false,
      friendsObjList: [] // friends' objects list
    };
  }

  componentWillMount() {
    console.log("mounting");
    this.getData();
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.state);
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
        loading: false,
        friendsObjList: result
      });
    }
    catch(err) {
      alert(err);
    }
  };

  /*
    CreatePieList: loop through activityList and return every piechart item.
  */
  CreatePieList() {
    const activityList = this.props.activityList;
    let sortedLists = {}
    for (var i = 0; i < this.props.activityList.length; i++) {
      var acti = this.props.activityList[i];
      sortedLists[acti] = this.getTop5List(acti);
    }
    /* TODO: update to map on sortedLists or do an if exists on sortedLists */
    var pieItems = activityList.map((element, index) =>
      <Card key={index}>
        <CardSection>
          <View style={ styles.container }>
            <View style={ styles.crownHolderContainer }>
              <Text style={ styles.title }> { element } </Text>
              <Image
                style={ styles.crownIcon }
                source={{ uri: this.state.crownIcon }}
              />
              <Image
                style={ styles.crownHolder }
                source={{ uri: sortedLists[element][0]['avatar'] }}
              />
              <Text style={ styles.subtitle }> { sortedLists[element][0]['userName'] } </Text>
            </View>
            <PieGraph style={ styles.pieChart } activity={ element }
            top5List={ sortedLists[element] }
            curUserName = { this.state.friendsObjList[0]['userName'] }/>
          </View>
        </CardSection>
      </Card>
    );
    return pieItems;
  }

	render() {
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
          {this.CreatePieList()}
      	</ScrollView>
    	);
    }
  }
   /*
    getTop5List: will use friendsObjList to find out top 5 people
    (including current user) that have the most minutes on the activity
    this piechart is for. It will skip zero minute usage.
  */
  getTop5List(acti) {
    function compare(a,b) {
      if (a['labels'][acti] < b['labels'][acti])
        return 1;
      if (a['labels'][acti] > b['labels'][acti])
        return -1;
      return 0;
    }
    var sortedObjList = this.state.friendsObjList.slice(0)
    sortedObjList.sort(compare)
    result = []
    for (var i = 0; i < 5; i++) {
      if (!sortedObjList[i] || (i > 0 && sortedObjList[i]['labels'][acti] == 0)) break;
      if (sortedObjList[i]['userName'] == this.state.friendsObjList[0]['userName']) {
        sortedObjList[i]['userName'] = 'It\'s You!'
      }
      result.push(sortedObjList[i])
    }
    return result
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
  title: {
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 0,
    marginBottom: 15,
    width: 150,
  },
  subtitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 0,
    width: 150,
  },
  crownIcon: {
    height: 48,
    width: 48,
    alignItems: 'center',
  },
  crownHolder: {
    height: 80,
    width: 80,
    borderRadius: 50,
  },
  crownHolderContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  pieChart: {
    justifyContent: 'center',
    height: 150,
    paddingTop: 10,
    paddingBottom: 10,
  },
  centering: {
		alignItems: 'center',
    justifyContent: 'center',
		padding: 8
	}
}
