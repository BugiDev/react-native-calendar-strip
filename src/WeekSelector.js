import React, { Component } from "react";
import PropTypes from "prop-types";
import { Image, TouchableOpacity } from "react-native";

import moment from "moment";

import styles from "./Calendar.style.js";

class WeekSelector extends Component {
  static propTypes = {
    controlDate: PropTypes.object,
    iconComponent: PropTypes.any,
    iconContainerStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number
    ]),
    iconInstanceStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number
    ]),
    iconStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
      PropTypes.array
    ]),
    imageSource: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    onPress: PropTypes.func,
    weekStartDate: PropTypes.object,
    weekEndDate: PropTypes.object
  };

  shouldComponentUpdate(nextProps) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps);
  }

  isEnabled(controlDate, weekStartDate, weekEndDate) {
    if (controlDate) {
      return !moment(controlDate).isBetween(
        weekStartDate,
        weekEndDate,
        "day",
        "[]"
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
        style: [iconComponent.props.style, { opacity: opacity.opacity }]
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
