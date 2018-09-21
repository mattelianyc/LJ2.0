import React from 'react';
import { 
	View, 
	Text,
	Button,	
	Image,
} from 'react-native';

import QrScanner from '../components/qr-scanner';

export default class QRScreen extends React.Component {
	
	static navigationOptions = {
    headerTitle: (
    	<Image style={{ width: 300, height: 39 }} source={require('../../assets/images/HeaderLJ.png')}/>
    )
  };

  render() {
  	const { navigate } = this.props.navigation;
    return (
      <QrScanner navigate={ navigate } />
    );
  }
}
