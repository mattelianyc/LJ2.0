import React from 'react';
import { 
	View, 
	Text,
	Button,
} from 'react-native';

export default class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button
          title="Scan QR Code To Connect"
          onPress={() => this.props.navigation.navigate('QR')}
        />
      </View>
    );
  }
}
