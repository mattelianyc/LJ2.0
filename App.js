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

import { BleManager } from 'react-native-ble-plx';
import KalmanFilter from 'kalmanjs';

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
      
      // async storage
      var storedValue = AsyncStorage.setItem('asdfa', '23514');
      console.log(storedValue);
      
      // ble manager
      this.manager = new BleManager();
      console.log(this.manager);
      
      // kalman filter
      const kf = new KalmanFilter();
      console.log(kf);
  }

  componentWillMount() {
    const instructions = "click to capture QR oode"
    // BLE Background Manager
    this.manager = new BleManager({
        restoreStateIdentifier: 'testBleBackgroundMode',
        restoreStateFunction: bleRestoredState => {
          console.log(bleRestoredState);
        }
    });
    const subscription = this.manager.onStateChange((state) => {
        console.log(state);
        if (state === 'PoweredOn') {
            console.log('before');
            this.manager.startDeviceScan(['00000000-0000-1000-8000-00805F9B34FB']);
            console.log('after');
            subscription.remove();
        }
    }, true);
  }

  openQrScanner() {
    console.log(BleManager);

  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar 
          barStyle="light-content"
          backgroundColor="#4F6D7A" />
        <Header />
        <View style={styles.container}>
          <Button title={instructions} onPress={this.openQrScanner}/>
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
