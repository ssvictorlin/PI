import React from 'react';
import { View, Text } from 'react-native';

const Profile = ({ profile }) => {
	const { thumbnailStyle,
			headerContentStyle,
			thumbnailContainerStyle,
			headerTextStyle
	} = styles;

  return (
		<View>
			<View style={ thumbnailContainerStyle }>
				<Text style={ thumbnailStyle }>Image</Text>
			</View>
			<View style={ headerContentStyle }>
				<Text style={ headerTextStyle }>Eric Wen</Text>
				<Text>Eric Wen</Text>
			</View>
		</View>
	);
}

const styles = {
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
	}
};

export default Profile;