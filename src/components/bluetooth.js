import React, {Component} from 'react';

import {
  StyleSheet,
  Text,
  View,
  Alert,
  Platform,
  PushNotificationIOS,
} from 'react-native';

import { BleManager } from 'react-native-ble-plx';
import KalmanFilter from 'kalmanjs';

import NotificationService from '../services/NotificationService';
import BackgroundService from '../services/BackgroundService';

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
    
    this.kf = new KalmanFilter({ R: 0.01, Q: 1.0 });
    this.manager = new BleManager();
    this.notif = new NotificationService();
    this.bg = new BackgroundService();
    this.bg.ready();
    console.log(this.bg);
    this.notif.configure();


    this.prefixUUID = "41E51E25";
    this.suffixUUID = "-81D7-C321-2390-6B4FBDC3EDF6";
    this.sensors = {
      // add sensors here
    } 
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
		let concatenatedTerminalArray = this.state.terminal.concat('initializing...');
		this.setState({ terminal: concatenatedTerminalArray });
	  this.manager.startDeviceScan(null, null, (error, device) => {

    		if (error) {
	        this.error(error.message)
	  			let concatenatedTerminalArray= this.state.terminal.concat('ERR!'+error.message);
	  			this.setState({ terminal: concatenatedTerminalArray });
	        return
	      }
	      if (device.id === '28C6CF39-F17B-4822-69A6-4FE9E54D1D92' || device.name === 'Nordic_Prox') {	
	  			let concatenatedTerminalArray = this.state.terminal.concat('peripheral discovered');
	  			this.setState({ terminal: concatenatedTerminalArray });
	        this.manager.stopDeviceScan();
	  			concatenatedTerminalArray = this.state.terminal.concat('connecting...');
	  			this.setState({ terminal: concatenatedTerminalArray });
	        
	        device.connect()
	          .then((device) => {
              console.log(device);
              let concatenatedTerminalArray = this.state.terminal.concat('discovering services and characteristics');
              this.setState({ terminal: concatenatedTerminalArray });
              return device.discoverAllServicesAndCharacteristics()
            })
            .then((device) => {
              console.log(device);
	          	let concatenatedTerminalArray= this.state.terminal.concat('setting notifications');
	  					this.setState({ terminal: concatenatedTerminalArray });
            	return this.setupNotifications(device)
	          })
	          .then(() => {
	          	let concatenatedTerminalArray= this.state.terminal.concat('reading rssi...');
	  					this.setState({ terminal: concatenatedTerminalArray });
	          	concatenatedTerminalArray = this.state.terminal.concat('filtering rssi...');
	  					this.setState({ loading: false });
	  					this.setState({ terminal: concatenatedTerminalArray });
              this.bg.start();
	            setInterval(() => {
	          		this.manager.readRSSIForDevice(device.id)
	          			.then((data) => {

	          				this.setState({ 
                      rssi: parseFloat(this.kf.filter(data.rssi).toFixed(5)),
                      alert: false, 
                    });
                    
                    if( this.kf.filter(data.rssi) < -88 ) {
                      this.setState({ alert: true });
                    }

	          			});
	            }, 1669);
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
    if(prevState.rssi >= -88 && this.state.rssi < -88) {
      console.log(this.state.alert);
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