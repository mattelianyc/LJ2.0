import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  PushNotificationIOS,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import HomeScreen from './src/screens/HomeScreen';
import QRScreen from './src/screens/QRScreen';

import SettingsScreen from './src/screens/SettingsScreen';
import DetailsScreen from './src/screens/DetailsScreen';

import firebase from 'react-native-firebase';

const instructions = Platform.select({
  ios: 'Click to Scan QR Code',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};

export default class App extends Component<Props> {

  constructor() {
    super();
    PushNotificationIOS.requestPermissions();
  }

  render() {
    const HomeStack = createStackNavigator({
      Home: { screen: HomeScreen },
      QR: { screen: QRScreen },
    });

    const SettingsStack = createStackNavigator({
      Settings: { screen: SettingsScreen },
      Details: { screen: DetailsScreen },
    });

    const MainNavigator = createBottomTabNavigator({
      Home: { screen: HomeStack },
      Settings: { screen: SettingsStack },
    },
    {
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) => {
          const { routeName } = navigation.state;
          let iconName;
          if (routeName === 'Home') {
            iconName = `${focused ? 'ios-information-circle' : 'ios-information-circle-outline'}`;
          } else if (routeName === 'Settings') {
            iconName = `${focused ? 'ios-help-circle' : 'ios-help-circle-outline'}`;
          }
          return <Ionicons name={iconName} size={25} color={tintColor} />;
        },
      }),
      tabBarOptions: {
        activeTintColor: 'darkred',
        inactiveTintColor: 'lightcoral',
      },
    });

    return <MainNavigator />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
