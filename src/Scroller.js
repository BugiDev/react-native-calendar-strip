// This is a bi-directional infinite scroller.
// As the beginning & end are reached, the dates are recalculated and the current
// index adjusted to match the previous visible date.
// RecyclerListView helps to efficiently recycle instances, but the data that
// it's fed is finite. Hence the data must be shifted at the ends to appear as
// an infinite scroller.

import React, { Component } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import moment from "moment";

export default class CalendarScroller extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    initialRenderIndex: PropTypes.number,
    renderDay: PropTypes.func,
    renderDayParams: PropTypes.object.isRequired,
    minDate: PropTypes.any,
    maxDate: PropTypes.any,
    maxSimultaneousDays: PropTypes.number,
    updateMonthYear: PropTypes.func,
    onWeekChanged: PropTypes.func,
  }

  static defaultProps = {
    data: [],
    renderDayParams: {},
  };

  constructor(props) {
    super(props);

    this.updateLayout = renderDayParams => {
      const itemHeight = renderDayParams.size;
      const itemWidth = itemHeight + renderDayParams.marginHorizontal * 2;

      const layoutProvider = new LayoutProvider(
        index => 0, // only 1 view type
        (type, dim) => {
          // Square, plus horizontal margin
          dim.width = itemWidth;
          dim.height = itemHeight;
        }
      );

      return { layoutProvider, itemHeight, itemWidth };
    }

    this.dataProvider = new DataProvider((r1, r2) => {
      return r1 !== r2;
    });

    this.updateDaysData = data => {
      return {
        data,
        numDays: data.length,
        dataProvider: this.dataProvider.cloneWithRows(data),
      }
    }

    this.state = {
      ...this.updateLayout(props.renderDayParams),
      ...this.updateDaysData(props.data),
      numVisibleItems: 1, // updated in onLayout
    };
  }

  componentDidUpdate(prevProps, prevState) {
    let newState = {};
    let updateState = false;

    if (this.props.renderDayParams.size !== prevProps.renderDayParams.size) {
      updateState = true;
      newState = this.updateLayout(this.props.renderDayParams);
    }

    if (this.props.data !== prevProps.data) {
      updateState = true;
      newState = {...newState, ...this.updateDaysData(this.props.data)};
    }

    if (updateState) {
      this.setState(newState);
    }
  }

  // Scroll left, guarding against start index.
  scrollLeft = () => {
    if (this.state.visibleStartIndex === 0) {
      return;
    }
    const newIndex = Math.max(this.state.visibleStartIndex - this.state.numVisibleItems, 0);
    this.rlv.scrollToIndex(newIndex, true);
  }

  // Scroll right, guarding against end index.
  scrollRight = () => {
    const newIndex = this.state.visibleStartIndex + this.state.numVisibleItems;
    if (newIndex >= (this.state.numDays - 1)) {
      this.rlv.scrollToEnd(true); // scroll to the very end, including padding
      return;
    }
    this.rlv.scrollToIndex(newIndex, true);
  }

  // Shift dates when end of list is reached.
  shiftDaysForward = (visibleStartDate = this.state.visibleStartDate) => {
    const prevVisStart = visibleStartDate.clone();
    const newStartDate = prevVisStart.clone().subtract(Math.floor(this.state.numDays / 3), "days");
    this.updateDays(prevVisStart, newStartDate);
  }

  // Shift dates when beginning of list is reached.
  shiftDaysBackward = (visibleStartDate) => {
    const prevVisStart = visibleStartDate.clone();
    const newStartDate = prevVisStart.clone().subtract(Math.floor(this.state.numDays * 2/3), "days");
    this.updateDays(prevVisStart, newStartDate);
  }

  updateDays = (prevVisStart, newStartDate) => {
    if (this.shifting) {
      return;
    }
    const {
      minDate,
      maxDate,
    } = this.props;
    const data = [];
    let _newStartDate = newStartDate;
    if (minDate && newStartDate.isBefore(minDate, "day")) {
      _newStartDate = moment(minDate);
    }
    for (let i = 0; i < this.state.numDays; i++) {
      let date = _newStartDate.clone().add(i, "days");
      if (maxDate && date.isAfter(maxDate, "day")) {
        break;
      }
      data.push({date});
    }
    // Prevent reducing range when the minDate - maxDate range is small.
    if (data.length < this.props.maxSimultaneousDays) {
      return;
    }

    // Scroll to previous date
    for (let i = 0; i < data.length; i++) {
      if (data[i].date.isSame(prevVisStart, "day")) {
        this.shifting = true;
        this.rlv.scrollToIndex(i, false);
        // RecyclerListView sometimes returns position to old index after
        // moving to the new one. Set position again after delay.
        setTimeout(() => {
          this.rlv.scrollToIndex(i, false);
          this.shifting = false; // debounce
        }, 800);
        break;
      }
    }
    this.setState({
      data,
      dataProvider: this.dataProvider.cloneWithRows(data),
    });
  }

  // Track which dates are visible.
  onVisibleIndicesChanged = (all, now, notNow) => {
    const {
      data,
      numDays,
      numVisibleItems,
      visibleStartDate: _visStartDate,
      visibleEndDate: _visEndDate,
    } = this.state;
    const visibleStartIndex = all[0];
    const visibleStartDate = data[visibleStartIndex].date;
    const visibleEndIndex = Math.min(visibleStartIndex + numVisibleItems - 1, data.length - 1);
    const visibleEndDate = data[visibleEndIndex].date;

    const {
      updateMonthYear,
      onWeekChanged,
    } = this.props;

    // Fire month/year update on both week and month changes.  This is
    // necessary for the header and onWeekChanged updates.
    if (!_visStartDate || !_visEndDate ||
        !visibleStartDate.isSame(_visStartDate, "week") ||
        !visibleEndDate.isSame(_visEndDate, "week") ||
        !visibleStartDate.isSame(_visStartDate, "month") ||
        !visibleEndDate.isSame(_visEndDate, "month") )
    {
      const visStart = visibleStartDate && visibleStartDate.clone();
      const visEnd = visibleEndDate && visibleEndDate.clone();
      onWeekChanged && onWeekChanged(visStart, visEnd);
    }

    // Always update weekstart/end for WeekSelectors.
    updateMonthYear && updateMonthYear(visibleStartDate, visibleEndDate);

    if (visibleStartIndex === 0) {
      this.shiftDaysBackward(visibleStartDate);
    } else {
      const minEndOffset = numDays - numVisibleItems;
      if (minEndOffset > numVisibleItems) {
        for (let a of all) {
          if (a > minEndOffset) {
            this.shiftDaysForward(visibleStartDate);
            break;
          }
        }
      }
    }
    this.setState({
      visibleStartDate,
      visibleEndDate,
      visibleStartIndex,
    });
  }

  onLayout = event => {
    let width = event.nativeEvent.layout.width;
    this.setState({
      numVisibleItems: Math.floor(width / this.state.itemWidth),
    });
  }

  rowRenderer = (type, data, i, extState) => {
    return this.props.renderDay && this.props.renderDay({...data, ...extState});
  }

  render() {
    if (!this.state.data || this.state.numDays === 0 || !this.state.itemHeight) {
      return null;
    }
    return (
      <View
        style={{ height: this.state.itemHeight, flex: 1 }}
        onLayout={this.onLayout}
      >
        <RecyclerListView
          ref={rlv => this.rlv = rlv}
          layoutProvider={this.state.layoutProvider}
          dataProvider={this.state.dataProvider}
          rowRenderer={this.rowRenderer}
          extendedState={this.props.renderDayParams}
          initialRenderIndex={this.props.initialRenderIndex}
          onVisibleIndicesChanged={this.onVisibleIndicesChanged}
          isHorizontal
          scrollViewProps={{
            showsHorizontalScrollIndicator: false,
            contentContainerStyle: {paddingRight: this.state.itemWidth / 2},
          }}
        />
      </View>
    );
  }
}
