/**
 * Created by bogdanbegovic on 8/20/16.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Animated,
    Easing,
    TouchableOpacity
} from 'react-native';
import styles from './Calendar.style.js';

export default class CalendarDay extends Component {

    static propTypes = {
        date: React.PropTypes.object.isRequired,
        onDateSelected: React.PropTypes.func.isRequired,
        selected: React.PropTypes.bool.isRequired,

        calendarColor: React.PropTypes.string,
        highlightColor: React.PropTypes.string,
        borderHighlightColor: React.PropTypes.string,

        dateNameStyle: React.PropTypes.any,
        dateNumberStyle: React.PropTypes.any,
        weekendDateNameStyle: React.PropTypes.any,
        weekendDateNumberStyle: React.PropTypes.any,

        selection: React.PropTypes.string,
        selectionAnimation: React.PropTypes.object
    };

    static defaultProps = {
        selection: 'border',
        selectionAnimation: {
            duration: 0,
            borderWidth: 1
        },
        borderHighlightColor: '#000'
    };

    constructor(props) {
        super(props);
        this.animValue = new Animated.Value(0);
    }

    //When component mounts, if it is seleced run animation for animation show
    componentDidMount() {
        if (this.props.selected) {
            this.animate(1);
        }
    }

    //When component receives the props, if it is selected use showing animation
    //If it is deselected, use hiding animation
    componentWillReceiveProps(nextProps) {
        if (this.props.selected !== nextProps.selected) {
            nextProps.selected ? this.animate(1) : this.animate(0);
        }
    }

    //Animation function for showin/hiding the element.
    //Based on the value passed (either 1 or 0) the animate function is animatin towards that value, hence showin or hiding animation
    animate(toValue) {
        Animated.timing(
            this.animValue,
            {
                toValue: toValue,
                duration: this.props.selectionAnimation.duration,
                easing: Easing.linear
            }
        ).start();
    }

    render() {
        let animValue;
        let animObject;
        //The user can disable animation, so that is why I use selection type
        //If it is background, the user have to input colors for animation
        //If it is border, the user has to input color for border animation
        if (this.props.selection === 'background') {
            animValue = this.animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [this.props.calendarColor, this.props.highlightColor]
            });
            animObject = {backgroundColor: animValue};
        } else {
            if (this.props.selection === 'border') {
                animValue = this.animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, this.props.selectionAnimation.borderWidth]
                });
                animObject = {borderColor: this.props.borderHighlightColor, borderWidth: animValue};
            } else {
                throw new Error('CalendarDay Error! Type of animation is incorrect!');
            }
        }

        let dateNameStyle = [styles.dateName, this.props.dateNameStyle];
        let dateNumberStyle = [styles.dateNumber, this.props.dateNumberStyle];
        if (this.props.date.isoWeekday() === 6 || this.props.date.isoWeekday() === 7) {
            dateNameStyle = [styles.weekendDateName, this.props.weekendDateNameStyle];
            dateNumberStyle = [styles.weekendDateNumber, this.props.weekendDateNumberStyle];
        }

        return (
            <Animated.View style={[styles.dateContainer, animObject]}>
                <TouchableOpacity onPress={this.props.onDateSelected.bind(this, this.props.date)}>
                    <Text style={dateNameStyle}>{this.props.date.format('ddd').toUpperCase()}</Text>
                    <Text style={dateNumberStyle}>{this.props.date.date()}</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    }
}
