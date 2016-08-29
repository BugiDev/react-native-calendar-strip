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

const arr = [];
for (let i = 0; i < 7; i++) {
    arr.push(i);
}

export default class CalendarStrip extends Component {

    static propTypes = {
        style: React.PropTypes.any,
        calendarColor: React.PropTypes.string,
        highlightColor: React.PropTypes.string,
        borderHighlightColor: React.PropTypes.string,

        startingDate: React.PropTypes.any,
        selectedDate: React.PropTypes.any,
        onDateSelected: React.PropTypes.func,

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
        weekendDateNumberStyle: React.PropTypes.any
    };

    static defaultProps = {
        startingDate: moment(),
        iconLeft: require('./img/left-arrow-black.png'),
        iconRight: require('./img/right-arrow-black.png'),
        calendarHeaderFormat: 'MMMM YYYY'
    };

    constructor(props) {
        super(props);
        this.state = {
            startingDate: this.props.startingDate,
            selectedDate: this.props.selectedDate
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

    componentDidMount() {
        this.animate();
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.selectedDate === this.state.selectedDate) {
            this.resetAnimation();
            this.animate();
        }
    }

    getPreviousWeek() {
        this.setState({startingDate: this.state.startingDate.subtract(1, 'w')});
    }

    getNextWeek() {
        this.setState({startingDate: this.state.startingDate.add(1, 'w')});
    }

    getDatesForWeek() {
        let dates = [];
        arr.forEach((item, index) => {
            dates.push(moment(this.state.startingDate.isoWeekday(index + 1)));
        });
        return dates;
    }

    onDateSelected(date) {
        this.setState({selectedDate: date});
        if (this.props.onDateSelected) {
            this.props.onDateSelected(date);
        }
    }

    isDateSelected(date) {
        return date.isSame(this.state.selectedDate, 'day');
    }

    resetAnimation() {
        this.animatedValue = [];
        arr.forEach((value) => {
            this.animatedValue[value] = new Animated.Value(0);
        });
    }

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

            if (this.props.calendarAnimation.type === 'sequence') {
                Animated.sequence(animations).start();
            } else {
                if (this.props.calendarAnimation.type === 'parallel') {
                    Animated.parallel(animations).start();
                } else {
                    throw new Error('CalendarStrip Error! Type of animation is incorrect!');
                }
            }
        }
    }

    formatCalendarHeader() {
        let firstDay = this.getDatesForWeek()[0];
        let lastDay = this.getDatesForWeek()[this.getDatesForWeek().length - 1];
        let monthFormatting = '';
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
        let opacityAnim = 0;
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
            <View style={[styles.calendarContainer, this.props.style, {backgroundColor: this.props.calendarColor}]}>
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
