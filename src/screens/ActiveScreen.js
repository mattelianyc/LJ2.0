import React from 'react';
import { 
  View,
	ScrollView, 
	Text,
	Button,
  Image,
} from 'react-native';

import Rssi from '../components/rssi';

export default class ActiveScreen extends React.Component {
  static navigationOptions = {
    headerTitle: (
      <Image style={{ width: 300, height: 39 }} source={require('../../assets/images/HeaderLJ.png')}/>
    )
  };
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ScrollView>
          <Rssi />
        </ScrollView>
      </View>
    );
  }
}
