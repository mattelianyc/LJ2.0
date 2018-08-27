import React, {Component} from 'react';

import {
  StyleSheet,
  Text,
  View,
  Platform
} from 'react-native';


const displayText = Platform.select({
  ios: 'LJv2.0 - iOS',
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
    // const displayText = "LJv2.0"
  }

  render() {
    return (
      <View style={styles.header}>
        <Text title={displayText} style={styles.displayText}> {displayText} </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'black',
    width: '100%',
    padding: 10,
    paddingTop: 25,
    alignItems: 'center'
  },
  displayText: {
    color: 'white',
    fontSize: 24,
  }
});