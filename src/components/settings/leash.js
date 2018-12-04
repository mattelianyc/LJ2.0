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
    this.setRSSIThreshold = this.setRSSIThreshold.bind(this);
    this.getRSSIThreshold = this.getRSSIThreshold.bind(this);
  }

  componentWillMount() {
    this.getRSSIThreshold();
  }

  getRSSIThreshold() {
    AsyncStorage.getItem('rssi_threshold')
      .then((data) => {
        if(data) {
          this.setState({ rssi_threshold: data });
        } else {
          this.setState({ rssi_threshold: -88 });
        }
      });
  }
  
  setRSSIThreshold(e) {
    AsyncStorage.setItem('rssi_threshold', ""+Math.round(e)+"");
    this.setState({rssi_threshold: Math.round(e)});
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>RSSI Threshold: {this.state.rssi_threshold}</Text>
        <Slider 
          value={this.state.rssi_threshold} 
          stepValue={1} 
          minimumValue={-110}
          maximumValue={-70}
          onSlideComplete={this.setRSSIThreshold} 
          onValueChange={this.setRSSIThreshold} 
          style={{ width: 300, color: 'indianred' }} />
      </View>
    );
  }
}
