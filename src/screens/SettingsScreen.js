import React from 'react';
import { 
	View, 
	Text,
	Button,
} from 'react-native';

export default class SettingsScreen extends React.Component {
  render() {
    return (
         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings!</Text>
        <Button
          title="Go to Home"
          onPress={() => this.props.navigation.navigate('Home')}
        />
        <Button
          title="Go to Details"
          onPress={() => this.props.navigation.navigate('Details')}
        />
      </View>
    );
  }
}
