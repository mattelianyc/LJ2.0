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
    this.prefixUUID = "41E51E25";
    this.suffixUUID = "-81D7-C321-2390-6B4FBDC3EDF6";
    // this.sensors = {
    //   0: "Temperature",
    //   1: "Accelerometer",
    //   2: "Humidity",
    //   3: "Magnetometer",
    //   4: "Barometer",
    //   5: "Gyroscope"
    // }
  }
  
  serviceUUID(num) {
    return this.prefixUUID + num + "0" + this.suffixUUID;
  }

  notifyUUID(num) {
    return this.prefixUUID + num + "1" + this.suffixUUID;
  }

  writeUUID(num) {
    return this.prefixUUID + num + "2" + this.suffixUUID;
  }
 
  info(message) {
    this.setState({info: message});
  }

  error(message) {
    this.setState({info: "ERROR: " + message});
  }

  updateValue(key, value) {
    this.setState({values: {...this.state.values, [key]: value}});
  }

  scanAndConnect() {
		let concatenatedTerminalArray = this.state.terminal.concat('initializing');
		this.setState({ terminal: concatenatedTerminalArray });
	  this.manager.startDeviceScan(null, null, (error, device) => {

    		if (error) {
	        this.error(error.message)
	  			let concatenatedTerminalArray= this.state.terminal.concat('ERR!'+error.message);
	  			this.setState({ terminal: concatenatedTerminalArray });
	        return
	      }
        // if (device.id === '28C6CF39-F17B-4822-69A6-4FE9E54D1D92' || device.name === 'Magic_Mushr') {  
	      if (device.id === '41E51E25-81D7-C321-2390-6B4FBDC3EDF6' || device.name === 'Magic_Mushr') {	
	  			let concatenatedTerminalArray = this.state.terminal.concat('peripheral discovered');
	  			this.setState({ terminal: concatenatedTerminalArray });
	        this.manager.stopDeviceScan();
	  			concatenatedTerminalArray = this.state.terminal.concat('connecting');
	  			this.setState({ terminal: concatenatedTerminalArray });
	        
	        device.connect()
	          .then((device) => {  
              device.onDisconnected(function (error, disconnectedDevice) {
                this.notif = new NotificationService();
                this.notif.localNotif();
                console.log(error);
                console.log(disconnectedDevice.name);
              });
              let concatenatedTerminalArray = this.state.terminal.concat('discovering services and characteristics');
              this.setState({ terminal: concatenatedTerminalArray });
              return device.discoverAllServicesAndCharacteristics()
            })
            .then((device) => {
              let concatenatedTerminalArray = this.state.terminal.concat('setting notifications');
              this.setState({ terminal: concatenatedTerminalArray });
              return this.setupNotifications(device)
            })
            .then(() => {
	          	let concatenatedTerminalArray= this.state.terminal.concat('reading rssi');
	  					this.setState({ terminal: concatenatedTerminalArray });
	          	concatenatedTerminalArray = this.state.terminal.concat('filtering rssi...');
	  					this.setState({ loading: false });
	  					this.setState({ terminal: concatenatedTerminalArray });

              // this.manager.monitorCharacteristicForDevice(device.id, '1803', '2A06', function (data) {
              //   console.log(data);
              // });

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
	          }, (error) => {
	            this.error(error.message)
	          	let concatenatedTerminalArray= this.state.terminal.concat('error'+error.message);
	  					this.setState({ terminal: concatenatedTerminalArray });
	          })
	      }	
      
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(this.state.alert);
    if(prevState.rssi >= -94 && this.state.rssi < -94) {
      console.log(this.state.alert);
      this.notif = new NotificationService();
      this.notif.localNotif();
    }
  }

  async setupNotifications(device) {

    for (const id in this.sensors) {
      const service = this.serviceUUID(id)
      const characteristicW = this.writeUUID(id)
      const characteristicN = this.notifyUUID(id)
      const characteristic = await device.writeCharacteristicWithResponseForService(
        service, characteristicW, "AQ==" /* 0x01 in hex */
      )
      device.monitorCharacteristicForService(service, characteristicN, (error, characteristic) => {
        console.log(characteristic);
        if (error) {
          this.error(error.message)
          return
        }
        this.updateValue(characteristic.uuid, characteristic.value)
      })
    }
  }

 	componentWillMount() {
		if (Platform.OS === 'ios') {
			this.manager.onStateChange((state) => {
	    	if (state === 'PoweredOn') this.scanAndConnect();
  		})
		} else {
			this.scanAndConnect()
		}
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