import React from 'react';
import { 
	View, 
	Text,
	Button,
} from 'react-native';

import Rssi from '../components/rssi';

export default class ActiveScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Rssi />
      </View>
    );
  }
}
