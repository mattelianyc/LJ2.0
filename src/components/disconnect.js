import React from 'react';
import { 
	View, 
	Text,
  Button,
  AsyncStorage,
} from 'react-native';

export default class Disconnect extends React.Component {

  constructor() {
    super();
  }

  disconnectAndFlushAsync() {
    console.log('disconnect and flush async btn pressed');
    AsyncStorage.setItem('device_uuid', null);
    this.props.navigate('Home');
  }
  
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button 
          title={'disconnect and flush async'}
          onPress={() => {this.disconnectAndFlushAsync}} />
      </View>
    );
  }
}
