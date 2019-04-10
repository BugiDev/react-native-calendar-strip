import { Component } from 'react';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';

declare module 'react-native-calendar-strip' {
  type dateRange = {
    start: Date;
    end: Date;
  };
  
  class ReactNativeCalendarStrip extends Component<
    {
      style: StyleProp<ViewStyle>;
      innerStyle?: StyleProp<ViewStyle>;
      calendarColor?: string;

      startingDate: Date;
      selectedDate: Date;
      onDateSelected: (date: Date) => void;
      onWeekChanged?: (date: Date) => void;
      updateWeek?: boolean;
      useIsoWeekday?: boolean;
      minDate: Date;
      maxDate: Date;
      datesWhitelist?: dateRange[];
      datesBlacklist?: dateRange[];

      showMonth?: boolean;
      showDayName?: boolean;
      showDayNumber?: boolean;
      showDate?: boolean;

      leftSelector?: any;
      rightSelector?: any;
      iconLeft?: any;
      iconRight?: any;
      iconStyle?: any;
      iconLeftStyle?: any;
      iconRightStyle?: any;
      iconContainer?: any;

      maxDayComponentSize?: number;
      minDayComponentSize?: number;
      responsiveSizingOffset?: number;

      calendarHeaderContainerStyle: StyleProp<ViewStyle>;
      calendarHeaderStyle: StyleProp<TextStyle>;
      calendarHeaderFormat?: string;
      calendarHeaderPosition?: 'below' | 'above';

      calendarAnimation: {
        duration: number;
        type: 'sequence' | 'parallel';
      };
      daySelectionAnimation:
        | {
            type: 'background';
            duration: number;
            highlightColor: string;
            animType: any;
            animUpdateType: any;
            animProperty: any;
            animSpringDamping: any;
          }
        | {
            type: 'border';
            duration: number;
            borderWidth: number;
            borderHighlightColor: string;
            animType: any;
            animUpdateType: any;
            animProperty: any;
            animSpringDamping: any;
          };

      customDatesStyles: any[];

      dateNameStyle: StyleProp<TextStyle>;
      dateNumberStyle: StyleProp<TextStyle>;
      weekendDateNameStyle: StyleProp<TextStyle>;
      weekendDateNumberStyle: StyleProp<TextStyle>;
      highlightDateNameStyle: StyleProp<TextStyle>;
      highlightDateNumberStyle: StyleProp<TextStyle>;
      disabledDateNameStyle: StyleProp<TextStyle>;
      disabledDateNumberStyle: StyleProp<TextStyle>;
      disabledDateOpacity: number;
      styleWeekend: boolean;

      locale: object;
      shouldAllowFontScaling: boolean;
    },
    {}
  > {}

  export = ReactNativeCalendarStrip;
}
