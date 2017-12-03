import React, { Component } from 'react';
import { ScrollView, View, Text, Image, Button, ActivityIndicator } from 'react-native';
import { get, put } from '../../api.js';
import RadarGraph from './radar.js';
import { Icon, List, ListItem } from 'react-native-elements';
import firebase from 'firebase';

// require the module
var RNFS = require('react-native-fs');

export default class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: null,
      name: null,
      avatar: null,
      loading: false
    };
  }

  componentWillMount() {
    this.sendData();
    this.getData();
  }

  // get a list of files and directories in the ExtraSensory directory and send to backend
  sendData = async () => {
    this.setState({
      email: this.props.email,
      loading: true
    });
    try {
      var extraSensoryPath = RNFS.ExternalStorageDirectoryPath + '/Android/data/edu.ucsd.calab.extrasensory/files/Documents/';
      // 8 digits phone UID
      var phoneUID;
      // try to read last 8 digits
      await RNFS.readDir(extraSensoryPath)
        .then((result) => {
          // stat the first file (which also have one directory in our case)
          return Promise.all([RNFS.stat(result[0].path), result[0].path]);
        })
        .then((statResult) => {
          // only extrasensory.labels.xxxxxxxx directory exists
          if (statResult[0].isDirectory()) {
            // if we have a directory, read it
            phoneUID = statResult[1].substr(statResult[1].length - 8);
          }
        })
        .catch((err) => {
          console.log(err.message, err.code);
        });
      // construct new complete path
      extraSensoryPath = extraSensoryPath + 'extrasensory.labels.' + phoneUID;
      // an array to store promises
      var promises = [];
      // an array to store
      var extraSensoryData = [];
      // construct extraSensoryData by appending all data into an array
      await RNFS.readDir(extraSensoryPath)
        .then((result) => {
          for (var i = 0; i < result.length; i++) {
            // push promise into array
            promises.push(RNFS.readFile(result[i].path, 'utf8'));
          }
          // wait for all promises to finish and execute 'then'
          return Promise.all(promises);
        })
        .then((content) => {
          extraSensoryData.push(content);
        })
        .catch((err) => {
          console.log(err.message, err.code);
        });

      // can successfully put data to backend and get same data back
      const response = await put('app/send', extraSensoryData);
      console.log("get response");
      const data = await response.json();
    }
    catch(err) {
      console.log(err);
      // alert("No ExtraSensory Data on this phone!");
    }
  };

  getData = async () => {
    this.setState({loading: true});
    try {
      if (this.props.email) {
        // User is signed in.
        const response = await get('app/profile?email=' + this.props.email);
        const data = await response.json();
        this.setState({
          name: data.username,
          avatar: data.avatar,
          loading: false
        });
      } else {
        // No user is signed in.
      }
    }
    catch(err) {
      alert(err);
    }
  };

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
      /* The list of things to show, hard coded for now */
      /* TODO, replace below with something like this:
         var list = this.getList();
         which will get the list of stuff from the settings,
         which should be stored in App.js once set
       */
      var list = [
        {
          name: 'Running',
          icon: 'run'
        },
        {
          name: 'Walking',
          icon: 'walk'
        },
        {
          name: 'In a car',
          icon: 'car'
        },
        {
          name: 'Bicycling',
          icon: 'bike'
        },
        {
          name: 'Sleeping',
          icon: 'sleep'
        },
      ]
      return (
        <ScrollView>
          <RadarGraph />
          <View style={ styles.container }>
            <View style={ styles.thumbnailContainer }>
              <Image
                style={ styles.thumbnail }
                source={{ uri: this.state.avatar }}
              />
            </View>
            <View style={ styles.nameContainer }>
              <Text style={ styles.name }>{ this.state.name }</Text>
            </View>
          </View>
          <List containerStyle={{marginBottom: 20}} hideChevron={true}>
            {
              list.map((item, i) => (
                <ListItem
                  key={i}
                  title={item.name}
                  leftIcon={{name: item.icon, type: 'material-community'}}
                />
              ))
            }
          </List>
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
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative'
  },
  nameContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  name: {
    fontSize: 24
  },
  thumbnail: {
    height: 80,
    width: 80,
    borderRadius: 50,
  },
  thumbnailContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10
  },
  image: {
    height: 300,
    flex: 1,
    width: null,
  },
  activity: {
    height: 40,
    fontSize: 18
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8
  }
}
