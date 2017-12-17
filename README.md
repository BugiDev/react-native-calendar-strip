
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
import {View, StyleSheet} from 'react-native'
import CalendarStrip from 'react-native-calendar-strip';

const Example = () => (
  <View style={styles.container}>
       <CalendarStrip/>
  </View>
)

const styles = StyleSheet.create({
  container: { flex: 1 }
})
```

This will result in:

<div align="center">
  <img src="example.png" alt="">
</div>

You can see the examples in [example](https://github.com/BugiDev/react-native-calendar-strip/tree/master/example/ReactNativeCalendarStripExample) folder of this repo.

## Props

Prop | Description | Type | Defualt
------ | ------ | ------ | ------
**`startingDate `** | Date to be used for centering the calendar/showing the week based on that date. It is internaly wrapped by `moment` so it accepts both `Date` and `moment Date`. | Any |  
**`selectedDate `** | Date to be used as pre selected Date. It is internaly wrapped by `moment` so it accepts both `Date` and `moment Date`. | Any | 
**`onDateSelected `** | Function to be used as a callback when a date is selected. It returns `moment Date`| Function | 
**`onWeekChanged `** | Function to be used as a callback when a week is changed. It returns `moment Date`| Number |
**`updateWeek `** | Update the week view if other props change. If `false`, the week view won't change when other props change, but will still respond to left/right selectors.| Bool | **`True`**
**`useIsoWeekday `** | start week on ISO day of week (default true).  If false, starts week on _startingDate_ parameter.| Bool | **`True`**
**`minDate`** | minimum date that the calendar may navigate to. A week is allowed if minDate falls within the current week.| Any | 
**`maxDate `** | maximum date that the calendar may navigate to. A week is allowed if maxDate falls within the current week.| Any | 
**`datesWhitelist `** | TODO: Come up with better way to show code | Array |
**`datesBlacklist `** | Dates that are disabled. Same format as _datesWhitelist_.  This overrides dates in _datesWhitelist_. | Array | 

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