import React from 'react';
import { 
	View, 
	Text,
	Button,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Bluetooth from '../components/bluetooth';

export default class HomeScreen extends React.Component {
  
  constructor() {
    super();
    console.log(this.props);  
  }

  static navigationOptions = {
    headerTitle: (
      <Image style={{ width: 300, height: 39 }} source={require('../../assets/images/HeaderLJ.png')}/>
    )
  };

  render() {
    const device_uuid = this.props.navigation.state.params;

    if(device_uuid) {
      return (
        <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Bluetooth />
        </ScrollView>
      )
    } else {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('QR')}>
            <Ionicons name={'ios-barcode'} size={169} color={'indianred'} />
          </TouchableOpacity>
        </View>
      );
    }

  }
}
