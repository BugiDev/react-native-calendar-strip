import React, { Component } from "react";
import PropTypes from "prop-types";
import { Text, TouchableOpacity } from "react-native";

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
    weekStartDate: PropTypes.object,
    weekEndDate: PropTypes.object,
    allowHeaderTextScaling: PropTypes.bool,
    fontSize: PropTypes.number,
    headerText: PropTypes.string,
    onHeaderSelected: PropTypes.func,
  };

  shouldComponentUpdate(nextProps) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps);
  }

  //Function that formats the calendar header
  //It also formats the month section if the week is in between months
  formatCalendarHeader(calendarHeaderFormat) {
    if (!this.props.weekStartDate || !this.props.weekEndDate) {
      return "";
    }

    const firstDay = this.props.weekStartDate;
    const lastDay = this.props.weekEndDate;
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
    const {
      calendarHeaderFormat,
      onHeaderSelected,
      calendarHeaderContainerStyle,
      calendarHeaderStyle,
      fontSize,
      allowHeaderTextScaling,
      weekStartDate: _weekStartDate,
      weekEndDate: _weekEndDate,
      headerText,
    } = this.props;
    const _headerText = headerText || this.formatCalendarHeader(calendarHeaderFormat);
    const weekStartDate = _weekStartDate && _weekStartDate.clone();
    const weekEndDate = _weekEndDate && _weekEndDate.clone();

    return (
      <TouchableOpacity
        onPress={onHeaderSelected && onHeaderSelected.bind(this, {weekStartDate, weekEndDate})}
        disabled={!onHeaderSelected}
        style={calendarHeaderContainerStyle}
      >
        <Text
          style={[
            styles.calendarHeader,
            { fontSize: fontSize },
            calendarHeaderStyle
          ]}
          allowFontScaling={allowHeaderTextScaling}
        >
          {_headerText}
        </Text>
      </TouchableOpacity>
    );
  }
}

export default CalendarHeader;
