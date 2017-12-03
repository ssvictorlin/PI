import React from 'react';

import { StackNavigator } from 'react-navigation';
import Friends from './Friends';
import ScreenTwo from './ScreenTwo';

const FriendsNavigator = StackNavigator({
    Friends: { screen: Friends},
    ScreenTwo: { screen: ScreenTwo}
})

export default FriendsNavigator;