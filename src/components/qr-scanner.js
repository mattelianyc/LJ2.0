import React, {Component} from 'react';

import {
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';

import RNCamera from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';

type Props = {};

export default class QRScanner extends Component<Props> {

  constructor() {
    super();

  }

  componentWillMount() {
    this.setState({ uuid: null });
  }

  onSuccess(e) {
    this.setState({ uuid: e.data });
    this.props.navigate('Home', { uuid: e.data });
  }

  render() {
    return (
      <QRCodeScanner
        onRead={this.onSuccess.bind(this)}
      />
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});