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
        minDate: React.PropTypes.any,
        maxDate: React.PropTypes.any,
        datesWhitelist: React.PropTypes.array,
        datesBlacklist: React.PropTypes.array,

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

        customDatesStyles: React.PropTypes.array,

        dateNameStyle: React.PropTypes.any,
        dateNumberStyle: React.PropTypes.any,
        weekendDateNameStyle: React.PropTypes.any,
        weekendDateNumberStyle: React.PropTypes.any,
        highlightDateNameStyle: React.PropTypes.any,
        highlightDateNumberStyle: React.PropTypes.any,
        disabledDateNameStyle: React.PropTypes.any,
        disabledDateNumberStyle: React.PropTypes.any,
        disabledDateOpacity: React.PropTypes.number,
        styleWeekend: React.PropTypes.bool,

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
        datesBlacklist: undefined,
        disabledDateOpacity: 0.3,
        customDatesStyles: [],
    };

    constructor(props) {
        super(props);
        this.numDaysInWeek = 7;

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
            datesForWeek: [],
            datesAllowedForWeek: [],
            datesSelectedForWeek: [],
            datesCustomStylesForWeek: [],
            selectedDate,
            enableLeftSelector: true,
            enableRightSelector: true,
        };

        this.resetAnimation();

        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUpdate = this.componentWillUpdate.bind(this);
        this.updateWeekData = this.updateWeekData.bind(this);
        this.getPreviousWeek = this.getPreviousWeek.bind(this);
        this.getNextWeek = this.getNextWeek.bind(this);
        this.onDateSelected = this.onDateSelected.bind(this);
        this.isDateSelected = this.isDateSelected.bind(this);
        this.formatCalendarHeader = this.formatCalendarHeader.bind(this);
        this.animate = this.animate.bind(this);
        this.resetAnimation = this.resetAnimation.bind(this);
    }

    componentDidMount() {
        // Initialize week view
        let startingDate = this.updateWeekView(); // Force update
        this.updateWeekData(startingDate);
        // Animate showing of CalendarDay elements
        this.animate();
    }

    //Receiving props and set selected date
    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedDate !== this.props.selectedDate) {
            let selectedDate = this.setLocale(moment(nextProps.selectedDate));
            this.setState({ selectedDate }, () => {
              // update week view and week data states
              let startingDate = this.updateWeekView(selectedDate);
              this.updateWeekData(startingDate, nextProps);
            });
        }

        let _startingDate;
        if (nextProps.startingDate !== this.props.startingDate) {
            _startingDate = this.setLocale(moment(nextProps.startingDate));
            this.updateWeekView(_startingDate, nextProps);
            this.updateWeekData(_startingDate, nextProps);
        }

        if (!_startingDate && (
            nextProps.datesBlacklist !== this.props.datesBlacklist ||
            nextProps.datesWhitelist !== this.props.datesWhitelist ||
            nextProps.customDatesStyles !== this.props.customDatesStyles ))
        {
            // No need to update week view here
            _startingDate = this.setLocale(moment(nextProps.startingDate));
            this.updateWeekData(_startingDate, nextProps);
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
        const previousWeekStartDate = this.state.startingDate.clone().subtract(1, 'w');
        this.setState({startingDate: previousWeekStartDate});
        if (this.props.onWeekChanged) {
            if(this.props.useIsoWeekday) {
                this.props.onWeekChanged(previousWeekStartDate.clone().startOf('isoweek'));
            }
            else {
                this.props.onWeekChanged(previousWeekStartDate.clone());
            }
        }
        this.updateWeekView(previousWeekStartDate);
        this.updateWeekData(previousWeekStartDate);
    }

    //Set startingDate to the next week
    getNextWeek() {
        const nextWeekStartDate = this.state.startingDate.clone().add(1, 'w');
        this.setState({startingDate: nextWeekStartDate});
        if (this.props.onWeekChanged) {
            if(this.props.useIsoWeekday) {
                this.props.onWeekChanged(nextWeekStartDate.clone().startOf('isoweek'));
            }
            else {
                this.props.onWeekChanged(nextWeekStartDate.clone());
            }
        }
        this.updateWeekView(nextWeekStartDate);
        this.updateWeekData(nextWeekStartDate);
    }

    // Set the current visible week to the selectedDate
    // When date param is undefined, an update always occurs (e.g. initialize)
    updateWeekView(date, props = this.props) {
      let startingDate = this.state.startingDate.clone().startOf('day');
      let initialize = date === undefined;
      let mDate = initialize ? startingDate : moment(date).startOf('day');
      let daysDiff = mDate.diff(startingDate, 'days');
      if (daysDiff === 0 && !initialize) {
        return this.state.startingDate;
      }
      let addOrSubtract = daysDiff > 0 ? 'add' : 'subtract';
      let adjustWeeks = daysDiff / 7;
      adjustWeeks = adjustWeeks > 0 ? Math.floor(adjustWeeks) : Math.ceil(Math.abs(adjustWeeks));
      startingDate[addOrSubtract](adjustWeeks, 'w');

      let newState = {startingDate};
      let endOfWeekDate;
      if (props.minDate || props.maxDate) {
        endOfWeekDate = startingDate.clone().add(6, 'days');
      }
      if (props.minDate) {
        newState.enableLeftSelector = !moment(props.minDate).isBetween(startingDate, endOfWeekDate, 'day', '[]');
      }
      if (props.maxDate) {
        newState.enableRightSelector = !moment(props.maxDate).isBetween(startingDate, endOfWeekDate, 'day', '[]');
      }
      this.setState(newState);
      return startingDate;
    }

    // Get & update week states for the week based on the startingDate
    updateWeekData(startingDate, props = this.props) {
        const me = this;
        let datesForWeek = [];
        let datesAllowedForWeek = [];
        let datesSelectedForWeek = [];
        let datesCustomStylesForWeek = [];

        for (let i=0; i<this.numDaysInWeek; i++) {
          let date;
          if (props.useIsoWeekday) {
            // isoWeekday starts from Monday
            date = me.setLocale(startingDate.clone().isoWeekday(i + 1));
          }
          else {
            date = me.setLocale(startingDate.clone().add(i, 'days'));
          }
          datesForWeek.push(date);
          datesAllowedForWeek.push(this.isDateAllowed(date, props));
          datesSelectedForWeek.push(this.isDateSelected(date));
          datesCustomStylesForWeek.push(this.getCustomDateStyle(date, props));
        }
        this.setState({datesForWeek, datesAllowedForWeek, datesSelectedForWeek, datesCustomStylesForWeek});
        return {datesForWeek, datesAllowedForWeek, datesSelectedForWeek, datesCustomStylesForWeek};
    }

    //Handling press on date/selecting date
    onDateSelected(selectedDate) {
        this.setState({ selectedDate },
          () => this.updateWeekData(this.state.startingDate) );

        this.props.onDateSelected && this.props.onDateSelected(selectedDate);
    }

    // Check whether date is allowed
    isDateAllowed(date, props = this.props) {
      // datesBlacklist entries override datesWhitelist
      if (props.datesBlacklist !== undefined ) {
        for (let disallowed of props.datesBlacklist) {
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

      if (props.datesWhitelist === undefined ) {
        return true;
      }

      // Whitelist
      for (let allowed of props.datesWhitelist) {
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

    getCustomDateStyle(date, props = this.props) {
      for (let customDateStyle of props.customDatesStyles) {
        if (customDateStyle.endDate) {
          // Range
          if (date.isBetween(customDateStyle.startDate, customDateStyle.endDate, 'day', '[]')) {
            return customDateStyle;
          }
        }
        else {
          // Single date
          if (date.isSame(customDateStyle.startDate, 'day')) {
            return customDateStyle;
          }
        }
      }
    }

    //Function for reseting animations
    resetAnimation() {
        this.animatedValue = [];
        for (let i=0; i<this.numDaysInWeek; i++) {
            this.animatedValue.push(new Animated.Value(0));
        }
    }

    //Function to animate showing the CalendarDay elements.
    //Possible cases for animations are sequence and parallel
    animate() {
        if (this.props.calendarAnimation) {
            let animations = [];
            for (let i=0; i<this.numDaysInWeek; i++) {
                animations.push(Animated.timing(
                    this.animatedValue[i],
                    {
                        toValue: 1,
                        duration: this.props.calendarAnimation.duration,
                        easing: Easing.linear
                    }
                )
              );
            }

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
    formatCalendarHeader(datesForWeek) {
        if (!datesForWeek || datesForWeek.length === 0) {
            return;
        }
        let firstDay = datesForWeek[0];
        let lastDay = datesForWeek[datesForWeek.length - 1];
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
        let datesForWeek = this.state.datesForWeek;
        let datesRender = [];
        for (let i=0; i<datesForWeek.length; i++) {
          let enabled = this.state.datesAllowedForWeek[i];
          let calendarDay = (
            <CalendarDay
                date={datesForWeek[i]}
                selected={this.state.datesSelectedForWeek[i]}
                enabled={enabled}
                showDayName={this.props.showDayName}
                showDayNumber={this.props.showDayNumber}
                onDateSelected={() => enabled && this.onDateSelected(datesForWeek[i]) }
                calendarColor={this.props.calendarColor}
                dateNameStyle={this.props.dateNameStyle}
                dateNumberStyle={this.props.dateNumberStyle}
                weekendDateNameStyle={this.props.weekendDateNameStyle}
                weekendDateNumberStyle={this.props.weekendDateNumberStyle}
                highlightDateNameStyle={this.props.highlightDateNameStyle}
                highlightDateNumberStyle={this.props.highlightDateNumberStyle}
                disabledDateNameStyle={this.props.disabledDateNameStyle}
                disabledDateNumberStyle={this.props.disabledDateNumberStyle}
                disabledDateOpacity={this.props.disabledDateOpacity}
                styleWeekend={this.props.styleWeekend}
                daySelectionAnimation={this.props.daySelectionAnimation}
                customStyle={this.state.datesCustomStylesForWeek[i]}
            />
          );
          datesRender.push( this.props.calendarAnimation ?
            <Animated.View key={i} style={{opacity: this.animatedValue[i], flex: 1}}>
              {calendarDay}
            </Animated.View>
            :
            <View key={i} style={{flex: 1}}>
              {calendarDay}
            </View>
          );
        }
        let leftOpacity = {opacity: this.state.enableLeftSelector ? 1 : 0};
        let rightOpacity = {opacity: this.state.enableRightSelector ? 1 : 0};
        let leftSelector = this.props.leftSelector  || <Image style={[styles.icon, this.props.iconStyle, this.props.iconLeftStyle, leftOpacity]} source={this.props.iconLeft}/>;
        let rightSelector = this.props.rightSelector || <Image style={[styles.icon, this.props.iconStyle, this.props.iconRightStyle, rightOpacity]} source={this.props.iconRight}/>;
        let calendarHeader = this.props.showMonth && <Text style={[styles.calendarHeader, this.props.calendarHeaderStyle]}>{this.formatCalendarHeader(datesForWeek)}</Text>;

        // calendarHeader renders above the dates & left/right selectors if dates are shown.
        // However if dates are hidden, the header shows between the left/right selectors.
        return (
            <View style={[styles.calendarContainer, {backgroundColor: this.props.calendarColor}, this.props.style]}>
                { this.props.showDate && calendarHeader }
                <View style={styles.datesStrip}>
                    <TouchableOpacity
                      style={[styles.iconContainer, this.props.iconContainer]}
                      onPress={this.getPreviousWeek}
                      disabled={!this.state.enableLeftSelector}
                    >
                      { leftSelector }
                    </TouchableOpacity>
                    { this.props.showDate ?
                      <View style={styles.calendarDates}>
                          {datesRender}
                      </View>
                      :
                      calendarHeader
                    }
                    <TouchableOpacity
                      style={[styles.iconContainer, this.props.iconContainer]}
                      onPress={this.getNextWeek}
                      disabled={!this.state.enableRightSelector}
                    >
                      { rightSelector }
                    </TouchableOpacity>
              </View>
            </View>
        );
    }
}
