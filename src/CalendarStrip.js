/**
 * Created by bogdanbegovic on 8/20/16.
 */

import React, {Component} from 'react';
import {
    Text,
    View,
    Image,
    Animated,
    Easing,
    TouchableOpacity
} from 'react-native';
import CalendarDay from './CalendarDay';
import moment from 'moment';
import styles from './Calendar.style.js';

//Just a shallow array of 7 elements
const arr = [];
for (let i = 0; i < 7; i++) {
    arr.push(i);
}
/*
 * Class CalendarStrip that is representing the whole calendar strip and contains CalendarDay elements
 *
 */
export default class CalendarStrip extends Component {

    static propTypes = {
        style: React.PropTypes.any,
        calendarColor: React.PropTypes.string,

        startingDate: React.PropTypes.any,
        selectedDate: React.PropTypes.any,
        onDateSelected: React.PropTypes.func,
        onWeekChanged: React.PropTypes.func,
        useIsoWeekday: React.PropTypes.bool,

        showMonth: React.PropTypes.bool,
        showDayName: React.PropTypes.bool,
        showDayNumber: React.PropTypes.bool,
        showDate: React.PropTypes.bool,

        leftSelector: React.PropTypes.any,
        rightSelector: React.PropTypes.any,
        iconLeft: React.PropTypes.any,
        iconRight: React.PropTypes.any,
        iconStyle: React.PropTypes.any,
        iconLeftStyle: React.PropTypes.any,
        iconRightStyle: React.PropTypes.any,
        iconContainer: React.PropTypes.any,

        calendarHeaderStyle: React.PropTypes.any,
        calendarHeaderFormat: React.PropTypes.string,

        calendarAnimation: React.PropTypes.object,
        daySelectionAnimation: React.PropTypes.object,

        dateNameStyle: React.PropTypes.any,
        dateNumberStyle: React.PropTypes.any,
        weekendDateNameStyle: React.PropTypes.any,
        weekendDateNumberStyle: React.PropTypes.any,
        highlightDateNameStyle: React.PropTypes.any,
        highlightDateNumberStyle: React.PropTypes.any,
        disabledDateNameStyle: React.PropTypes.any,
        disabledDateNumberStyle: React.PropTypes.any,
        styleWeekend: React.PropTypes.bool,
        datesWhitelist: React.PropTypes.array,
        datesBlacklist: React.PropTypes.array,

        locale: React.PropTypes.object
    };

    static defaultProps = {
        useIsoWeekday: true,
        showMonth: true,
        showDate: true,
        iconLeft: require('./img/left-arrow-black.png'),
        iconRight: require('./img/right-arrow-black.png'),
        calendarHeaderFormat: 'MMMM YYYY',
        datesWhitelist: undefined,
        datesBlacklist: undefined
    };

    constructor(props) {
        super(props);

        if(props.locale) {
            if(props.locale.name && props.locale.config) {
                moment.locale(props.locale.name, props.locale.config);
            } else {
                throw new Error('Locale prop is not in the correct format. \b Locale has to be in form of object, with params NAME and CONFIG!');
            }
        }

        const startingDate = this.getInitialStartingDate();
        const selectedDate = this.setLocale(moment(this.props.selectedDate));

        this.state = {
            startingDate,
            selectedDate
        };

        this.resetAnimation();

        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUpdate = this.componentWillUpdate.bind(this);
        this.getDatesForWeek = this.getDatesForWeek.bind(this);
        this.getPreviousWeek = this.getPreviousWeek.bind(this);
        this.getNextWeek = this.getNextWeek.bind(this);
        this.onDateSelected = this.onDateSelected.bind(this);
        this.isDateSelected = this.isDateSelected.bind(this);
        this.formatCalendarHeader = this.formatCalendarHeader.bind(this);
        this.animate = this.animate.bind(this);
        this.resetAnimation = this.resetAnimation.bind(this);
    }

    //Animate showing of CalendarDay elements
    componentDidMount() {
        this.animate();
    }

    //Receiving props and set selected date
    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedDate !== this.props.selectedDate) {
            let selectedDate = this.setLocale(moment(nextProps.selectedDate));
            this.updateWeekView(selectedDate);
            this.setState({
                selectedDate
            });
        }

        if (nextProps.startingDate !== this.props.startingDate) {
            let startingDate = this.setLocale(moment(nextProps.startingDate));
            this.updateWeekView(startingDate, startingDate);
        }
    }

    //Only animate CalendarDays if the selectedDate is the same
    //Prevents animation on pressing on a date
    componentWillUpdate(nextProps, nextState) {
        if (nextState.selectedDate === this.state.selectedDate) {
            this.resetAnimation();
            this.animate();
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
        const previousWeekStartDate = this.state.startingDate.subtract(1, 'w');
        this.setState({startingDate: previousWeekStartDate});
        if (this.props.onWeekChanged) {
            if(this.props.useIsoWeekday) {
                this.props.onWeekChanged(previousWeekStartDate.clone().startOf('isoweek'));
            }
            else {
                this.props.onWeekChanged(previousWeekStartDate.clone());
            }
        }
    }

    //Set startingDate to the next week
    getNextWeek() {
        const nextWeekStartDate = this.state.startingDate.add(1, 'w');
        this.setState({startingDate: nextWeekStartDate});
        if (this.props.onWeekChanged) {
            if(this.props.useIsoWeekday) {
                this.props.onWeekChanged(nextWeekStartDate.clone().startOf('isoweek'));
            }
            else {
                this.props.onWeekChanged(nextWeekStartDate.clone());
            }
        }
    }

    // Set the current visible week to the selectedDate
    updateWeekView(date, startDate = this.state.startingDate) {
      let mDate = moment(date).startOf('day');
      let daysDiff = mDate.diff(moment(startDate).startOf('day'), 'days');
      let addOrSubtract = daysDiff > 0 ? 'add' : 'subtract';
      let adjustWeeks = daysDiff / 7;
      adjustWeeks = adjustWeeks > 0 ? Math.floor(adjustWeeks) : Math.ceil(Math.abs(adjustWeeks));

      let startingDate = startDate[addOrSubtract](adjustWeeks, 'w');
      this.setState({startingDate});
    }

    //Get dates for the week based on the startingDate
    //Using isoWeekday so that it will start from Monday
    getDatesForWeek() {
        const me = this;
        let dates = [];
        let startDate = moment(this.state.startingDate);

        arr.forEach((item, index) => {
            let date;
            if (me.props.useIsoWeekday) {
              date = me.setLocale(moment(startDate.isoWeekday(index + 1)));
            }
            else {
              date = me.setLocale(moment(startDate).add(index, 'days'));
            }
            dates.push(date);
        });
        return dates;
    }

    //Handling press on date/selecting date
    onDateSelected(date) {
        this.setState({selectedDate: date});
        if (this.props.onDateSelected) {
            this.props.onDateSelected(date);
        }
    }

    // Check whether date is allowed
    isDateAllowed(date) {
      // datesBlacklist entries override datesWhitelist
      if (this.props.datesBlacklist !== undefined ) {
        for (let disallowed of this.props.datesBlacklist) {
          // Blacklist start/end object
          if (disallowed.start && disallowed.end) {
            if (date.isBetween(disallowed.start, disallowed.end, 'day', '[]')) {
              return false;
            }
          }
          else {
            if (date.isSame(disallowed, 'day')) {
              return false;
            }
          }
        }
      }

      if (this.props.datesWhitelist === undefined ) {
        return true;
      }

      // Whitelist
      for (let allowed of this.props.datesWhitelist) {
        // start/end object
        if (allowed.start && allowed.end) {
          if (date.isBetween(allowed.start, allowed.end, 'day', '[]')) {
            return true;
          }
        }
        else {
          if (date.isSame(allowed, 'day')) {
            return true;
          }
        }
      }
      return false;
    }

    //Function to check if provided date is the same as selected one, hence date is selected
    //using isSame moment query with 'day' param so that it check years, months and day
    isDateSelected(date) {
        return date.isSame(this.state.selectedDate, 'day');
    }

    // Get the currently selected date (Moment JS object)
    getSelectedDate(date) {
        if (this.state.selectedDate.valueOf() === 0) {
          return; // undefined (no date has been selected yet)
        }
        return this.state.selectedDate;
    }

    // Set the selected date.  To clear the currently selected date, pass in 0.
    setSelectedDate(date) {
        let mDate = moment(date);
        this.onDateSelected(mDate);
        // Update week view only if date is not cleared (0).
        if (date !== 0) {
          this.updateWeekView(mDate);
        }
    }

    //Function for reseting animations
    resetAnimation() {
        this.animatedValue = [];
        arr.forEach((value) => {
            this.animatedValue[value] = new Animated.Value(0);
        });
    }

    //Function to animate showing the CalendarDay elements.
    //Possible cases for animations are sequence and parallel
    animate() {
        if (this.props.calendarAnimation) {
            let animations = arr.map((item) => {
                return Animated.timing(
                    this.animatedValue[item],
                    {
                        toValue: 1,
                        duration: this.props.calendarAnimation.duration,
                        easing: Easing.linear
                    }
                );
            });

            if (this.props.calendarAnimation.type.toLowerCase() === 'sequence') {
                Animated.sequence(animations).start();
            } else {
                if (this.props.calendarAnimation.type.toLowerCase() === 'parallel') {
                    Animated.parallel(animations).start();
                } else {
                    throw new Error('CalendarStrip Error! Type of animation is incorrect!');
                }
            }
        }
    }

    //Function that formats the calendar header
    //It also formats the month section if the week is in between months
    formatCalendarHeader() {
        let firstDay = this.getDatesForWeek()[0];
        let lastDay = this.getDatesForWeek()[this.getDatesForWeek().length - 1];
        let monthFormatting = '';
        //Parsing the month part of the user defined formating
        if ((this.props.calendarHeaderFormat.match(/Mo/g) || []).length > 0) {
            monthFormatting = 'Mo';
        } else {
            if ((this.props.calendarHeaderFormat.match(/M/g) || []).length > 0) {
                for (let i = (this.props.calendarHeaderFormat.match(/M/g) || []).length; i > 0; i--) {
                    monthFormatting += 'M';
                }
            }
        }

        if (firstDay.month() === lastDay.month()) {
            return firstDay.format(this.props.calendarHeaderFormat);
        }
        if (firstDay.year() !== lastDay.year()) {
            return `${firstDay.format(this.props.calendarHeaderFormat)} / ${lastDay.format(this.props.calendarHeaderFormat)}`;
        }
        return `${monthFormatting.length > 1 ? firstDay.format(monthFormatting) : ''} ${monthFormatting.length > 1 ? '/' : ''} ${lastDay.format(this.props.calendarHeaderFormat)}`;
    }

    render() {
        let opacityAnim = 1;
        let datesRender = this.getDatesForWeek().map((date, index) => {
            if (this.props.calendarAnimation) {
                opacityAnim = this.animatedValue[index];
            }
            let enabled = this.isDateAllowed(date);
            return (
                <Animated.View key={index} style={{opacity: opacityAnim, flex: 1}}>
                    <CalendarDay
                        date={date}
                        selected={this.isDateSelected(date)}
                        enabled={enabled}
                        showDayName={this.props.showDayName}
                        showDayNumber={this.props.showDayNumber}
                        onDateSelected={() => { if (enabled) this.onDateSelected(date); } }
                        calendarColor={this.props.calendarColor}
                        dateNameStyle={this.props.dateNameStyle}
                        dateNumberStyle={this.props.dateNumberStyle}
                        weekendDateNameStyle={this.props.weekendDateNameStyle}
                        weekendDateNumberStyle={this.props.weekendDateNumberStyle}
                        highlightDateNameStyle={this.props.highlightDateNameStyle}
                        highlightDateNumberStyle={this.props.highlightDateNumberStyle}
                        disabledDateNameStyle={this.props.disabledDateNameStyle}
                        disabledDateNumberStyle={this.props.disabledDateNumberStyle}
                        styleWeekend={this.props.styleWeekend}
                        daySelectionAnimation={this.props.daySelectionAnimation}
                    />
                </Animated.View>
            );
        });
        let leftSelector = this.props.leftSelector   || <Image style={[styles.icon, this.props.iconStyle, this.props.iconLeftStyle]} source={this.props.iconLeft}/>;
        let rightSelector = this.props.rightSelector || <Image style={[styles.icon, this.props.iconStyle, this.props.iconRightStyle]} source={this.props.iconRight}/>;
        let calendarHeader = this.props.showMonth && <Text style={[styles.calendarHeader, this.props.calendarHeaderStyle]}>{this.formatCalendarHeader()}</Text>;

        // calendarHeader renders above the dates & left/right selectors if dates are shown.
        // However if dates are hidden, the header shows between the left/right selectors.
        return (
            <View style={[styles.calendarContainer, {backgroundColor: this.props.calendarColor}, this.props.style]}>
                { this.props.showDate && calendarHeader }
                <View style={styles.datesStrip}>
                    <TouchableOpacity style={[styles.iconContainer, this.props.iconContainer]} onPress={this.getPreviousWeek}>
                        { leftSelector }
                    </TouchableOpacity>
                    { this.props.showDate ?
                      <View style={styles.calendarDates}>
                          {datesRender}
                      </View>
                      :
                      calendarHeader
                    }
                    <TouchableOpacity style={[styles.iconContainer, this.props.iconContainer]} onPress={this.getNextWeek}>
                        { rightSelector }
                    </TouchableOpacity>
              </View>
            </View>
        );
    }
}
