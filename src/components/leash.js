import React from 'react';
import { 
	View, 
	Text,
  Button,
  Slider,
  AsyncStorage,
} from 'react-native';

export default class Leash extends React.Component {

  constructor() {
    super();
    this.state = {
      rssi_threshold: 
    }
  }

  _getRSSIThreshold() {
    console.log('get');
    AsyncStorage.getItem('rssi_threshold')
      .then((data) => {
        console.log('get: '+data);
        if(data) {
          this.setState({rssi_threshold: data});
        } else {
          return
        }
      });
  }
  
  _setRSSIThreshold(e) {
    console.log('set: '+e);
    AsyncStorage.setItem('rssi_threshold', ''+e+'');
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Leash: {this.state.rssi_threshold}</Text>
        <Slider 
          value={this._getRSSIThreshold} 
          stepValue={1} 
          minimumValue={-110}
          maximumValue={-70}
          onSlideComplete={this._setRSSIThreshold} 
          onValueChange={this._setRSSIThreshold} 
          style={{ width: 300, color: 'black' }} />
      </View>
    );
  }
}
