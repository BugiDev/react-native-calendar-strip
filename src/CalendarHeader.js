import { Image, Text, TouchableOpacity, View } from "react-native";
import React, { Component } from "react";

import PropTypes from "prop-types";
import styles from "./Calendar.style.js";

class CalendarHeader extends Component {
  static propTypes = {
    calendarHeaderFormat: PropTypes.string.isRequired,
    calendarHeaderContainerStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number
    ]),
    calendarHeaderStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number
    ]),
    datesForWeek: PropTypes.array.isRequired,
    allowHeaderTextScaling: PropTypes.bool,
    displayCalendarIcon: PropTypes.bool,
    onCalendarDateSelected: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.onCalendarDateSelected = this.onCalendarDateSelected.bind(this);
  }

  // Open Calendar
  onCalendarDateSelected() {
    this.props.onCalendarDateSelected && this.props.onCalendarDateSelected();
  }

  shouldComponentUpdate(nextProps) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps);
  }

  //Function that formats the calendar header
  //It also formats the month section if the week is in between months
  formatCalendarHeader(datesForWeek, calendarHeaderFormat) {
    if (!datesForWeek || datesForWeek.length === 0) {
      return "";
    }

    let firstDay = datesForWeek[0];
    let lastDay = datesForWeek[datesForWeek.length - 1];
    let monthFormatting = "";
    //Parsing the month part of the user defined formating
    if ((calendarHeaderFormat.match(/Mo/g) || []).length > 0) {
      monthFormatting = "Mo";
    } else {
      if ((calendarHeaderFormat.match(/M/g) || []).length > 0) {
        for (
          let i = (calendarHeaderFormat.match(/M/g) || []).length;
          i > 0;
          i--
        ) {
          monthFormatting += "M";
        }
      }
    }

    if (firstDay.month() === lastDay.month()) {
      return firstDay.format(calendarHeaderFormat);
    } else if (firstDay.year() !== lastDay.year()) {
      return `${firstDay.format(calendarHeaderFormat)} / ${lastDay.format(
        calendarHeaderFormat
      )}`;
    }

    return `${
      monthFormatting.length > 1 ? firstDay.format(monthFormatting) : ""
      } ${monthFormatting.length > 1 ? "/" : ""} ${lastDay.format(
        calendarHeaderFormat
      )}`;
  }

  render() {
    const headerText = this.formatCalendarHeader(
      this.props.datesForWeek,
      this.props.calendarHeaderFormat
    );

    const iconComponent = require("./img/calendar.png")
    const imageSize = { width: 15, height: 15 };

    return (
      <View style={this.props.calendarHeaderContainerStyle}>
        <View style={[
          styles.calendarHeader,
          { fontSize: this.props.fontSize },
          this.props.calendarHeaderStyle
        ]}>
          <Text
            style={[
              { fontSize: this.props.fontSize },
              this.props.calendarHeaderStyle
            ]}
            allowFontScaling={this.props.allowHeaderTextScaling}
          >
            {headerText}

          </Text>
          {this.props.displayCalendarIcon && this.props.onCalendarDateSelected ? (
            <TouchableOpacity
              onPress={this.onCalendarDateSelected}
            >
              <Image
                style={[
                  styles.calendarIcon,
                  imageSize
                ]}
                source={iconComponent}
              />
            </TouchableOpacity>
          ) : null}
        </View>

      </View>
    );
  }
}

export default CalendarHeader;
