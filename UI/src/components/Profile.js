import React, { Component } from 'react';
import { ScrollView, View, Text, Image, Button } from 'react-native';
import { get, put } from '../../api.js';

class Profile extends Component {
	constructor() {
    super();
    this.state = {
    	radarChart: "https://i.imgur.com/rgJ7bXi.png",
      name: "Butter Croissants",
      image: "http://farm3.static.flickr.com/2788/4132734706_da037b2754.jpg",
      loading: false
    };
    //this.fetchData = fetchData.bind(this);
  }

	render() {
		const {
			containerStyle,
			thumbnailStyle,
			headerContentStyle,
			thumbnailContainerStyle,
			headerTextStyle,
			imageStyle,
			activityStyle
		} = styles;

  	return (
    	<ScrollView>
				<Image
					style={ imageStyle }
					source={{ uri: this.state.radarChart }}
				/>
				<View style={ containerStyle }>
					<View style={ thumbnailContainerStyle }>
						<Image
							style={ thumbnailStyle }
							source={{ uri: this.state.image }}
						/>
					</View>
					<View style={ headerContentStyle }>
						<Text style={ headerTextStyle }>{ this.state.name }</Text>
					</View>
				</View>
				<Text style={ activityStyle }>
					activities1
				</Text>
				<Text style={ activityStyle }>
					activities2
				</Text>
				<Text style={ activityStyle }>
					activities3
				</Text>
				<Text style={ activityStyle }>
					activities4
				</Text>
				<Text style={ activityStyle }>
					activities5
				</Text>
				<Text style={ activityStyle }>
					activities6
				</Text>
				<Text style={ activityStyle }>
					activities7
				</Text>
				<Text style={ activityStyle }>
					activities8
				</Text>
				<Text style={ activityStyle }>
					activities9
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
		width: null
	},
	activityStyle: {
		height: 40,
		fontSize: 18
	}
}

export default Profile;