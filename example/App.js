/**
 * Sample React Native Calendar Strip
 * https://github.com/BugiDev/react-native-calendar-strip
 * @flow
 */

import React, { Component } from 'react';
import CalendarStrip from './CalendarStrip/CalendarStrip';
import moment from 'moment';

export default class App extends Component<{}> {
  render() {
    let customDatesStyles = [];
    let markedDates = [];
    let startDate = moment();
    for (let i=0; i<6; i++) {
      let _date = startDate.clone().add(i, 'days');
      customDatesStyles.push({
        startDate: _date, // Single date since no endDate provided
        dateNameStyle: {color: 'blue'},
        dateNumberStyle: {color: 'purple'},
        // Random color...
        dateContainerStyle: { backgroundColor: `#${(`#00000${(Math.random() * (1 << 24) | 0).toString(16)}`).slice(-6)}` },
      });
      markedDates.push({
        date: _date,
        dots: [
          {
            key: i,
            color: 'red',
            selectedDotColor: 'yellow',
          },
        ],
      });
    }

    return (
      <CalendarStrip
        calendarAnimation={{type: 'sequence', duration: 30}}
        daySelectionAnimation={{type: 'background', duration: 300, highlightColor: '#9265DC'}}
        style={{height:200, paddingTop: 20, paddingBottom: 10}}
        calendarHeaderStyle={{color: 'white'}}
        calendarColor={'#7743CE'}
        dateNumberStyle={{color: 'white'}}
        dateNameStyle={{color: 'white'}}
        iconContainer={{flex: 0.1}}
        customDatesStyles={customDatesStyles}
        markedDates={markedDates}
      />
    );
  }
}
