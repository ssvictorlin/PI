import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import Friends from './components/Friends';
import ScreenTwo from './components/ScreenTwo';

export const FriendStack = StackNavigator({
  Friends: {
    screen: Friends,
    navigationOptions: {
      header: null
    },
  },
  ScreenTwo: {
    screen: ScreenTwo,
    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.params.name.first.toUpperCase()} ${navigation.state.params.name.last.toUpperCase()}`,
    }),
  },
});