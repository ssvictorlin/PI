import React, { Component } from 'react';
import { ScrollView, View, Text, Image, Button, ActivityIndicator } from 'react-native';
import { get, put } from '../../api.js';

export default class Profile extends Component {
	constructor() {
    super();
    this.state = {
    	radarChart: "",
      name: "",
      image: "",
			data: "TODO",
			loading: false
    };
  }

	componentWillMount() {
		this.getData();
	}

	getData = async () => {
		this.setState({loading: true});
    try {
      const response = await get('profile');
      const data = await response.json();
      this.setState({
      	data: data.DummyData,
      	name: data.name,
      	radarChart: data.radarChart,
      	image: data.image,
				loading: false});
    }
    catch(err) {
      alert(err);
    }
  };

	render() {
		if (this.state.loading == true) {
			return (<ActivityIndicator
	        animating={this.state.loading}
	        style={[styles.centering, {height: 80}]}
	        size="large"
	      />);
		} else {
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
						{ this.state.data }
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
	},
	centering: {
		alignItems: 'center',
    justifyContent: 'center',
		padding: 8
	}
}
