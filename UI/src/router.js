import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import Friends from './components/Friends';
import FriendDetail from './components/FriendDetail';
import Groups from './components/Groups';
import GroupDetail from './components/GroupDetail';
import GroupForm from './components/GroupForm';

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

export const GroupStack = StackNavigator({
  Groups: {
    screen: Groups,
    navigationOptions: {
      header: null
    },
  },
  GroupDetail: {
    screen: GroupDetail,
    navigationOptions: ({ navigation }) => ({
      title: navigation.state.params.groupName
    }),
  },
  GroupForm: {
    screen: GroupForm,
    navigationOptions: ({ navigation }) => ({
      title: 'Create Group'
    }),
  },
});