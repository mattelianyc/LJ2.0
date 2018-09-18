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
  AsyncStorage,
  Alert,
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
          setInterval(() => {
            this.manager.readRSSIForDevice('41E51E25-81D7-C321-2390-6B4FBDC3EDF6')
              .then((data) => {
                console.log('current rssi' + data.rssi);              
                console.log('filtered rssi' + kf.filter(data.rssi));              

                if (kf.filter(data.rssi) < -100) {
                  Alert.alert(
                    'LighterJack',
                    'Get your lighter back.',
                    [
                      {text: 'OK', onPress: () => console.log('OK Pressed')},
                    ],
                    { cancelable: false }
                  )
                }
                
              })
              .catch((error) => {
                console.log(error);
              });
          }, 3000);
        })
        .catch((error) => {
          console.log(error);
        })
  }

  componentWillMount() {
    const instructions = "click to capture QR oode"
  }

  componentDidMount() {

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
