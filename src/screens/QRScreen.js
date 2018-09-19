import React from 'react';
import { 
	View, 
	Text,
	Button,	
} from 'react-native';

import QrScanner from '../components/qr-scanner';

export default class QRScreen extends React.Component {
  render() {
    return (
      <QrScanner />
    );
  }
}
