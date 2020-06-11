import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
import moment from "moment";

import WeekSelector from "../src/WeekSelector";

Enzyme.configure({ adapter: new Adapter() });

const today = moment();

describe("WeekSelector Component", () => {
  it("should render without issues", () => {
    const component = shallow(
      <WeekSelector
        controlDate={today}
        weekStartDate={today}
        weekEndDate={today.clone().add(1, "week")}
        size={50}
      />
    );

    expect(component).toBeTruthy();
  });

});
