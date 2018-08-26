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
  Button
} from 'react-native';

import { BleManager } from 'react-native-ble-plx';
import KalmanFilter from 'kalmanjs';

import RNCamera from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';


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
        if (state === 'PoweredOn') {
            // this.scanAndConnect();
            subscription.remove();
        }
    }, true);
  }

  openQrScanner() {
    // console.log(RNCamera);
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar 
          barStyle="dark-content"
          backgroundColor="#4F6D7A" />
        <Text style={styles.welcome}>LighterJack v2.0</Text>
        <Button title={instructions} onPress={this.openQrScanner}/>
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
