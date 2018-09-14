/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';

import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Button,
  AsyncStorage
} from 'react-native';

import Header from './src/components/header';
import Rssi from './src/components/rssi';

import { BleManager } from 'react-native-ble-plx';
import KalmanFilter from 'kalmanjs';

const instructions = Platform.select({
  ios: 'Click to Scan QR Code',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


type Props = {};

// this.manager = new BleManager({
//   restoreStateIdentifier: 'testBleBackgroundMode',
//   restoreStateFunction: bleRestoredState => {
//     console.log(bleRestoredState);
//   }
// });

export default class App extends Component<Props> {

  constructor() {
      super();
      
      this.setState({rssi: 0});
      // async storage
      // console.log(AsyncStorage.setItem('asdfa'));
      
      this.manager = new BleManager();
      const kf = new KalmanFilter();
      
      //BACKGROUND MODE WORKS, DO WE NEED THIS?
      // this.manager = new BleManager({
      //   restoreStateIdentifier: 'testBleBackgroundMode',
      //   restoreStateFunction: bleRestoredState => {
      //     console.log(bleRestoredState);
      //   }
      // });

      console.log(this.manager);
      console.log(kf);

      this.manager.connectToDevice('41E51E25-81D7-C321-2390-6B4FBDC3EDF6')
        .then((data) => {
          console.log('Current data: ' + data);
          this.manager.readRSSIForDevice('41E51E25-81D7-C321-2390-6B4FBDC3EDF6')
            .then((rssi) => {
              console.log('current rssi' + rssi.rssi);              
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        })
  }

  componentWillMount() {
    const instructions = "click to capture QR oode"
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar 
          barStyle="light-content"
          backgroundColor="#4F6D7A" />
        <Header></Header>
        <View style={styles.container}>
          <Rssi rssi={this.state} />
          <Button title={instructions} onPress={this.connectToPeripheral} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
