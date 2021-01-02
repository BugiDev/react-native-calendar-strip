import { Component, ReactNode, ComponentProps } from "react";
import { Duration, Moment } from "moment";
import {
  StyleProp,
  ViewStyle,
  TextStyle,
  GestureResponderEvent
} from "react-native";
import { RecyclerListView } from 'recyclerlistview';

interface IDaySelectionAnimationBorder {
  type: "border";
  duration: number;
  borderWidth: number;
  borderHighlightColor: string;
  animType?: any;
  animUpdateType?: any;
  animProperty?: any;
  animSpringDamping?: any;
}

interface IDaySelectionAnimationBackground {
  type: "background";
  duration: number;
  highlightColor: string;
  animType?: any;
  animUpdateType?: any;
  animProperty?: any;
  animSpringDamping?: any;
}

interface IDayComponentProps {
  date: Duration;
  marking?: any;
  selected?: boolean;
  enabled: boolean;
  showDayName?: boolean;
  showDayNumber?: boolean;
  onDateSelected?: (event: GestureResponderEvent) => void;
  calendarColor?: string;
  dateNameStyle?: string;
  dateNumberStyle?: string;
  dayContainerStyle?: StyleProp<ViewStyle>;
  weekendDateNameStyle?: TextStyle;
  weekendDateNumberStyle?: TextStyle;
  highlightDateNameStyle?: TextStyle;
  highlightDateNumberStyle?: TextStyle;
  disabledDateNameStyle?: TextStyle;
  disabledDateNumberStyle?: TextStyle;
  styleWeekend?: boolean;
  daySelectionAnimation?: TDaySelectionAnimation;
  customStyle?: ViewStyle;
  size: number;
  allowDayTextScaling?: boolean;
  markedDatesStyle?: TextStyle;
  markedDates?: any[] | ((date: Moment) => void);
}

type TDaySelectionAnimation =
  | IDaySelectionAnimationBorder
  | IDaySelectionAnimationBackground;

type TDateRange = {
  start: Moment;
  end: Moment;
};

interface CalendarStripProps {
  style: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
  calendarColor?: string;

  numDaysInWeek?: number;
  scrollable?: boolean;
  externalScrollView?: ComponentProps<typeof RecyclerListView>['externalScrollView'];
  startingDate?: Moment;
  selectedDate?: Moment;
  onDateSelected?: ((date: Moment) => void);
  onWeekChanged?: ((start: Moment, end: Moment) => void);
  onHeaderSelected?: ((dates: {weekStartDate: Moment, weekEndDate: Moment}) => void);
  updateWeek?: boolean;
  useIsoWeekday?: boolean;
  minDate?: Moment;
  maxDate?: Moment;
  datesWhitelist?: TDateRange[] | ((date: Moment) => void);
  datesBlacklist?: TDateRange[] | ((date: Moment) => void);
  markedDates?: any[] | ((date: Moment) => void);
  scrollToOnSetSelectedDate?: boolean;

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

  customDatesStyles?: any[] | ((date: Moment) => void);

  dayComponent?: (props: IDayComponentProps) => ReactNode;

  dateNameStyle?: StyleProp<TextStyle>;
  dateNumberStyle?: StyleProp<TextStyle>;
  weekendDateNameStyle?: StyleProp<TextStyle>;
  weekendDateNumberStyle?: StyleProp<TextStyle>;
  highlightDateNameStyle?: StyleProp<TextStyle>;
  highlightDateNumberStyle?: StyleProp<TextStyle>;
  disabledDateNameStyle?: StyleProp<TextStyle>;
  disabledDateNumberStyle?: StyleProp<TextStyle>;
  markedDatesStyle?: StyleProp<TextStyle>;
  disabledDateOpacity?: number;
  styleWeekend?: boolean;

  locale?: object;
  shouldAllowFontScaling?: boolean;
  useNativeDriver?: boolean;
}

export default class ReactNativeCalendarStrip extends Component<CalendarStripProps> {
  getSelectedDate: () => undefined | Date | string;
  setSelectedDate: (date: Moment | string) => void;
  getNextWeek: () => void;
  getPreviousWeek: () => void;
  updateWeekView: (date: Moment | string) => void;
}
