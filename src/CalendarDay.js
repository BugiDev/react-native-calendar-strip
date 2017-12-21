/**
 * Created by bogdanbegovic on 8/20/16.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";

import { Text, View, LayoutAnimation, TouchableOpacity } from "react-native";
import styles from "./Calendar.style.js";

export default class CalendarDay extends Component {
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

    daySelectionAnimation: PropTypes.object
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

  componentWillReceiveProps(nextProps) {
    newState = {};
    let doStateUpdate = false;

    if (this.state.selected !== nextProps.selected) {
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
      newState.selected = nextProps.selected;
      doStateUpdate = true;
    }

    if (nextProps.size !== this.props.size) {
      newState = { ...newState, ...this.calcSizes(nextProps) };
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
    let dateNameStyle = [styles.dateName, this.props.disabledDateNameStyle];
    let dateNumberStyle = [
      styles.dateNumber,
      this.props.disabledDateNumberStyle
    ];
    let dateViewStyle = this.props.enabled
      ? []
      : [{ opacity: this.props.disabledDateOpacity }];
    let customStyle = this.props.customStyle;

    if (customStyle) {
      dateNameStyle = [styles.dateName, customStyle.dateNameStyle];
      dateNumberStyle = [styles.dateNumber, customStyle.dateNumberStyle];
      dateViewStyle.push(customStyle.dateContainerStyle);
    } else if (this.props.enabled) {
      // Enabled state
      //The user can disable animation, so that is why I use selection type
      //If it is background, the user have to input colors for animation
      //If it is border, the user has to input color for border animation
      switch (this.props.daySelectionAnimation.type) {
        case "background":
          let dateViewBGColor = this.state.selected
            ? this.props.daySelectionAnimation.highlightColor
            : "transparent";
          dateViewStyle = { backgroundColor: dateViewBGColor };
          break;
        case "border":
          let dateViewBorderWidth = this.state.selected
            ? this.props.daySelectionAnimation.borderWidth
            : 0;
          dateViewStyle = {
            borderColor: this.props.daySelectionAnimation.borderHighlightColor,
            borderWidth: dateViewBorderWidth
          };
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
            >
              {this.props.date.format("ddd").toUpperCase()}
            </Text>
          )}
          {this.props.showDayNumber && (
            <Text
              style={[
                dateNumberStyle,
                { fontSize: this.state.dateNumberFontSize }
              ]}
            >
              {this.props.date.date()}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}
