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
        highlightColor: React.PropTypes.string,
        borderHighlightColor: React.PropTypes.string,

        startingDate: React.PropTypes.any,
        selectedDate: React.PropTypes.any,
        onDateSelected: React.PropTypes.func,
        useIsoWeekday: React.PropTypes.bool,

        iconLeft: React.PropTypes.any,
        iconRight: React.PropTypes.any,
        iconStyle: React.PropTypes.any,
        iconLeftStyle: React.PropTypes.any,
        iconRightStyle: React.PropTypes.any,
        iconContainer: React.PropTypes.any,

        calendarHeaderStyle: React.PropTypes.any,
        calendarHeaderFormat: React.PropTypes.string,

        calendarAnimation: React.PropTypes.object,
        selection: React.PropTypes.string,
        selectionAnimation: React.PropTypes.object,

        dateNameStyle: React.PropTypes.any,
        dateNumberStyle: React.PropTypes.any,
        weekendDateNameStyle: React.PropTypes.any,
        weekendDateNumberStyle: React.PropTypes.any,

        locale: React.PropTypes.object
    };

    static defaultProps = {
        startingDate: moment(),
        useIsoWeekday: true,
        iconLeft: require('./img/left-arrow-black.png'),
        iconRight: require('./img/right-arrow-black.png'),
        calendarHeaderFormat: 'MMMM YYYY'
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

        const startingDate = this.setLocale(moment(this.props.startingDate));
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
            const selectedDate = this.setLocale(moment(nextProps.selectedDate));
            this.setState({
                selectedDate
            });
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

    //Set startingDate to the previous week
    getPreviousWeek() {
        this.setState({startingDate: this.state.startingDate.subtract(1, 'w')});
    }

    //Set startingDate to the next week
    getNextWeek() {
        this.setState({startingDate: this.state.startingDate.add(1, 'w')});
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

    //Function to check if provided date is the same as selected one, hence date is selected
    //using isSame moment query with 'day' param so that it check years, months and day
    isDateSelected(date) {
        return date.isSame(this.state.selectedDate, 'day');
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
            return (
                <Animated.View key={date} style={{opacity: opacityAnim, flex: 1}}>
                    <CalendarDay
                        date={date}
                        key={date}
                        selected={this.isDateSelected(date)}
                        onDateSelected={this.onDateSelected}
                        calendarColor={this.props.calendarColor}
                        highlightColor={this.props.highlightColor}
                        dateNameStyle={this.props.dateNameStyle}
                        dateNumberStyle={this.props.dateNumberStyle}
                        weekendDateNameStyle={this.props.weekendDateNameStyle}
                        weekendDateNumberStyle={this.props.weekendDateNumberStyle}
                        selection={this.props.selection}
                        selectionAnimation={this.props.selectionAnimation}
                        borderHighlightColor={this.props.borderHighlightColor}
                    />
                </Animated.View>
            );
        });
        return (
            <View style={[styles.calendarContainer, {backgroundColor: this.props.calendarColor}, this.props.style]}>
                <Text style={[styles.calendarHeader, this.props.calendarHeaderStyle]}>{this.formatCalendarHeader()}</Text>
                <View style={styles.datesStrip}>
                    <TouchableOpacity style={[styles.iconContainer, this.props.iconContainer]} onPress={this.getPreviousWeek}>
                        <Image style={[styles.icon, this.props.iconStyle, this.props.iconLeftStyle]} source={this.props.iconLeft}/>
                    </TouchableOpacity>
                    <View style={styles.calendarDates}>
                        {datesRender}
                    </View>
                    <TouchableOpacity style={[styles.iconContainer, this.props.iconContainer]} onPress={this.getNextWeek}>
                        <Image style={[styles.icon, this.props.iconStyle, this.props.iconRightStyle]} source={this.props.iconRight}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
