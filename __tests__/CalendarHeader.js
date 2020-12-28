import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import moment from "moment";

import CalendarHeader from "../src/CalendarHeader";

configure({ adapter: new Adapter() });

const today = moment();

describe("CalendarHeader Component", () => {
  it("should render without issues", () => {
    const component = shallow(
      <CalendarHeader
        calendarHeaderFormat="MMMM YYYY"
        weekStartDate={today}
        weekEndDate={today.clone().add(1, "week")}
        fontSize={20}
        allowHeaderTextScaling={true}
      />
    );

    expect(component).toBeTruthy();
  });

  it("should render custom header without issues", () => {
    const component = shallow(
      <CalendarHeader
        calendarHeaderFormat="MMMM YYYY"
        weekStartDate={today}
        weekEndDate={today.clone().add(1, "week")}
        fontSize={20}
        allowHeaderTextScaling={true}
        headerText={"Custom Header"}
      />
    );

    expect(component).toBeTruthy();
  });
});
