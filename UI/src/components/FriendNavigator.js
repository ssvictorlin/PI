import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import Friends from './Friends';
import ScreenTwo from './ScreenTwo';

const routeConfigs = {
  Friends: {
    screen: Friends,
    navigationOptions: {
      header: null
    }
  },
  ScreenTwo: {
    screen: ScreenTwo,
    navigationOptions: ({ navigation }) => ({
      // title: `${navigation.state.params.name.first.toUpperCase()} ${navigation.state.params.name.last.toUpperCase()}`,
      title: 'ScreenTwo'
    }),
  },
};

const navigatorConfig = {
  initialRouteName: 'Friends',
};

const FriendNavigator = StackNavigator(routeConfigs, navigatorConfig);

export default FriendNavigator;