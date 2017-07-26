import React from "react";
import { Image, Text } from "react-native";

import { shallow } from "enzyme";
import toJson from "enzyme-to-json";

import moment from "moment";
import _ from "lodash";

import WeekSelector from "../src/WeekSelector";
import defaultStyles from "../src/Calendar.style.js";

const genDatesForWeek = startDate => {
  const day = moment(startDate);
  return _.map(_.range(7), i => day.clone().add(i, "days"));
};

describe("WeekSelector Component", () => {
  it("should render without issues", () => {
    const component = shallow(
      <WeekSelector imageSource={require("./img/left-arrow-black.png")} />
    );

    expect(component.length).toBe(1);
    expect(toJson(component)).toMatchSnapshot();
  });

  it("should have onPress event", () => {
    const onPress = jest.fn();
    const component = shallow(
      <WeekSelector
        imageSource={require("./img/left-arrow-black.png")}
        onPress={onPress}
      />
    );

    component.simulate("press");
    expect(onPress).toHaveBeenCalled();
    expect(toJson(component)).toMatchSnapshot();
  });

  it("should have the default container style", () => {
    const component = shallow(
      <WeekSelector imageSource={require("./img/left-arrow-black.png")} />
    );

    const styles = component.props().style;

    expect(_.filter(styles)).toHaveLength(1);
    expect(styles[0]).toEqual(defaultStyles.iconContainer);
  });

  it("should have a custom container style of color red", () => {
    const component = shallow(
      <WeekSelector
        iconContainerStyle={{ color: "red" }}
        imageSource={require("./img/left-arrow-black.png")}
      />
    );

    const styles = component.props().style;

    expect(_.filter(styles)).toHaveLength(2);
    expect(styles[styles.length - 1].color).toBe("red");
    expect(toJson(component)).toMatchSnapshot();
  });

  it("should be enabled", () => {
    const datesForWeek = genDatesForWeek("2018-01-10");

    const component = shallow(
      <WeekSelector
        imageSource={require("./img/left-arrow-black.png")}
        controlDate={moment("2018-01-08")}
        weekEndDate={datesForWeek[datesForWeek.length - 1]}
        weekStartDate={datesForWeek[0]}
      />
    );
    expect(component.props().disabled).toBe(false);
  });

  it("should be disabled", () => {
    const datesForWeek = genDatesForWeek("2018-01-10");

    const component = shallow(
      <WeekSelector
        imageSource={require("./img/left-arrow-black.png")}
        controlDate={moment("2018-01-12")}
        weekEndDate={datesForWeek[datesForWeek.length - 1]}
        weekStartDate={datesForWeek[0]}
      />
    );
    expect(component.props().disabled).toBe(true);
    expect(toJson(component)).toMatchSnapshot();
  });
});

describe("WeekSelector Image Component ", () => {
  it("should have render an image", () => {
    const component = shallow(
      <WeekSelector imageSource={require("./img/left-arrow-black.png")} />
    );

    const imageComponent = component.find(Image);
    expect(imageComponent).toHaveLength(1);
  });

  it("should show the default styles", () => {
    const component = shallow(
      <WeekSelector imageSource={require("./img/left-arrow-black.png")} />
    );

    const imageComponent = component.find(Image);
    const styles = imageComponent.props().style;

    // REM the opacity is applied by default
    expect(_.filter(styles)).toHaveLength(2);
    expect(styles[0]).toEqual(defaultStyles.icon);
  });

  it("should have custom icon style of backgroundColor red", () => {
    const component = shallow(
      <WeekSelector
        iconStyle={{ backgroundColor: "red" }}
        imageSource={require("./img/left-arrow-black.png")}
      />
    );

    const imageComponent = component.find(Image);
    const styles = imageComponent.props().style;
    const finalStyle = _.findLast(styles, "backgroundColor");

    // REM the opacity is applied by default
    expect(_.filter(styles)).toHaveLength(3);
    expect(finalStyle).not.toBeNull();
    expect(finalStyle.backgroundColor).toEqual("red");
    expect(toJson(component)).toMatchSnapshot();
  });

  it("should have custom icon instance style of backgroundColor blue", () => {
    const component = shallow(
      <WeekSelector
        iconStyle={{ backgroundColor: "red" }}
        iconInstanceStyle={{ backgroundColor: "blue" }}
        imageSource={require("./img/left-arrow-black.png")}
      />
    );

    const imageComponent = component.find(Image);
    const styles = imageComponent.props().style;
    const finalStyle = _.findLast(styles, "backgroundColor");

    // REM the opacity is applied by default
    expect(_.filter(styles)).toHaveLength(4);
    expect(finalStyle).not.toBeNull();
    expect(finalStyle.backgroundColor).toEqual("blue");
    expect(toJson(component)).toMatchSnapshot();
  });

  it("should be enabled with opacity 1", () => {
    const datesForWeek = genDatesForWeek("2018-01-10");

    const component = shallow(
      <WeekSelector
        imageSource={require("./img/left-arrow-black.png")}
        controlDate={moment("2018-01-08")}
        weekEndDate={datesForWeek[datesForWeek.length - 1]}
        weekStartDate={datesForWeek[0]}
      />
    );

    const imageComponent = component.find(Image);
    const styles = imageComponent.props().style;
    const finalStyle = _.findLast(styles, "opacity");

    expect(finalStyle).not.toBeNull();
    expect(finalStyle.opacity).toBe(1);
  });

  it("should be disabled with opacity 0", () => {
    const datesForWeek = genDatesForWeek("2018-01-10");

    const component = shallow(
      <WeekSelector
        imageSource={require("./img/left-arrow-black.png")}
        controlDate={moment("2018-01-12")}
        weekEndDate={datesForWeek[datesForWeek.length - 1]}
        weekStartDate={datesForWeek[0]}
      />
    );
    const imageComponent = component.find(Image);
    const styles = imageComponent.props().style;
    const finalStyle = _.findLast(styles, ["opacity", 0]);

    expect(finalStyle).not.toBeNull();
    expect(finalStyle.opacity).toBe(0);
    expect(toJson(component)).toMatchSnapshot();
  });

  it("should render a custom component", () => {
    const component = shallow(
      <WeekSelector iconComponent={<Text>GO BACK</Text>} />
    );

    const customComponent = component.find(Text);
    expect(customComponent).toHaveLength(1);
    expect(toJson(component)).toMatchSnapshot();
  });

  it("should render a custom component that is disabled", () => {
    const datesForWeek = genDatesForWeek("2018-01-10");

    const component = shallow(
      <WeekSelector
        iconComponent={<Text style={{ color: "red" }}>GO BACK</Text>}
        controlDate={moment("2018-01-12")}
        weekEndDate={datesForWeek[datesForWeek.length - 1]}
        weekStartDate={datesForWeek[0]}
      />
    );

    const customComponent = component.find(Text);
    const styles = customComponent.props().style;
    const finalStyle = _.findLast(styles, ["opacity", 0]);

    expect(finalStyle).not.toBeNull();
    expect(finalStyle.opacity).toBe(0);
    expect(toJson(component)).toMatchSnapshot();
  });
});
