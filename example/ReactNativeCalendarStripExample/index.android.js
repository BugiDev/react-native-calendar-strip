/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    View
} from 'react-native';

import CalendarStrip from 'react-native-calendar-strip';

class ReactNativeCalendarStrip extends Component {
  render() {
    return (
        <View>
          <CalendarStrip
              calendarAnimation={{type: 'sequence', duration: 30}}
              daySelectionAnimation={{type: 'border', duration: 300, borderWidth: 2, borderHighlightColor: 'white'}}
              style={{paddingTop: 20, paddingBottom: 10}}
              calendarHeaderStyle={{color: 'white'}}
              calendarColor={'#7743CE'}
              dateNumberStyle={{color: 'white'}}
              dateNameStyle={{color: 'white'}}
              iconLeft={require('./img/left-arrow.png')}
              iconRight={require('./img/right-arrow.png')}
              iconContainer={{flex: 0.1}}
          />
        </View>
    );
  }
}

AppRegistry.registerComponent('ReactNativeCalendarStripExample', () => ReactNativeCalendarStrip);