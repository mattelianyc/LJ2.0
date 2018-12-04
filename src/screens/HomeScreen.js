import React from 'react';
import { 
	View, 
	Text,
	Button,
  Image,
  TouchableOpacity,
  ScrollView,
  AsyncStorage,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Bluetooth from '../components/bluetooth';

export default class HomeScreen extends React.Component {
  
  static navigationOptions = {
    headerTitle: (
      <Image style={{ width: 300, height: 39 }} source={require('../../assets/images/HeaderLJ.png')}/>
    )
  };

  constructor() {
    super();
    this.state = {
      has_uuid: false
    }
    this.getUUID();
  }

  componentDidMount() {
    console.log(this.props.navigation);
  }

  componentWillReceiveProps(nextProps) {
    console.log('this shit works')
    console.log(this.props);
    console.log(nextProps);
  }

  getUUID() {
    AsyncStorage.getItem('device_uuid')
      .then((data) => {
        if(data) {
          this.setState({has_uuid: true});
        } else {
          this.setState({has_uuid: false});
        }
      });
  }

  render() {
    
    if(this.state.has_uuid || this.props.navigation.state.params) {
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
