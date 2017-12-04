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
      crownIcon: "",
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
        crownIcon: pageData.crownIcon,
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
                <Text style={ styles.title }> { element } </Text>
                <Image
                  style={ styles.crownIcon }
                  source={{ uri: props.crownIcon }}
                />
                <Image
                  style={ styles.crownHolder }
                  source={{ uri: props.sortedLists[element][0]['avatar'] }}
                />
                <Text style={ styles.subtitle }> { props.sortedLists[element][0]['userName'] } </Text>
              </View>
              <PieGraph activity={ element }
              top5List={ props.sortedLists[element] }
              curUserName = { props.friendsObjList[0]['userName'] }/>
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
      rankedListsforAllActivities = {}
      for (var i = 0; i < this.props.activityList.length; i++) {
        var acti = this.props.activityList[i]
        rankedListsforAllActivities[acti] = this.getTop5List(acti)
      }
      console.log(rankedListsforAllActivities)
  		return (
    	  <ScrollView>
          <CreatePieList
            activities={this.props.activityList}
            crownHolder={this.state.crownHolder}
            crownIcon = {this.state.crownIcon}
            friendsObjList={this.state.friendsObjList}
            sortedLists = { rankedListsforAllActivities }
          />
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
      if (sortedObjList[i]['labels'][acti] == 0) break;
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
