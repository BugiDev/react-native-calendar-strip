import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";

import moment from "moment";
import _ from "lodash";

import CalendarHeader from "../src/CalendarHeader";

const genDatesForWeek = startDate => {
  const day = moment(startDate);
  return _.map(_.range(7), i => day.clone().add(i, "days"));
};

describe("CalendarHeader Component", () => {
  it("should render without issues", () => {
    const component = shallow(
      <CalendarHeader
        datesForWeek={genDatesForWeek("2017-12-25")}
        calendarHeaderFormat="MMMM YYYY"
      />
    );

    expect(component.length).toBe(1);
    expect(toJson(component)).toMatchSnapshot();
  });

  it("should render December 2017", () => {
    const component = shallow(
      <CalendarHeader
        datesForWeek={genDatesForWeek("2017-12-25")}
        calendarHeaderFormat="MMMM YYYY"
      />
    );

    expect(component.props().children).toBe("December 2017");
    expect(toJson(component)).toMatchSnapshot();
  });

  it("should render January / February 2018", () => {
    const component = shallow(
      <CalendarHeader
        datesForWeek={genDatesForWeek("2018-01-29")}
        calendarHeaderFormat="MMMM YYYY"
      />
    );

    expect(component.props().children).toBe("January / February 2018");
    expect(toJson(component)).toMatchSnapshot();
  });

  it("should render December 2017 / January 2018", () => {
    const component = shallow(
      <CalendarHeader
        datesForWeek={genDatesForWeek("2017-12-30")}
        calendarHeaderFormat="MMMM YYYY"
      />
    );

    expect(component.props().children).toBe("December 2017 / January 2018");
    expect(toJson(component)).toMatchSnapshot();
  });

  it("should render Jan / Feb 2018", () => {
    const component = shallow(
      <CalendarHeader
        datesForWeek={genDatesForWeek("2018-01-29")}
        calendarHeaderFormat="MMM YYYY"
      />
    );

    expect(component.props().children).toBe("Jan / Feb 2018");
    expect(toJson(component)).toMatchSnapshot();
  });

  it("should render 01 / 02 2018", () => {
    const component = shallow(
      <CalendarHeader
        datesForWeek={genDatesForWeek("2018-01-29")}
        calendarHeaderFormat="MM YYYY"
      />
    );

    expect(component.props().children).toBe("01 / 02 2018");
    expect(toJson(component)).toMatchSnapshot();
  });

  it("should render 1 / 2 18", () => {
    const component = shallow(
      <CalendarHeader
        datesForWeek={genDatesForWeek("2018-01-29")}
        calendarHeaderFormat="M YYYY"
      />
    );

    expect(component.props().children).toBe("1 / 2 2018");
    expect(toJson(component)).toMatchSnapshot();
  });

  it("should render 1st / 2nd 18", () => {
    const component = shallow(
      <CalendarHeader
        datesForWeek={genDatesForWeek("2018-01-29")}
        calendarHeaderFormat="Mo YY"
      />
    );

    expect(component.props().children).toBe("1st / 2nd 18");
    expect(toJson(component)).toMatchSnapshot();
  });

  it("should render in Comic Sans", () => {
    const component = shallow(
      <CalendarHeader
        datesForWeek={genDatesForWeek("2017-12-30")}
        calendarHeaderFormat="MMMM YYYY"
        calendarHeaderStyle={{ fontFamily: "ComicSans" }}
      />
    );

    const styles = component.props().style;
    let thisStyle;
    for (let i = 0; i < styles.length; i++) {
      if (styles[i] && styles[i].hasOwnProperty("fontFamily")) {
        thisStyle = styles[i].fontFamily;
      }
    }

    expect(thisStyle).toBe("ComicSans");
    expect(toJson(component)).toMatchSnapshot();
  });

  it("should render in a red color", () => {
    const component = shallow(
      <CalendarHeader
        datesForWeek={genDatesForWeek("2017-12-30")}
        calendarHeaderFormat="MMMM YYYY"
        calendarHeaderStyle={{ color: "red" }}
      />
    );

    const styles = component.props().style;
    let thisStyle;
    for (let i = 0; i < styles.length; i++) {
      if (styles[i] && styles[i].hasOwnProperty("color")) {
        thisStyle = styles[i].color;
      }
    }

    expect(thisStyle).toBe("red");
    expect(toJson(component)).toMatchSnapshot();
  });
});
