import React, { Component } from 'react';
import { Image, TouchableOpacity } from 'react-native';

import moment from 'moment';

import styles from './Calendar.style.js';

class WeekSelector extends Component {
    static propTypes = {
        controlDate: React.PropTypes.object,
        iconComponent: React.PropTypes.any,
        iconContainerStyle: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.number
        ]),
        iconInstanceStyle: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.number
        ]),
        iconStyle: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.number,
            React.PropTypes.array
        ]),
        imageSource: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.number
        ]),
        onPress: React.PropTypes.func,
        weekStartDate: React.PropTypes.object,
        weekEndDate: React.PropTypes.object
    };

    shouldComponentUpdate(nextProps) {
        return JSON.stringify(this.props) !== JSON.stringify(nextProps);
    }

    isEnabled(controlDate, weekStartDate, weekEndDate) {
        if (controlDate) {
            return !moment(controlDate).isBetween(
                weekStartDate,
                weekEndDate,
                'day',
                '[]'
            );
        }
        return true;
    }

    render() {
        const {
            controlDate,
            iconContainerStyle,
            iconComponent,
            iconInstanceStyle,
            iconStyle,
            imageSource,
            onPress,
            weekEndDate,
            weekStartDate
        } = this.props;

        const enabled = this.isEnabled(controlDate, weekStartDate, weekEndDate);
        const opacity = { opacity: enabled ? 1 : 0 };

        let component;
        if (React.Component.isPrototypeOf(iconComponent)) {
            component = React.cloneElement(iconComponent, {
                style: [ iconComponent.props.style, { opacity: opacity.opacity } ]
            });
        } else if (Array.isArray(iconComponent)) {
            component = iconComponent;
        } else {
            component = (
                <Image
                    style={[styles.icon, iconStyle, iconInstanceStyle, opacity]}
                    source={imageSource}
                />
            );
        }

        return (
            <TouchableOpacity
                style={[styles.iconContainer, iconContainerStyle]}
                onPress={onPress}
                disabled={!enabled}
            >
                {component}
            </TouchableOpacity>
        );
    }
}

export default WeekSelector;
