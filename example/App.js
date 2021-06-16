/**
 * Sample React Native Calendar Strip
 * https://github.com/BugiDev/react-native-calendar-strip
 * @flow
 */

import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import CalendarStrip from './CalendarStrip/CalendarStrip';
import moment from 'moment';

export default class App extends Component<{}> {
  constructor(props) {
    super(props);

    let startDate = moment(); // today

    // Create a week's worth of custom date styles and marked dates.
    let customDatesStyles = [];
    let markedDates = [];
    for (let i=0; i<7; i++) {
      let date = startDate.clone().add(i, 'days');

      customDatesStyles.push({
        startDate: date, // Single date since no endDate provided
        dateNameStyle: {color: 'blue'},
        dateNumberStyle: {color: 'purple'},
        highlightDateNameStyle: {color: 'pink'},
        highlightDateNumberStyle: {color: 'yellow'},
        // Random color...
        dateContainerStyle: { backgroundColor: `#${(`#00000${(Math.random() * (1 << 24) | 0).toString(16)}`).slice(-6)}` },
      });

      let dots = [];
      let lines = [];

      if (i % 2) {
        lines.push({
          color: 'cyan',
          selectedColor: 'orange',
        });
      }
      else {
        dots.push({
          color: 'red',
          selectedColor: 'yellow',
        });
      }
      markedDates.push({
        date,
        dots,
        lines
      });
    }

    this.state = {
      selectedDate: undefined,
      customDatesStyles,
      markedDates,
      startDate,
    };
  }

  datesBlacklistFunc = date => {
    return date.isoWeekday() === 6; // disable Saturdays
  }

  onDateSelected = selectedDate => {
    this.setState({ selectedDate });
    this.setState({ formattedDate: selectedDate.format('YYYY-MM-DD')});
  }

  setSelectedDateNextWeek = date => {
    const selectedDate = moment(this.state.selectedDate).add(1, 'week');
    const formattedDate = selectedDate.format('YYYY-MM-DD');
    this.setState({ selectedDate, formattedDate });
  }

  setSelectedDatePrevWeek = date => {
    const selectedDate = moment(this.state.selectedDate).subtract(1, 'week');
    const formattedDate = selectedDate.format('YYYY-MM-DD');
    this.setState({ selectedDate, formattedDate });
  }

  render() {
    return (
      <View>
        <CalendarStrip
          scrollable
          calendarAnimation={{type: 'sequence', duration: 30}}
          daySelectionAnimation={{type: 'background', duration: 300, highlightColor: '#9265DC'}}
          style={{height:200, paddingTop: 20, paddingBottom: 10}}
          calendarHeaderStyle={{color: 'white'}}
          calendarColor={'#3343CE'}
          dateNumberStyle={{color: 'white'}}
          dateNameStyle={{color: 'white'}}
          iconContainer={{flex: 0.1}}
          customDatesStyles={this.state.customDatesStyles}
          highlightDateNameStyle={{color: 'white'}}
          highlightDateNumberStyle={{color: 'yellow'}}
          highlightDateContainerStyle={{backgroundColor: 'black'}}
          markedDates={this.state.markedDates}
          datesBlacklist={this.datesBlacklistFunc}
          selectedDate={this.state.selectedDate}
          onDateSelected={this.onDateSelected}
          useIsoWeekday={false}
        />

        <Text style={{fontSize: 24}}>Selected Date: {this.state.formattedDate}</Text>

        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', padding: 40}}>
          <Button
            onPress={this.setSelectedDatePrevWeek}
            title="Select previous week"
            color="#841584"
          />
          <Button
            onPress={this.setSelectedDateNextWeek}
            title="Select next week"
            color="#841584"
          />
        </View>
      </View>
    );
  }
}
