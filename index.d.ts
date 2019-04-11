import { Component, ReactNode } from "react";
import { Duration } from "moment";
import {
  StyleProp,
  ViewStyle,
  TextStyle,
  GestureResponderEvent
} from "react-native";

declare module "react-native-calendar-strip" {
  interface IDaySelectionAnimationBorder {
    type: "border";
    duration: number;
    borderWidth: number;
    borderHighlightColor: string;
    animType: any;
    animUpdateType: any;
    animProperty: any;
    animSpringDamping: any;
  }

  interface IDaySelectionAnimationBackground {
    type: "background";
    duration: number;
    highlightColor: string;
    animType: any;
    animUpdateType: any;
    animProperty: any;
    animSpringDamping: any;
  }

  interface IDayComponentProps {
    date: Duration;
    marking: any;
    selected: boolean;
    enabled: boolean;
    showDayName: boolean;
    showDayNumber: boolean;
    onDateSelected: (event: GestureResponderEvent) => void;
    calendarColor: string;
    dateNameStyle: string;
    dateNumberStyle: string;
    weekendDateNameStyle: TextStyle;
    weekendDateNumberStyle: TextStyle;
    highlightDateNameStyle: TextStyle;
    highlightDateNumberStyle: TextStyle;
    disabledDateNameStyle: TextStyle;
    disabledDateNumberStyle: TextStyle;
    markedDatesStyle: TextStyle;
    disabledDateOpacity: number;
    styleWeekend: boolean;
    daySelectionAnimation: TDaySelectionAnimation;
    customStyle: ViewStyle;
    size: number;
    allowDayTextScaling: boolean;
    markedDates: [];
  }

  type TDaySelectionAnimation =
    | IDaySelectionAnimationBorder
    | IDaySelectionAnimationBackground;

  type TDateRange = {
    start: Date;
    end: Date;
  };

  class ReactNativeCalendarStrip extends Component<
    {
      style: StyleProp<ViewStyle>;
      innerStyle?: StyleProp<ViewStyle>;
      calendarColor?: string;

      startingDate?: Date;
      selectedDate?: Date;
      onDateSelected?: (date: Date) => void;
      onWeekChanged?: (date: Date) => void;
      updateWeek?: boolean;
      useIsoWeekday?: boolean;
      minDate?: Date;
      maxDate?: Date;
      datesWhitelist?: TDateRange[];
      datesBlacklist?: TDateRange[];

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

      calendarHeaderContainerStyle?: StyleProp<ViewStyle>;
      calendarHeaderStyle?: StyleProp<TextStyle>;
      calendarHeaderFormat?: string;
      calendarHeaderPosition?: "below" | "above";

      calendarAnimation?: {
        duration: number;
        type: "sequence" | "parallel";
      };
      daySelectionAnimation?: TDaySelectionAnimation;

      customDatesStyles?: any[];

      dayComponent?: (props: IDayComponentProps) => ReactNode;

      dateNameStyle?: StyleProp<TextStyle>;
      dateNumberStyle?: StyleProp<TextStyle>;
      weekendDateNameStyle?: StyleProp<TextStyle>;
      weekendDateNumberStyle?: StyleProp<TextStyle>;
      highlightDateNameStyle?: StyleProp<TextStyle>;
      highlightDateNumberStyle?: StyleProp<TextStyle>;
      disabledDateNameStyle?: StyleProp<TextStyle>;
      disabledDateNumberStyle?: StyleProp<TextStyle>;
      disabledDateOpacity?: number;
      styleWeekend?: boolean;

      locale?: object;
      shouldAllowFontScaling?: boolean;
    },
    {}
  > {}

  export = ReactNativeCalendarStrip;
}
