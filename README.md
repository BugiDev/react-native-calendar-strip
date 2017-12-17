<h1 align="center"> react-native-calendar-strip </h1>
<div align="center">
  <strong> Easy to use and visually stunning calendar component for React Native.</strong>
</div>
<br>
<div align="center">
  <a href="https://npmjs.org/package/react-native-calendar-strip">
    <img src="https://img.shields.io/npm/v/react-native-calendar-strip.svg?style=flat-square" alt="npm package version" />
  </a>
  <a href="https://npmjs.org/package/react-native-calendar-strip">
  <img src="https://img.shields.io/npm/dm/react-native-calendar-strip.svg?style=flat-square" alt="npm downloads" />
  </a>
  <a href="https://github.com/feross/standard">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square" alt="standard JS linter" />
  </a>
  <a href="https://github.com/prettier/prettier">
    <img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square" alt="prettier code formatting" />
  </a>
  <a href="https://github.com/BugiDev/react-native-calendar-strip/blob/master/LICENSE.md">
    <img src="https://img.shields.io/npm/l/react-native-calendar-strip.svg?style=flat-square" alt="project license" />
  </a>
  <a href="http://makeapullrequest.com">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="make a pull request" />
  </a>
</div>
<br>
<div align="center">
  <a href="https://github.com/BugiDev/react-native-calendar-strip/watchers">
    <img src="https://img.shields.io/github/watchers/BugiDev/react-native-calendar-strip.svg?style=social" alt="Github Watch Badge" />
  </a>
  <a href="https://github.com/BugiDev/react-native-calendar-strip/stargazers">
    <img src="https://img.shields.io/github/stars/BugiDev/react-native-calendar-strip.svg?style=social" alt="Github Star Badge" />
  </a>
  <a href="https://twitter.com/intent/tweet?text=Check%20out%20react-native-calendar-strip!%20https://github.com/BugiDev/react-native-calendar-strip%20%F0%9F%91%8D">
    <img src="https://img.shields.io/twitter/url/https/github.com/BugiDev/react-native-calendar-strip.svg?style=social" alt="Tweet" />
  </a>
</div>
<br>
<div align="center">
  Built with ❤︎ by <a href="https://github.com/BugiDev">BugiDev</a> and <a href="https://github.com/BugiDev/react-native-calendar-strip/graphs/contributors">contributors</a>
</div>

<h2>Table of Contents</h2>
<details>
  <summary>Table of Contents</summary>
  <li><a href="#install">Install</a></li>
  <li><a href="#usage">Usage</a></li>
  <li><a href="#props">Props</a></li>
  <li><a href="#contribute">Contribute</a></li>
  <li><a href="#license">License</a></li>
</details>

## Install

```sh
$ npm install react-native-calendar-strip
# OR
$ yarn add react-native-calendar-strip
```

## Usage

```jsx
import { View, StyleSheet } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';

const Example = () => (
  <View style={styles.container}>
    <CalendarStrip />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 }
});
```

This will result in:

<div align="center">
  <img src="https://raw.githubusercontent.com/BugiDev/react-native-calendar-strip/master/example/gifs/Initial.gif" alt="">
</div>

You can see the examples in [example](https://github.com/BugiDev/react-native-calendar-strip/tree/master/example/ReactNativeCalendarStripExample) folder of this repo.

## Props

### Initial data and onDateSelected handler

| Prop                 | Description                                                                                                                                                      | Type     | Defualt    |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------- |
| **`startingDate`**   | Date to be used for centering the calendar/showing the week based on that date. It is internaly wrapped by `moment` so it accepts both `Date` and `moment Date`. | Any      |
| **`selectedDate`**   | Date to be used as pre selected Date. It is internaly wrapped by `moment` so it accepts both `Date` and `moment Date`.                                           | Any      |
| **`onDateSelected`** | Function to be used as a callback when a date is selected. It returns `moment Date`                                                                              | Function |
| **`onWeekChanged`**  | Function to be used as a callback when a week is changed. It returns `moment Date`                                                                               | Number   |
| **`updateWeek`**     | Update the week view if other props change. If `false`, the week view won't change when other props change, but will still respond to left/right selectors.      | Bool     | **`True`** |
| **`useIsoWeekday`**  | start week on ISO day of week (default true). If false, starts week on _startingDate_ parameter.                                                                 | Bool     | **`True`** |
| **`minDate`**        | minimum date that the calendar may navigate to. A week is allowed if minDate falls within the current week.                                                      | Any      |
| **`maxDate`**        | maximum date that the calendar may navigate to. A week is allowed if maxDate falls within the current week.                                                      | Any      |
| **`datesWhitelist`** | TODO: Come up with better way to show code                                                                                                                       | Array    |
| **`datesBlacklist`** | Dates that are disabled. Same format as _datesWhitelist_. This overrides dates in _datesWhitelist_.                                                              | Array    |

### Hiding Components

| Prop                | Description                       | Type | Defualt    |
| ------------------- | --------------------------------- | ---- | ---------- |
| **`showMonth`**     | Show or hide the month label.     | Bool | **`True`** |
| **`showDate`**      | Show or hide all the dates.       | Bool | **`True`** |
| **`showDayName`**   | Show or hide the day name label   | Bool | **`True`** |
| **`showDayNumber`** | Show or hide the day number label | Bool | **`True`** |

### Styling

| Prop                           | Description                                                                                                                                                                                                                                                                              | Type   | Defualt    |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------- |
| **`style`**                    | Style for the top level CalendarStrip component.                                                                                                                                                                                                                                         | Any    |
| **`innerStyle`**               | Sh Style for the responsively sized inner view. This is necessary to account for padding/margin from the top level view. The inner view has style `flex:1` by default. If this component is nested within another dynamically sized container, remove the flex style by passing in `[]`. | Any    |
| **`calendarHeaderStyle`**      | Style for the header text of the calendar                                                                                                                                                                                                                                                | Any    |
| **`calendarHeaderFormat`**     | Format for the header text of the calendar. For options, refere to [moments documentation](http://momentjs.com/docs/#/displaying/format/)                                                                                                                                                | String |
| **`dateNameStyle`**            | Style for the name of the day on work days in dates strip                                                                                                                                                                                                                                | Any    |
| **`dateNumberStyle`**          | Style for the number of the day on work days in dates strip.                                                                                                                                                                                                                             | Any    |
| **`weekendDateNameStyle`**     | Style for the name of the day on weekend days in dates strip.                                                                                                                                                                                                                            | Any    |
| **`weekendDateNumberStyle`**   | Style for the number of the day on weekend days in dates strip.                                                                                                                                                                                                                          | Any    |
| **`styleWeekend`**             | Whether to style weekend dates separately.                                                                                                                                                                                                                                               | Bool   | **`True`** |
| **`highlightDateNameStyle`**   | Style for the selected name of the day in dates strip.                                                                                                                                                                                                                                   | Any    |
| **`highlightDateNumberStyle`** | Style for the selected number of the day in dates strip.                                                                                                                                                                                                                                 | Any    |
| **`disabledDateNameStyle`**    | Style for disabled name of the day in dates strip (controlled by datesWhitelist & datesBlacklist).                                                                                                                                                                                       | Any    |
| **`disabledDateNumberStyle`**  | Style for disabled number of the day in dates strip (controlled by datesWhitelist & datesBlacklist).                                                                                                                                                                                     | Any    |
| **`disabledDateOpacity`**      | Opacity of disabled dates strip.                                                                                                                                                                                                                                                         | Number | **`0.3`**  |
| **`customDatesStyles`**        | Custom per-date styling, overriding the styles above. Check Table Below <a href="#customdatesstyles"> Below </a>                                                                                                                                                                         | Array  |

#### Responsive Sizing

| Prop                         | Description                                                                                                                                          | Type   | Defualt  |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | -------- |
| **`maxDayComponentSize`**    | Maximum size that CalendarDay will responsively size up to.                                                                                          | Number | **`80`** |
| **`minDayComponentSize`**    | Minimum size that CalendarDay will responsively size down to.                                                                                        | Number | **`10`** |
| **`responsiveSizingOffset`** | Adjust the responsive sizing. May be positive (increase size) or negative (decrease size). This value is added to the calculated day component width | Number | **`0`**  |

#### Icon Sizing

| Prop                 | Description                                                                                                                                                                             | Type | Defualt |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ------- |
| **`iconLeft`**       | Icon to be used for the left icon. It accepts require statement with url to the image (`require('./img/icon.png')`), or object with remote uri `{uri: 'http://example.com/image.png'}`  | Any  |
| **`iconRight`**      | Icon to be used for the right icon. It accepts require statement with url to the image (`require('./img/icon.png')`), or object with remote uri `{uri: 'http://example.com/image.png'}` | Any  |
| **`iconStyle`**      | Style that is applied to both left and right icons. It is applied before _iconLeftStyle_ or _iconRightStyle_.                                                                           | Any  |
| **`iconLeftStyle`**  | Style for left icon. It will override all of the other styles applied to icons.                                                                                                         | Any  |
| **`iconRightStyle`** | Style for right icon. It will override all of the other styles applied to icons.                                                                                                        | Any  |
| **`iconStyle`**      | Style for the container of icons. (Example usage is to add `flex` property to it so in the portrait mode, it will shrink the dates strip)                                               | Any  |
| **`leftSelector`**   | Component for the left selector control. May be an instance of any React component. This overrides the icon\* props above. Passing in an empty array `[]` hides this control.           | Any  |
| **`rightSelector`**  | Component for the right selector control. May be an instance of any React component. This overrides the icon\* props above. Passing in an empty array `[]` hides this control.          | Any  |

#### customDatesStyles

  <div align="center">
  <img src="https://cloud.githubusercontent.com/assets/6295083/25105759/a3335fc8-238b-11e7-9a92-3174498a0d89.png" alt="Custom date styling example">
</div>

| Prop                     | Description                                                                        | Type | optional    |
| ------------------------ | ---------------------------------------------------------------------------------- | ---- | ----------- |
| **`startDate`**          | anything parseable by Moment.                                                      | Any  | **`False`** |
| **`endDate`**            | specify a range. If no endDate is supplied, startDate is treated as a single date. | Any  | **`True`**  |
| **`dateNameStyle`**      | Style for the name of the day on work days in dates strip                          | Any  | **`True`**  |
| **`dateNumberStyle`**    | Style for the number of the day on work days in dates strip.                       | Any  | **`True`**  |
| **`dateContainerStyle`** | Style for the date Container.                                                      | Any  | **`True`**  |

##### Usage Example:

```jsx
  let customDatesStyles = [];
  let startDate = moment();
  for (let i=0; i<6; i++) {
    customDatesStyles.push({
        startDate: startDate.clone().add(i, 'days'), // Single date since no endDate provided
        dateNameStyle: {styles.someDateNameStyle},
        dateNumberStyle: {styles.someDateNumberStyle},
        // Random color...
        dateContainerStyle: {{backgroundColor: '#'+('#00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6)}},
    });
  }

  render() {
    return (
      <CalendarStrip
        customDatesStyles={customDatesStyles}
        ...
      />
    );
  }
```
## ToDo
 * [ ] Add unit tests
 * [ ] Add Travis CI integration
 * [ ] Implement week view, which should show weeks in a month rather than days, so that you select the whole week
 * [ ] Add a month and a year selection in a form of a popup
 
## Contributing

Contributions are welcome!

1. Fork it.
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

Or open up [a issue](https://github.com/BugiDev/react-native-calendar-strip/issues).

## License

Licensed under the MIT License.
