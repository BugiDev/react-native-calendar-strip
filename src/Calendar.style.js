/**
 * Created by bogdanbegovic on 8/26/16.
 */

import { StyleSheet } from "react-native";

export default StyleSheet.create({
  //CALENDAR STYLES
  calendarContainer: {
    overflow: "visible",
    fontFamily: "Montserrat"
  },
  datesStrip: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    fontFamily: "Montserrat"
  },
  calendarDates: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Montserrat"
  },
  calendarHeader: {
    textAlign: "center",
    fontWeight: "bold",
    alignSelf: "center",
    flexDirection: "row",
    fontFamily: "Montserrat"
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  icon: {
    resizeMode: "contain"
  },
  calendarIcon: {
    marginLeft: 5
  },

  //CALENDAR DAY
  dateContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    fontFamily: "Montserrat"
  },
  dateName: {
    textAlign: "center",
    fontFamily: "Montserrat"
  },
  weekendDateName: {
    color: "#A7A7A7",
    textAlign: "center",
    fontFamily: "Montserrat"
  },
  dateNumber: {
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Montserrat"
  },
  weekendDateNumber: {
    color: "#A7A7A7",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Montserrat"
  },
  dot: {
    width: 6,
    height: 6,
    marginTop: 1,
    borderRadius: 5,
    opacity: 0
  },

  // CALENDAR DOTS
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  visibleDot: {
    opacity: 1,
    backgroundColor: 'blue'
  },
  selectedDot: {
    backgroundColor: 'blue'
  },
});
