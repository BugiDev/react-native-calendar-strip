/**
 * Created by bogdanbegovic on 8/20/16.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import {polyfill} from 'react-lifecycles-compat';

import { Text, View, LayoutAnimation, TouchableOpacity } from "react-native";
import styles from "./Calendar.style.js";

class CalendarDay extends Component {
  static propTypes = {
    date: PropTypes.object.isRequired,
    onDateSelected: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired,
    enabled: PropTypes.bool.isRequired,

    showDayName: PropTypes.bool,
    showDayNumber: PropTypes.bool,

    calendarColor: PropTypes.string,

    dateNameStyle: PropTypes.any,
    dateNumberStyle: PropTypes.any,
    weekendDateNameStyle: PropTypes.any,
    weekendDateNumberStyle: PropTypes.any,
    highlightDateNameStyle: PropTypes.any,
    highlightDateNumberStyle: PropTypes.any,
    disabledDateNameStyle: PropTypes.any,
    disabledDateNumberStyle: PropTypes.any,
    disabledDateOpacity: PropTypes.number,
    styleWeekend: PropTypes.bool,
    customStyle: PropTypes.object,

    daySelectionAnimation: PropTypes.object,
    allowDayTextScaling: PropTypes.bool
  };

  // Reference: https://medium.com/@Jpoliachik/react-native-s-layoutanimation-is-awesome-4a4d317afd3e
  static defaultProps = {
    daySelectionAnimation: {
      type: "", // animations disabled by default
      duration: 300,
      borderWidth: 1,
      borderHighlightColor: "black",
      highlightColor: "yellow",
      animType: LayoutAnimation.Types.easeInEaseOut,
      animUpdateType: LayoutAnimation.Types.easeInEaseOut,
      animProperty: LayoutAnimation.Properties.opacity,
      animSpringDamping: undefined // Only applicable for LayoutAnimation.Types.spring,
    },
    styleWeekend: true,
    showDayName: true,
    showDayNumber: true
  };

  constructor(props) {
    super(props);

    this.state = {
      selected: props.selected,
      ...this.calcSizes(props)
    };
  }

  componentDidUpdate(prevProps, prevState) {
    newState = {};
    let doStateUpdate = false;

    if (this.props.selected !== prevProps.selected) {
      if (this.props.daySelectionAnimation.type !== "") {
        let configurableAnimation = {
          duration: this.props.daySelectionAnimation.duration || 300,
          create: {
            type:
              this.props.daySelectionAnimation.animType ||
              LayoutAnimation.Types.easeInEaseOut,
            property:
              this.props.daySelectionAnimation.animProperty ||
              LayoutAnimation.Properties.opacity
          },
          update: {
            type:
              this.props.daySelectionAnimation.animUpdateType ||
              LayoutAnimation.Types.easeInEaseOut,
            springDamping: this.props.daySelectionAnimation.animSpringDamping
          },
          delete: {
            type:
              this.props.daySelectionAnimation.animType ||
              LayoutAnimation.Types.easeInEaseOut,
            property:
              this.props.daySelectionAnimation.animProperty ||
              LayoutAnimation.Properties.opacity
          }
        };
        LayoutAnimation.configureNext(configurableAnimation);
      }
      newState.selected = this.props.selected;
      doStateUpdate = true;
    }

    if (prevProps.size !== this.props.size) {
      newState = { ...newState, ...this.calcSizes(this.props) };
      doStateUpdate = true;
    }

    if (doStateUpdate) {
      this.setState(newState);
    }
  }

  calcSizes(props) {
    return {
      containerSize: Math.round(props.size),
      containerPadding: Math.round(props.size / 5),
      containerBorderRadius: Math.round(props.size / 2),
      dateNameFontSize: Math.round(props.size / 5),
      dateNumberFontSize: Math.round(props.size / 2.9)
    };
  }

  render() {
    // Defaults for disabled state
    let dateNameStyle = [styles.dateName, this.props.enabled ? this.props.dateNameStyle : this.props.disabledDateNameStyle];
    let dateNumberStyle = [styles.dateNumber, this.props.enabled ? this.props.dateNumberStyle : this.props.disabledDateNumberStyle];
    let dateViewStyle = this.props.enabled
      ? [{ backgroundColor: "transparent" }]
      : [{ opacity: this.props.disabledDateOpacity }];

    let customStyle = this.props.customStyle;
    if (customStyle) {
      dateNameStyle.push(customStyle.dateNameStyle);
      dateNumberStyle.push(customStyle.dateNumberStyle);
      dateViewStyle.push(customStyle.dateContainerStyle);
    }
    if (this.props.enabled && this.state.selected) {
      // Enabled state
      //The user can disable animation, so that is why I use selection type
      //If it is background, the user have to input colors for animation
      //If it is border, the user has to input color for border animation
      switch (this.props.daySelectionAnimation.type) {
        case "background":
          dateViewStyle.push({ backgroundColor: this.props.daySelectionAnimation.highlightColor });
          break;
        case "border":
          dateViewStyle.push({
            borderColor: this.props.daySelectionAnimation.borderHighlightColor,
            borderWidth: this.props.daySelectionAnimation.borderWidth
          });
          break;
        default:
          // No animation styling by default
          break;
      }

      dateNameStyle = [styles.dateName, this.props.dateNameStyle];
      dateNumberStyle = [styles.dateNumber, this.props.dateNumberStyle];
      if (
        this.props.styleWeekend &&
        (this.props.date.isoWeekday() === 6 ||
          this.props.date.isoWeekday() === 7)
      ) {
        dateNameStyle = [
          styles.weekendDateName,
          this.props.weekendDateNameStyle
        ];
        dateNumberStyle = [
          styles.weekendDateNumber,
          this.props.weekendDateNumberStyle
        ];
      }
      if (this.state.selected) {
        dateNameStyle = [styles.dateName, this.props.highlightDateNameStyle];
        dateNumberStyle = [
          styles.dateNumber,
          this.props.highlightDateNumberStyle
        ];
      }
    }

    let responsiveDateContainerStyle = {
      width: this.state.containerSize,
      height: this.state.containerSize,
      borderRadius: this.state.containerBorderRadius,
      padding: this.state.containerPadding
    };

    return (
      <TouchableOpacity
        onPress={this.props.onDateSelected.bind(this, this.props.date)}
      >
        <View
          key={this.props.date}
          style={[
            styles.dateContainer,
            responsiveDateContainerStyle,
            dateViewStyle
          ]}
        >
          {this.props.showDayName && (
            <Text
              style={[dateNameStyle, { fontSize: this.state.dateNameFontSize }]}
              allowFontScaling={this.props.allowDayTextScaling}
            >
              {this.props.date.format("ddd").toUpperCase()}
            </Text>
          )}
          {this.props.showDayNumber && (
            <Text
              style={[
                  { fontSize: this.state.dateNumberFontSize },
                  dateNumberStyle
              ]}
              allowFontScaling={this.props.allowDayTextScaling}
            >
              {this.props.date.date()}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

polyfill(CalendarDay);

export default CalendarDay;
