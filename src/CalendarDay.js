/**
 * Created by bogdanbegovic on 8/20/16.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    LayoutAnimation,
    Easing,
    TouchableOpacity
} from 'react-native';
import styles from './Calendar.style.js';

export default class CalendarDay extends Component {

    static propTypes = {
        date: React.PropTypes.object.isRequired,
        onDateSelected: React.PropTypes.func.isRequired,
        selected: React.PropTypes.bool.isRequired,
        enabled: React.PropTypes.bool.isRequired,

        showDayName: React.PropTypes.bool,
        showDayNumber: React.PropTypes.bool,

        calendarColor: React.PropTypes.string,

        dateNameStyle: React.PropTypes.any,
        dateNumberStyle: React.PropTypes.any,
        weekendDateNameStyle: React.PropTypes.any,
        weekendDateNumberStyle: React.PropTypes.any,
        highlightDateNameStyle: React.PropTypes.any,
        highlightDateNumberStyle: React.PropTypes.any,
        disabledDateNameStyle: React.PropTypes.any,
        disabledDateNumberStyle: React.PropTypes.any,
        styleWeekend: React.PropTypes.bool,

        daySelectionAnimation: React.PropTypes.object
    };

    // Reference: https://medium.com/@Jpoliachik/react-native-s-layoutanimation-is-awesome-4a4d317afd3e
    static defaultProps = {
        daySelectionAnimation: {
          type: '',  // animations disabled by default
          duration: 300,
          borderWidth: 1,
          borderHighlightColor: 'black',
          highlightColor: 'yellow',
          animType: LayoutAnimation.Types.easeInEaseOut,
          animUpdateType: LayoutAnimation.Types.easeInEaseOut,
          animProperty: LayoutAnimation.Properties.opacity,
          animSpringDamping: undefined,  // Only applicable for LayoutAnimation.Types.spring,
        },
        styleWeekend: true,
        showDayName: true,
        showDayNumber: true,
  };

    constructor(props) {
        super(props);

        this.state = {
          selected: props.selected
        }
    }

    componentWillReceiveProps(nextProps) {
      if (this.state.selected !== nextProps.selected) {
        if (this.props.daySelectionAnimation.type !== '') {
          let configurableAnimation = {
            duration: this.props.daySelectionAnimation.duration || 300,
            create: {
              type: this.props.daySelectionAnimation.animType || LayoutAnimation.Types.easeInEaseOut,
              property: this.props.daySelectionAnimation.animProperty || LayoutAnimation.Properties.opacity,
            },
            update: {
              type: this.props.daySelectionAnimation.animUpdateType || LayoutAnimation.Types.easeInEaseOut,
              springDamping: this.props.daySelectionAnimation.animSpringDamping
            },
            delete: {
              type: this.props.daySelectionAnimation.animType || LayoutAnimation.Types.easeInEaseOut,
              property: this.props.daySelectionAnimation.animProperty || LayoutAnimation.Properties.opacity,
            },
          };
          LayoutAnimation.configureNext(configurableAnimation);
        }

        this.setState({ selected: nextProps.selected});
      }
    }

    render() {
        let dateViewStyle;
        let dateNameStyle = [styles.dateName, this.props.disabledDateNameStyle];
        let dateNumberStyle = [styles.dateNumber, this.props.disabledDateNumberStyle];

        if (this.props.enabled) {
          //The user can disable animation, so that is why I use selection type
          //If it is background, the user have to input colors for animation
          //If it is border, the user has to input color for border animation
          switch (this.props.daySelectionAnimation.type) {
            case 'background':
              let dateViewBGColor = this.state.selected ? this.props.daySelectionAnimation.highlightColor : this.props.calendarColor;
              dateViewStyle = {backgroundColor: dateViewBGColor};
              break;
            case 'border':
              let dateViewBorderWidth = this.state.selected ? this.props.daySelectionAnimation.borderWidth : 0;
              dateViewStyle = {borderColor: this.props.daySelectionAnimation.borderHighlightColor, borderWidth: dateViewBorderWidth};
              break;
            default:
              // No animation styling by default
              break;
          }

          dateNameStyle = [styles.dateName, this.props.dateNameStyle];
          dateNumberStyle = [styles.dateNumber, this.props.dateNumberStyle];
          if (this.props.styleWeekend && (this.props.date.isoWeekday() === 6 || this.props.date.isoWeekday() === 7)) {
              dateNameStyle = [styles.weekendDateName, this.props.weekendDateNameStyle];
              dateNumberStyle = [styles.weekendDateNumber, this.props.weekendDateNumberStyle];
          }
          if (this.state.selected) {
            dateNameStyle = [styles.dateName, this.props.highlightDateNameStyle];
            dateNumberStyle = [styles.dateNumber, this.props.highlightDateNumberStyle];
          }
        }

        return (
          <TouchableOpacity onPress={this.props.onDateSelected.bind(this, this.props.date)}>
            <View key={this.props.date} style={[styles.dateContainer, dateViewStyle]}>
              { this.props.showDayName &&
                <Text style={dateNameStyle}>{this.props.date.format('ddd').toUpperCase()}</Text>
              }
              { this.props.showDayNumber &&
                <Text style={dateNumberStyle}>{this.props.date.date()}</Text>
              }
            </View>
          </TouchableOpacity>
        );
    }
}
