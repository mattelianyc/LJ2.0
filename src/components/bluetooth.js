import React, {Component} from 'react';

import {
  StyleSheet,
  Text,
  View,
  Alert,
  Platform,
  Vibration,
  PushNotificationIOS,
  NativeAppEventEmitter,
  AsyncStorage,
} from 'react-native';

import { BleManager } from 'react-native-ble-plx';
import KalmanFilter from 'kalmanjs';

import NotificationService from '../services/NotificationService';
import BackgroundTimer from 'react-native-background-timer';

export default class Bluetooth extends Component<Props> {

  constructor() {
    super();

    this.state = {
    	info: "",
    	values: {},
    	loading: true,
    	terminal: [],
    	rssi: null,
      alert: false,
    };

    this.duration = 10000;
    this.pattern = [1000, 2000, 3000];

    this.kf = new KalmanFilter({ R: 0.01, Q: 1.0 });
    this.manager = new BleManager();
    

  }

  componentWillMount() {
    

    if (Platform.OS === 'ios') {
      this.manager.onStateChange((state) => {
        if (state === 'PoweredOn') this.connectToPeripheral();
      })
    } else {
      this.connectToPeripheral()
    }
  }

  componentDidMount() {
    // do shit.
    // AsyncStorage.getKey('')
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(this.state.alert);
    if(prevState.rssi >= -94 && this.state.rssi < -94) {
      console.log(this.state.alert);
      this.notif = new NotificationService();
      this.notif.localNotif();
    }
  }

  // SCAN
  connectToPeripheral() {
    this._getStorageValue().then((data) => {
      
      let device_uuid = data;
      console.log(device_uuid);

      let concatenatedTerminalArray = this.state.terminal.concat('initializing');
      this.setState({ terminal: concatenatedTerminalArray });
      concatenatedTerminalArray = this.state.terminal.concat('peripheral discovered');
      this.setState({ terminal: concatenatedTerminalArray });
      concatenatedTerminalArray = this.state.terminal.concat('connecting');
      this.setState({ terminal: concatenatedTerminalArray });
      
      // CONNECT 
      this.manager.connectToDevice(device_uuid)
        .then((device) => {  

          device.onDisconnected(function (error, disconnectedDevice) {
            this.notif = new NotificationService();
            this.notif.localNotif();
            console.log(error);
            console.log(disconnectedDevice.name);
          });

          concatenatedTerminalArray = this.state.terminal.concat('discovering services and characteristics');
          this.setState({ terminal: concatenatedTerminalArray });
          concatenatedTerminalArray = this.state.terminal.concat('setting notifications');
          this.setState({ terminal: concatenatedTerminalArray });
        	concatenatedTerminalArray= this.state.terminal.concat('reading rssi');
  				this.setState({ terminal: concatenatedTerminalArray });
        	concatenatedTerminalArray = this.state.terminal.concat('filtering rssi...');
  				this.setState({ loading: false });
  				this.setState({ terminal: concatenatedTerminalArray });

          BackgroundTimer.runBackgroundTimer(() => { 
        		this.manager.readRSSIForDevice(device.id)
        			.then((data) => {

        				this.setState({ 
                  rssi: parseFloat(this.kf.filter(data.rssi).toFixed(5)),
                  alert: false, 
                });

                if( this.kf.filter(data.rssi) < -94 ) {
                  this.setState({ alert: true });
                  Vibration.vibrate(this.duration);
                }

        			});
          }, 1500);

        });
      return;
    });
  }	

  async _getStorageValue() {
    var value = await AsyncStorage.getItem('device_uuid');
    return value
  }

  render() {
    return (
       <View style={styles.terminal}>
        {Object.keys(this.state.terminal).map((key) => {
          return (
          	 <Text key={key} style={styles.terminalText}>
               {this.state.terminal[key]}
             </Text>
            );
        	})
      	}
				{this.state.loading ? null : <Text style={styles.terminalTextSuccess}>{this.state.rssi}</Text> }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  terminal: {
  	flex: 1,
  	margin: 10,
    width: 300,
  },
  terminalText: {
  	fontFamily: 'Courier',
  	textAlign: 'left',
  },
  terminalTextSuccess: {
  	fontFamily: 'Courier',
  	color: 'indianred',
  	fontWeight: 'bold',
  	fontSize: 22
  }
});