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
        <Button
          title="Go to Details"
          onPress={() => this.props.navigation.navigate('Details')}
        />
      </View>
    );
  }
}
