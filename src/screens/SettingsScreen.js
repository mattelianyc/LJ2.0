import React from 'react';
import { 
	View, 
	Text,
  Button,
	Image,
  Slider,
} from 'react-native';

import Leash from '../components/settings/leash';
import Noise from '../components/settings/noise';
import Disconnect from '../components/settings/disconnect';

export default class SettingsScreen extends React.Component {

  static navigationOptions = {
    headerTitle: (
      <Image style={{ width: 300, height: 39 }} source={require('../../assets/images/HeaderLJ.png')}/>
    )
  };

  constructor() {
    super();
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        
        <Leash />

        <Noise />

        <Disconnect navigate={ navigate } />

        <Button
          title="Go to Details"
          onPress={() => this.props.navigation.navigate('Details')}
        />
        
      </View>
    );
  }
}
