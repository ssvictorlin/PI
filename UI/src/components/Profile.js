import React, { Component } from 'react';
import { ScrollView, View, Text, Image, Button, ActivityIndicator } from 'react-native';
import { get, put } from '../../api.js';
import { Icon, List, ListItem } from 'react-native-elements';

// require the module
var RNFS = require('react-native-fs');

const list = [
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

export default class Profile extends Component {
	constructor() {
    super();
    this.state = {
    	radarChart: "",
      name: "",
      avatar: "",
			data: "TODO",
			loading: false
    };
  }

	componentWillMount() {
		this.sendData();
		this.getData();
	}

	sendData = async () => {
		this.setState({loading: true});
		try {
			// get a list of files and directories in the ExtraSensory directory
			// current path is static, to test on tour own, you should change last 8 character into your phone UID
			const extraSensoryPath = RNFS.ExternalStorageDirectoryPath + '/Android/data/edu.ucsd.calab.extrasensory/files/Documents/extrasensory.labels.2C102E28';
			var extraSensoryData;
			// an array to store desired json
			var fileData = [];
			await RNFS.readDir(extraSensoryPath)
			  .then((result) => {
			  	extraSensoryData = result;
			  	// print all the data in console
			  	var i;
			    for (i = 0; i < extraSensoryData.length; i++) {
			    	// TO-DO: cannot put content into fileData array appropriately, so now just showing data
			    	RNFS.readFile(result[i].path, 'utf8')
			    		.then((content) => {console.log(content)})
			    		.catch((err) => {
			    			console.log(err.message, err.code);
			  			});;
			    }
			  })
			  .catch((err) => {
			    console.log(err.message, err.code);
			  });
			console.log(fileData);
			// can successfully put data to backend and get same data back
	    const response = await put('app/send', extraSensoryData);
	    console.log("get response");
			const data = await response.json();
			this.setState({
	    	data: data.DummyData,
			});
			console.log(this.state.data);
    }
    catch(err) {
      alert(err);
    }
	};

	getData = async () => {
		this.setState({loading: true});
    try {
      const response = await get('app/profile');
      const data = await response.json();
      this.setState({
      	name: data.name,
      	radarChart: data.radarChart,
      	avatar: data.avatar,
				loading: false
			});
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
	  	return (
	    	<ScrollView>
					<Image
						style={ styles.image }
						source={{ uri: this.state.radarChart }}
					/>
					<View style={ styles.container }>
						<View style={ styles.thumbnailContainer }>
							<Image
								style={ styles.thumbnail }
								source={{ uri: this.state.avatar }}
							/>
						</View>
						<View style={ styles.headerContent }>
							<Text style={ styles.headerText }>{ this.state.name }</Text>
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
	headerContent: {
		flexDirection: 'column',
		justifyContent: 'space-around'
	},
	headerText: {
		fontSize: 18
	},
	thumbnail: {
		height: 50,
		width: 50
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
