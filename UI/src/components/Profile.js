import React, { Component } from 'react';
import { ScrollView, View, Text, Image, Button } from 'react-native';
import { get, put } from '../../api.js';

export default class Profile extends Component {
	constructor() {
    super();
    this.state = {
    	radarChart: "https://i.imgur.com/rgJ7bXi.png",
      name: "Butter Croissants",
      image: "http://farm3.static.flickr.com/2788/4132734706_da037b2754.jpg",
			data: "TODO"
    };
  }

	componentWillMount() {
		this.getData();
	}

	getData = async () => {
    try {
      const response = await get('testroute');
      const dummy = await response.json();
      this.setState({data: dummy.DummyData});
    }
    catch(err) {
      alert(err);
    }
  };

	render() {
  	return (
    	<ScrollView>
				<Image
					style={ styles.imageStyle }
					source={{ uri: this.state.radarChart }}
				/>
				<View style={ styles.containerStyle }>
					<View style={ styles.thumbnailContainerStyle }>
						<Image
							style={ styles.thumbnailStyle }
							source={{ uri: this.state.image }}
						/>
					</View>
					<View style={ styles.headerContentStyle }>
						<Text style={ styles.headerTextStyle }>{ this.state.name }</Text>
					</View>
				</View>
				<Text style={ styles.activityStyle }>
					activities1
				</Text>
				<Text style={ styles.activityStyle }>
					activities2
				</Text>
				<Text style={ styles.activityStyle }>
					activities3
				</Text>
				<Text style={ styles.activityStyle }>
					activities4
				</Text>
				<Text style={ styles.activityStyle }>
					activities5
				</Text>
				<Text style={ styles.activityStyle }>
					activities6
				</Text>
				<Text style={ styles.activityStyle }>
					activities7
				</Text>
				<Text style={ styles.activityStyle }>
					activities8
				</Text>
				<Text style={ styles.activityStyle }>
					{ this.state.data }
				</Text>
    	</ScrollView>
  	);
  }
};

const styles = {
	containerStyle: {
		borderBottomWidth: 1,
		padding: 5,
		backgroundColor: '#fff',
		justifyContent: 'flex-start',
		flexDirection: 'row',
		borderColor: '#ddd',
		position: 'relative'
	},
	headerContentStyle: {
		flexDirection: 'column',
		justifyContent: 'space-around'
	},
	headerTextStyle: {
		fontSize: 18
	},
	thumbnailStyle: {
		height: 50,
		width: 50
	},
	thumbnailContainerStyle: {
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 10,
		marginRight: 10
	},
	imageStyle: {
		height: 300,
		flex: 1,
		width: null,
	},
	activityStyle: {
		height: 40,
		fontSize: 18
	}
}
