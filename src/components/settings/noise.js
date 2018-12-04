import React from 'react';
import { 
	View, 
	Text,
  Button,
  Slider,
  AsyncStorage,
} from 'react-native';

export default class Noise extends React.Component {

  constructor() {
    super();
    this.state = {
      internal_noise: null,
      external_noise: null,
    };
    this.setInternalNoiseParam = this.setInternalNoiseParam.bind(this);
    this.setExternalNoiseParam = this.setExternalNoiseParam.bind(this);
    this.getInternalNoiseParam = this.getInternalNoiseParam.bind(this);
    this.getExternalNoiseParam = this.getExternalNoiseParam.bind(this);
  }

  componentWillMount() {
    this.getInternalNoiseParam();
    this.getExternalNoiseParam();
  }

  getInternalNoiseParam() {
    AsyncStorage.getItem('internal_noise')
      .then((data) => {
        if(data) {
          this.setState({ 'internal_noise': data });
        } else {
          return;
        }
      });
  }

  setInternalNoiseParam(e) {
    AsyncStorage.setItem('internal_noise', ""+Number(parseFloat(e).toFixed(2))+"");
    this.setState({internal_noise: Number(parseFloat(e).toFixed(2))});
  }

  getExternalNoiseParam() {
    AsyncStorage.getItem('external_noise')
      .then((data) => {
        if(data) {
          this.setState({ 'external_noise': data });
        } else {
          return;
        }
      });
  }
  
  setExternalNoiseParam(e) {
    AsyncStorage.setItem('external_noise', ""+Number(parseFloat(e).toFixed(2))+"");
    this.setState({external_noise: Number(parseFloat(e).toFixed(2))});
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

        <Text>Internal Noise: {this.state.internal_noise}</Text>
        <Slider 
          value={this.state.internal_noise} 
          stepValue={0.01} 
          minimumValue={0.01}
          maximumValue={0.99}
          onSlideComplete={this.setInternalNoiseParam} 
          onValueChange={this.setInternalNoiseParam} 
          style={{ width: 300, color: 'indianred' }} />

        <Text>External Noise: {this.state.external_noise}</Text>
        <Slider 
          value={this.state.external_noise} 
          stepValue={0.1} 
          minimumValue={0.1}
          maximumValue={1}
          onSlideComplete={this.setExternalNoiseParam} 
          onValueChange={this.setExternalNoiseParam} 
          style={{ width: 300, color: 'indianred' }} />

      </View>
    );
  }
}
