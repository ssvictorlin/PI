// Import a library to help create a component
import React from 'react';
import { Text, View } from 'react-native';

// Make a component
const Footer = () => {
	const { textStyle, viewStyle } = styles;

	return (
		<View style={ viewStyle }>
			<Text style={ textStyle }>Profile</Text>
			<Text style={ textStyle }>King</Text>
		</View>
	);
};

const styles = {
	viewStyle: {
		backgroundColor: '#4B4B52',
		justifyContent: 'center',
		flexDirection: 'row',
		alignItems: 'center',
		height: 60,
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		elevation: 2,
		position: 'relative'
	},
	textStyle: {
		fontSize: 20,
		color: 'white'
	}
};

// Make the component available to other parts of the app
export default Footer;
