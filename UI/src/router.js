import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import Friends from './components/Friends';
import FriendDetail from './components/FriendDetail';

export const FriendStack = StackNavigator({
  Friends: {
    screen: Friends,
    navigationOptions: {
      header: null
    },
  },
  FriendDetail: {
    screen: FriendDetail,
    navigationOptions: ({ navigation }) => ({
      title: navigation.state.params.userName
    }),
  },
});