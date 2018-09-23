import React from 'react';
import { 
	View, 
	Text,
	Button,
  Image,
  TouchableOpacity,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

export default class IdleScreen extends React.Component {
  
  static navigationOptions = {
    headerTitle: (
      <Image style={{ width: 300, height: 39 }} source={require('../../assets/images/HeaderLJ.png')}/>
    )
  };
  
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('QR')}>
          <Ionicons name={'ios-barcode'} size={169} color={'indianred'} />
        </TouchableOpacity>
      </View>
    );
  }
}

// const styles = StyleSheet.create({
//   scanQRButton: {
//     backgroundColor: 'crimson',
//   }
// });
