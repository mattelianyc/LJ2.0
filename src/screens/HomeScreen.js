import React from 'react';
import { 
	View, 
	Text,
	Button,
} from 'react-native';

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home!</Text>
        <Button
          title="Go to Qr"
          onPress={() => this.props.navigation.navigate('QR')}
        />
      </View>
    );
  }
}

export default HomeScreen;
