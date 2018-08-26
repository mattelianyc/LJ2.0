import React, {Component} from 'react';

import {
  StyleSheet,
  Text,
  View,
  Platform
} from 'react-native';


const displayText = Platform.select({
  ios: 'this is the header - iOS',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


type Props = {};

export default class Header extends Component<Props> {

  constructor() {
      super();
  }

  componentWillMount() {
    const displayText = "second screen"
  }

  render() {
    return (
      <View style={styles.container}>
        <Text title={displayText} style={styles.displayText}> {displayText} </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  displayText: {
    color: 'black',
  }
});