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
    console.log('tittymeat');
  }

  _getRSSIThreshold() {
    console.log('get');
    AsyncStorage.getItem('device_uuid')
      .then((data) => {
        console.log(data);
      });
  }
  
  _setRSSIThreshold(e) {
    console.log(e);
    AsyncStorage.setItem('rssi_threshold', ''+e+'');
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Leash: </Text>
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
