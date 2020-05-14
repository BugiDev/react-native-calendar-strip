/**
 * Created by bogdanbegovic on 8/20/16.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Animated } from "react-native";

import moment from "moment";

import CalendarHeader from "./CalendarHeader";
import CalendarDay from "./CalendarDay";
import WeekSelector from "./WeekSelector";
import styles from "./Calendar.style.js";

/*
 * Class CalendarStrip that is representing the whole calendar strip and contains CalendarDay elements
 *
 */
class CalendarStrip extends Component {
  static propTypes = {
    style: PropTypes.any,
    innerStyle: PropTypes.any,
    calendarColor: PropTypes.string,

    startingDate: PropTypes.any,
    selectedDate: PropTypes.any,
    onDateSelected: PropTypes.func,
    onWeekChanged: PropTypes.func,
    updateWeek: PropTypes.bool,
    useIsoWeekday: PropTypes.bool,
    minDate: PropTypes.any,
    maxDate: PropTypes.any,
    datesWhitelist: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
    datesBlacklist: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),

    markedDates: PropTypes.array,

    showMonth: PropTypes.bool,
    showDayName: PropTypes.bool,
    showDayNumber: PropTypes.bool,
    showDate: PropTypes.bool,

    dayComponent: PropTypes.any,
    leftSelector: PropTypes.any,
    rightSelector: PropTypes.any,
    iconLeft: PropTypes.any,
    iconRight: PropTypes.any,
    iconStyle: PropTypes.any,
    iconLeftStyle: PropTypes.any,
    iconRightStyle: PropTypes.any,
    iconContainer: PropTypes.any,

    maxDayComponentSize: PropTypes.number,
    minDayComponentSize: PropTypes.number,
    responsiveSizingOffset: PropTypes.number,

    calendarHeaderContainerStyle: PropTypes.any,
    calendarHeaderStyle: PropTypes.any,
    calendarHeaderFormat: PropTypes.string,
    calendarHeaderPosition: PropTypes.oneOf(["above", "below"]),

    calendarAnimation: PropTypes.object,
    daySelectionAnimation: PropTypes.object,

    customDatesStyles: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),

    dateNameStyle: PropTypes.any,
    dateNumberStyle: PropTypes.any,
    weekendDateNameStyle: PropTypes.any,
    weekendDateNumberStyle: PropTypes.any,
    highlightDateNameStyle: PropTypes.any,
    highlightDateNumberStyle: PropTypes.any,
    disabledDateNameStyle: PropTypes.any,
    disabledDateNumberStyle: PropTypes.any,
    markedDatesStyle: PropTypes.object,
    disabledDateOpacity: PropTypes.number,
    styleWeekend: PropTypes.bool,

    locale: PropTypes.object,
    shouldAllowFontScaling: PropTypes.bool,
    useNativeDriver: PropTypes.bool
  };

  static defaultProps = {
    useIsoWeekday: true,
    showMonth: true,
    showDate: true,
    updateWeek: true,
    iconLeft: require("./img/left-arrow-black.png"),
    iconRight: require("./img/right-arrow-black.png"),
    calendarHeaderFormat: "MMMM YYYY",
    calendarHeaderPosition: "above",
    datesWhitelist: undefined,
    datesBlacklist: undefined,
    disabledDateOpacity: 0.3,
    customDatesStyles: [],
    responsiveSizingOffset: 0,
    innerStyle: { flex: 1 },
    maxDayComponentSize: 80,
    minDayComponentSize: 10,
    shouldAllowFontScaling: true,
    markedDates: [],
    useNativeDriver: true
  };

  constructor(props) {
    super(props);
    this.numDaysInWeek = 7;

    if (props.locale) {
      if (props.locale.name && props.locale.config) {
        moment.updateLocale(props.locale.name, props.locale.config);
      } else {
        throw new Error(
          "Locale prop is not in the correct format. \b Locale has to be in form of object, with params NAME and CONFIG!"
        );
      }
    }

    const startingDate = this.getInitialStartingDate();
    const selectedDate = this.setLocale(moment(this.props.selectedDate));

    this.state = {
      startingDate,
      selectedDate,
      dayComponentWidth: 0,
      height: 0,
      monthFontSize: 0,
      selectorSize: 0
    };

    this.animations = [];
    this.getPreviousWeek = this.getPreviousWeek.bind(this);
    this.getNextWeek = this.getNextWeek.bind(this);
    this.onDateSelected = this.onDateSelected.bind(this);
    this.createDays = this.createDays.bind(this);
    this.registerAnimation = this.registerAnimation.bind(this);
  }

  //Receiving props and set date states, minimizing state updates.
  componentDidUpdate(prevProps, prevState) {
    let startingDate = {};
    let days = {};
    let updateState = false;

    if (!this.compareDates(prevProps.startingDate, this.props.startingDate)) {
      updateState = true;
      startingDate = { startingDate: this.setLocale(moment(this.props.startingDate))};
      days = this.createDays(startingDate.startingDate);
    }

    if (updateState) {
      this.setState({...startingDate, ...days });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Extract selector icons since JSON.stringify fails on React component circular refs
    let _nextProps = Object.assign({}, nextProps);
    let _props = Object.assign({}, this.props);

    delete _nextProps.leftSelector;
    delete _nextProps.rightSelector;
    delete _props.leftSelector;
    delete _props.rightSelector;

    return (
      JSON.stringify(this.state) !== JSON.stringify(nextState) ||
      JSON.stringify(_props) !== JSON.stringify(_nextProps) ||
      this.props.leftSelector !== nextProps.leftSelector ||
      this.props.rightSelector !== nextProps.rightSelector
    );
  }

  // Check whether two datetimes are of the same value.  Supports Moment date,
  // JS date, or ISO 8601 strings.
  // Returns true if the datetimes values are the same; false otherwise.
  compareDates(date1, date2) {
    if (date1 && date1.valueOf &&
        date2 && date2.valueOf &&
        date1.valueOf() === date2.valueOf() )
    {
      return true;
    } else {
      return JSON.stringify(date1) === JSON.stringify(date2);
    }
  }

  //Function that checks if the locale is passed to the component and sets it to the passed moment instance
  setLocale(momentInstance) {
    if (this.props.locale) {
      momentInstance.locale(this.props.locale.name);
    }
    return momentInstance;
  }

  getInitialStartingDate() {
    if (this.props.startingDate) {
      return this.setLocale(moment(this.props.startingDate));
    } else {
      return this.setLocale(moment(this.props.selectedDate)).isoWeekday(1);
    }
  }

  //Set startingDate to the previous week
  getPreviousWeek() {
    this.animations = [];
    const previousWeekStartDate = this.state.startingDate.clone().subtract(1, "w");
    if (this.props.onWeekChanged) {
      let _previousWeekStartDate = this.props.useIsoWeekday ?
        previousWeekStartDate.clone().startOf("isoweek")
        :
        previousWeekStartDate;
      this.props.onWeekChanged(_previousWeekStartDate);
    }
    const days = this.createDays(previousWeekStartDate);
    this.setState({ startingDate: previousWeekStartDate, ...days });
  }

  //Set startingDate to the next week
  getNextWeek() {
    this.animations = [];
    const nextWeekStartDate = this.state.startingDate.clone().add(1, "w");
    if (this.props.onWeekChanged) {
      let _nextWeekStartDate = this.props.useIsoWeekday ?
        nextWeekStartDate.clone().startOf("isoweek")
        :
        nextWeekStartDate.clone();
      this.props.onWeekChanged(_nextWeekStartDate);
    }
    const days = this.createDays(nextWeekStartDate);
    this.setState({ startingDate: nextWeekStartDate, ...days });
  }

  // Set the current visible week to the selectedDate
  // When date param is undefined, an update always occurs (e.g. initialize)
  updateWeekStart(newStartDate, originalStartDate = this.state.startingDate) {
    if (!this.props.updateWeek) {
      return originalStartDate;
    }
    let startingDate = moment(newStartDate).startOf("day");
    let daysDiff = startingDate.diff(originalStartDate.startOf("day"), "days");
    if (daysDiff === 0) {
      return originalStartDate;
    }
    let addOrSubtract = daysDiff > 0 ? "add" : "subtract";
    let adjustWeeks = daysDiff / 7;
    adjustWeeks =
      adjustWeeks > 0
        ? Math.floor(adjustWeeks)
        : Math.ceil(Math.abs(adjustWeeks));
    startingDate = originalStartDate[addOrSubtract](adjustWeeks, "w");

    return this.setLocale(startingDate);
  }

  //Handling press on date/selecting date
  onDateSelected(selectedDate) {
    this.setState({
      selectedDate,
      ...this.createDays(this.state.startingDate, selectedDate),
    });
    this.props.onDateSelected && this.props.onDateSelected(selectedDate);
  }

  // Get the currently selected date (Moment JS object)
  getSelectedDate(date) {
    if (this.state.selectedDate.valueOf() === 0) {
      return; // undefined (no date has been selected yet)
    }
    return this.state.selectedDate;
  }

  updateSelectedDay(previousSelectedDate, selectedDate) {
    let days = [...this.state.days];

    for (let i = 0; i < days.length; i++) {
      if (selectedDate.isSame(days[i].key, "day") ||
          previousSelectedDate.isSame(days[i].key, "day"))
      {
        days[i] = this.renderDay(moment(days[i].key), selectedDate, i);
      }
    }

    return days;
  }

  // Set the selected date.  To clear the currently selected date, pass in 0.
  setSelectedDate(date) {
    let mDate = moment(date);
    this.onDateSelected(mDate);
  }

  // Gather animations from each day. Sequence animations must be started
  // together to work around bug in RN Animated with individual starts.
  registerAnimation(animation) {
    this.animations.push(animation);
    if (this.animations.length >= this.state.days.length) {
      if (this.props.calendarAnimation.type.toLowerCase() === "sequence") {
        Animated.sequence(this.animations).start();
      }
      else {
        Animated.parallel(this.animations).start();
      }
    }
  }

  // Responsive sizing based on container width.
  onLayout(event) {
    let csWidth = event.nativeEvent.layout.width;
    let numElements = this.numDaysInWeek;
    if (
      Array.isArray(this.props.leftSelector) &&
      this.props.leftSelector.length > 0
    ) {
      numElements++;
    }
    if (
      Array.isArray(this.props.rightSelector) &&
      this.props.rightSelector.length > 0
    ) {
      numElements++;
    }

    let dayComponentWidth =
      csWidth / numElements + this.props.responsiveSizingOffset;
    dayComponentWidth = Math.min(
      dayComponentWidth,
      this.props.maxDayComponentSize
    );
    dayComponentWidth = Math.max(
      dayComponentWidth,
      this.props.minDayComponentSize
    );
    let monthFontSize = Math.round(dayComponentWidth / 3.2);
    let selectorSize = Math.round(dayComponentWidth / 2.5);
    let height = this.props.showMonth ? monthFontSize : 0;
    height += this.props.showDate ? dayComponentWidth : 0; // assume square element sizes
    selectorSize = Math.min(selectorSize, height);

    this.setState({
      dayComponentWidth,
      height,
      monthFontSize,
      selectorSize
    },
    () => this.setState( {...this.createDays(this.state.startingDate)} ));
  }

  createDays(startingDate, selectedDate = this.state.selectedDate) {
    let datesForWeek = [];
    let days = [];

    for (let i = 0; i < this.numDaysInWeek; i++) {
      let date;
      if (this.props.useIsoWeekday) {
        // isoWeekday starts from Monday
        date = this.setLocale(startingDate.clone().isoWeekday(i + 1));
      } else {
        date = this.setLocale(startingDate.clone().add(i, "days"));
      }
      datesForWeek.push(date);
      days.push(this.renderDay(date, selectedDate, i));
    }

    return {
      days,
      weekStartDate: datesForWeek[0],
      weekEndDate: datesForWeek[datesForWeek.length - 1],
    };
  }

  renderDay(date, selectedDate, index) {
    return (
      <CalendarDay
        date={date}
        selectedDate={selectedDate}
        key={date.format("YYYY-MM-DD")}
        datesWhitelist={this.props.datesWhitelist}
        datesBlacklist={this.props.datesBlacklist}
        showDayName={this.props.showDayName}
        showDayNumber={this.props.showDayNumber}
        onDateSelected={this.onDateSelected}
        dayComponent={this.props.dayComponent}
        calendarColor={this.props.calendarColor}
        dateNameStyle={this.props.dateNameStyle}
        dateNumberStyle={this.props.dateNumberStyle}
        weekendDateNameStyle={this.props.weekendDateNameStyle}
        weekendDateNumberStyle={this.props.weekendDateNumberStyle}
        highlightDateNameStyle={this.props.highlightDateNameStyle}
        highlightDateNumberStyle={this.props.highlightDateNumberStyle}
        disabledDateNameStyle={this.props.disabledDateNameStyle}
        disabledDateNumberStyle={this.props.disabledDateNumberStyle}
        markedDatesStyle={this.props.markedDatesStyle}
        disabledDateOpacity={this.props.disabledDateOpacity}
        styleWeekend={this.props.styleWeekend}
        calendarAnimation={this.props.calendarAnimation}
        registerAnimation={this.registerAnimation}
        daySelectionAnimation={this.props.daySelectionAnimation}
        useNativeDriver={this.props.useNativeDriver}
        customDatesStyles={this.props.customDatesStyles}
        markedDates={this.props.markedDates}
        size={this.state.dayComponentWidth}
        allowDayTextScaling={this.props.shouldAllowFontScaling}
      />
    );
  }

  renderHeader() {
    return ( this.props.showMonth &&
      <CalendarHeader
        calendarHeaderFormat={this.props.calendarHeaderFormat}
        calendarHeaderContainerStyle={this.props.calendarHeaderContainerStyle}
        calendarHeaderStyle={this.props.calendarHeaderStyle}
        weekStartDate={this.state.weekStartDate}
        weekEndDate={this.state.weekEndDate}
        fontSize={this.state.monthFontSize}
        allowHeaderTextScaling={this.props.shouldAllowFontScaling}
      />
    );
  }

  renderWeekView(days) {
    return ( <View style={styles.calendarDates}>{days}</View> );
  }

  render() {
    // calendarHeader renders above or below of the dates & left/right selectors if dates are shown.
    // However if dates are hidden, the header shows between the left/right selectors.
    return (
      <View
        style={[
          styles.calendarContainer,
          { backgroundColor: this.props.calendarColor },
          this.props.style
        ]}
      >
        <View
          style={[this.props.innerStyle, { height: this.state.height }]}
          onLayout={this.onLayout.bind(this)}
        >
          {this.props.showDate && this.props.calendarHeaderPosition === "above" &&
            this.renderHeader()
          }

          <View style={styles.datesStrip}>
            <WeekSelector
              controlDate={this.props.minDate}
              iconComponent={this.props.leftSelector}
              iconContainerStyle={this.props.iconContainer}
              iconInstanceStyle={this.props.iconLeftStyle}
              iconStyle={this.props.iconStyle}
              imageSource={this.props.iconLeft}
              onPress={this.getPreviousWeek}
              weekStartDate={this.state.weekStartDate}
              weekEndDate={this.state.weekEndDate}
              size={this.state.selectorSize}
            />

            {this.props.showDate ? (
              this.renderWeekView(this.state.days)
            ) : (
              this.renderHeader()
            )}

            <WeekSelector
              controlDate={this.props.maxDate}
              iconComponent={this.props.rightSelector}
              iconContainerStyle={this.props.iconContainer}
              iconInstanceStyle={this.props.iconRightStyle}
              iconStyle={this.props.iconStyle}
              imageSource={this.props.iconRight}
              onPress={this.getNextWeek}
              weekStartDate={this.state.weekStartDate}
              weekEndDate={this.state.weekEndDate}
              size={this.state.selectorSize}
            />
          </View>

          {this.props.showDate && this.props.calendarHeaderPosition === "below" &&
            this.renderHeader()
          }
        </View>
      </View>
    );
  }
}

export default CalendarStrip;
