import React, {Component} from 'react';

import {
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';


type Props = {};

export default class Rssi extends Component<Props> {

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
    // const displayText = "LJv2.0"
  }

  render() {
    return (
      <View style={styles.header}>
        <Text title={displayText} style={styles.displayText}> {displayText} </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'black',
    width: '100%',
    padding: 10,
    paddingTop: 25,
    alignItems: 'center'
  },
  displayText: {
    color: 'white',
    fontSize: 24,
  }
});