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
      rssi_threshold: null,
    };
    this._setRSSIThreshold = this._setRSSIThreshold.bind(this);
    this._getRSSIThreshold = this._getRSSIThreshold.bind(this);
  }

  componentWillMount() {
    this._getRSSIThreshold();
  }

  _getRSSIThreshold() {
    AsyncStorage.getItem('rssi_threshold')
      .then((data) => {
        if(data) {
          this.setState({ rssi_threshold: data });
        } else {
          this.setState({ rssi_threshold: -88 });
        }
      });
  }
  
  _setRSSIThreshold(e) {
    AsyncStorage.setItem('rssi_threshold', ""+Math.round(e)+"");
    this.setState({rssi_threshold: Math.round(e)});
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>RSSI Threshold: {this.state.rssi_threshold}</Text>
        <Slider 
          value={this._getRSSIThreshold} 
          stepValue={1} 
          minimumValue={-110}
          maximumValue={-70}
          onSlideComplete={this._setRSSIThreshold} 
          onValueChange={this._setRSSIThreshold} 
          style={{ width: 300, color: 'indianred' }} />
      </View>
    );
  }
}
