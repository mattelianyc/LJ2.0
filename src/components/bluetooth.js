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
      rssi_threshold: null,
      alert: false,
    };
    // VIBRATION
    this.duration = 10000;
    this.pattern = [1000, 2000, 3000];
    // BLUETOOTH
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
    this._getRSSIThreshold().then((data) => {
      console.log(data);
      if (data) {
        this.setState({ rssi_threshold: data });
      } else {
        this.setState({ rssi_threshold: -94 });
      }
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevState.rssi >= this.state.rssi_threshold && this.state.rssi < this.state.rssi_threshold) {
      this.notif = new NotificationService();
      this.notif.localNotif();
    }
  }

  connectToPeripheral() {
    // GET UUID
    this._getUUID().then((data) => {
      
      let device_uuid = data;

      // STATUS BOX
      let concatenatedTerminalArray = this.state.terminal.concat('initializing');
      this.setState({ terminal: concatenatedTerminalArray });
      concatenatedTerminalArray = this.state.terminal.concat('peripheral discovered');
      this.setState({ terminal: concatenatedTerminalArray });
      concatenatedTerminalArray = this.state.terminal.concat('connecting');
      this.setState({ terminal: concatenatedTerminalArray });
      
      // CONNECT 
      this.manager.connectToDevice(device_uuid)
        .then((device) => {  

          device.onDisconnected((error, disconnectedDevice) => {
            this.notif = new NotificationService();
            this.notif.localNotif();
          });

          // STATUS BOX
          concatenatedTerminalArray = this.state.terminal.concat('discovering services and characteristics');
          this.setState({ terminal: concatenatedTerminalArray });
          concatenatedTerminalArray = this.state.terminal.concat('setting notifications');
          this.setState({ terminal: concatenatedTerminalArray });
        	concatenatedTerminalArray= this.state.terminal.concat('reading rssi');
  				this.setState({ terminal: concatenatedTerminalArray });
        	concatenatedTerminalArray = this.state.terminal.concat('filtering rssi...');
          this.setState({ terminal: concatenatedTerminalArray });

          this.setState({ loading: false });

          // BG RSSI THREAD
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
        
    });
  }	

  async _getUUID() {
    let value = await AsyncStorage.getItem('device_uuid');
    return value;
  }

  async _getRSSIThreshold() {
    let value = await AsyncStorage.getItem('rssi_threshold');
    return value;
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
				{this.state.loading ? null : <Text style={styles.terminalTextSuccess}>{this.state.rssi}</Text>}
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