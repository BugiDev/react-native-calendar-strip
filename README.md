# react-native-calendar-strip

Easy to use and visually stunning calendar component for React Native.

`<CalendarStrip>` is a React Native component designed to replace the standard date picker component. It works for both `iOS` and `Android` and in both `portrait` and `landscape` orientations!

![alt text](https://raw.githubusercontent.com/BugiDev/react-native-calendar-strip/master/example/gifs/Initial.gif "react-native-calendar-strip demo")

#### Instalation
Just use the standard npm installation
```sh
npm install react-native-calendar-strip --save
```

#### Example

You can see the examples in [\example](https://github.com/BugiDev/react-native-calendar-strip/tree/master/example/ReactNativeCalendarStripExample) folder of this repo.

##### Simple "out of the box" usage
You can use this component without any styling or customization.
Just import it in your project and render it:
```javascript
import React, {Component} from 'react';
import {
    AppRegistry,
    View
} from 'react-native';

import CalendarStrip from 'react-native-calendar-strip';

class Example extends Component {
    render() {
        return (
            <View>
                <CalendarStrip/>
            </View>
        );
    }
}

AppRegistry.registerComponent('Example', () => Example);
```
![alt text](https://raw.githubusercontent.com/BugiDev/react-native-calendar-strip/master/example/gifs/blank.gif "react-native-calendar-strip simple demo")

##### Styling and animations
Even though this component works withouth any customization, it is possible to customize almost everything, so you can make it as beautiful as you want:
```javascript
import React, {Component} from 'react';
import {
    AppRegistry,
    View
} from 'react-native';

import CalendarStrip from 'react-native-calendar-strip';

class Example extends Component {
    render() {
        return (
            <View>
                <CalendarStrip
                    calendarAnimation={{type: 'sequence', duration: 30}}
                    selection={'border'}
                    selectionAnimation={{duration: 300, borderWidth: 1}}
                    style={{paddingTop: 20, paddingBottom: 10}}
                    calendarHeaderStyle={{color: 'white'}}
                    calendarColor={'#7743CE'}
                    highlightColor={'#9265DC'}
                    dateNumberStyle={{color: 'white'}}
                    dateNameStyle={{color: 'white'}}
                    highlightDateNumberStyle={{color: 'yellow'}}
                    highlightDateNameStyle={{color: 'yellow'}}
                    borderHighlightColor={'white'}
                    iconLeft={require('./img/left-arrow.png')}
                    iconRight={require('./img/right-arrow.png')}
                    iconContainer={{flex: 0.1}}
                />
            </View>
        );
    }
}

AppRegistry.registerComponent('Example', () => Example);
```
![alt text](https://raw.githubusercontent.com/BugiDev/react-native-calendar-strip/master/example/gifs/border.gif "react-native-calendar-strip border demo")

#### Props / API
This is the list of all the props you can pass to the component so that you can customize it:
###### Initial data and onDateSelected handler
  * startingDate: React.PropTypes.any - Date to be used for centering the calendar/showing the week based on that date. It is internaly wrapped by `moment` so it accepts both `Date` and `moment Date`.
  * selectedDate: React.PropTypes.any - Date to be used as pre selected Date. It is internaly wrapped by `moment` so it accepts both `Date` and `moment Date`.
  * onDateSelected: React.PropTypes.func - Function to be used as a callback when a date is selected. It returns `moment Date`
  * onWeekChanged: React.PropTypes.func - Function to be used as a callback when a week is changed. It returns `moment Date`
  * useIsoWeekday: React.PropTypes.bool - start week on ISO day of week (default true).  If false, starts week on _startingDate_ parameter.

###### Top level style
  * style: React.PropTypes.any - Style for the top level CalendarStrip component

###### Icon
  * iconLeft: React.PropTypes.any - Icon to be used for the left icon. It accepts require statement with url to the image (`require('./img/icon.png')`), or object with remote uri `{uri: 'http://example.com/image.png'}`
  * iconRight: React.PropTypes.any  - Icon to be used for the right icon. It accepts require statement with url to the image (`require('./img/icon.png')`), or object with remote uri `{uri: 'http://example.com/image.png'}`
  * iconStyle: React.PropTypes.any - Style that is applied to both left and right icons. It is applied before *iconLeftStyle* or *iconLeftStyle*.
  * iconLeftStyle: React.PropTypes.any - Style for left icon. It will override all of the other styles applied to icons.
  * iconRightStyle: React.PropTypes.any - Style for right icon. It will override all of the other styles applied to icons.
  * iconContainer: React.PropTypes.any - Style for the container of icons. (Example usage is to add `flex` property to it so in the portrait mode, it will shrink the dates strip)

###### Header style and formating
  * calendarHeaderStyle: React.PropTypes.any - Style for the header text of the calendar.
  * calendarHeaderFormat: React.PropTypes.string - Format for the header text of the calendar. For options, refere to [moments documentation](http://momentjs.com/docs/#/displaying/format/)

###### Date name and number styling
  * dateNameStyle: React.PropTypes.any - Style for the name of the day on work days in dates strip.
  * dateNumberStyle: React.PropTypes.any - Style for the number of the day on work days in dates strip.
  * weekendDateNameStyle: React.PropTypes.any - Style for the name of the day on weekend days in dates strip.
  * weekendDateNumberStyle: React.PropTypes.any - Style for the number of the day on weekend days in dates strip.
  * styleWeekend: React.PropTypes.bool - (default true) Whether to style weekend dates separately.
  * highlightDateNameStyle: React.PropTypes.any - Style for the selected name of the day in dates strip.
  * highlightDateNumberStyle: React.PropTypes.any - Style for the selected number of the day in dates strip.

  ###### Animations
  There are two animated properties that also can be customized. The first one is actually animated showing of dates when you change a week.
  *If you do not add this prop, it will not have an animation*
  There are 2 possible options.
  * calendarAnimation: React.PropTypes.object - Animation object for showin the dates. It can have 2 types: `{type: 'sequence', duration: 30}` or `{type: 'parallel', duration: 300}` and the duration part being the duration of animation in millisecond.

  ####### Sequence
  The animation is used to show dates in sequence, so it shows them one by one.
  ![alt text](https://raw.githubusercontent.com/BugiDev/react-native-calendar-strip/master/example/gifs/squential.gif "react-native-calendar-strip sequence animation demo")

  ####### Parallel
  The animation is used to show dates in parallel, so it shows all of them with opacity animation.
  ![alt text](https://raw.githubusercontent.com/BugiDev/react-native-calendar-strip/master/example/gifs/parallel.gif "react-native-calendar-strip parallel animation demo")

  ---
  The second animation is used to animate selection of the date. Again, there are 2 types of animation, and they are either animating circular border around a date or changing a circualar background of the date.
  * selection: React.PropTypes.string - String prop for type of selection highligh. Possible types are `border` or `background.` `!important` This property will only determen the type of selection and type of animation, but to be animated, properties bellow have to be added as well.
  * selectionAnimation: React.PropTypes.object - An object used for the animation of selection. If this object is added, only then the selection will be animated. This object defines `{duration: 30}` of the animation, and *if you add a type `border` of selection, you should also add a `{duration: 30, borderWidth: 1}` to this object.*
  * borderHighlightColor: React.PropTypes.string - Highlighting border color.
  ![alt text](https://raw.githubusercontent.com/BugiDev/react-native-calendar-strip/master/example/gifs/border-small.gif "react-native-calendar-strip border animation demo")

  If you chose the `background` type of animation, the selected date will animate the circular background color from `calendarColor` to `highlightColor`. That is why, when this type is chosen, you have to define both of these colors.
  * calendarColor: React.PropTypes.string - Color of the circular backgroundo of the date. `!important` This color will also be aplied as the whole calendar strip background color, so that highlighting the date will appear 'from background' but be aware that top level style of this component can override this property.
  * highlightColor: React.PropTypes.string - Highlighting color of dates.

  ![alt text](https://raw.githubusercontent.com/BugiDev/react-native-calendar-strip/master/example/gifs/background-small.gif "react-native-calendar-strip simple demo")

###### Localization
  * locale: React.PropTypes.object - Locale for dates

  This prop is used for adding localization to react-native-calendar-strip component. The localization rules are the same as moments and can be found in [moments documentation](http://momentjs.com/docs/#/i18n/)

  The locale object has two properties:
  * `name` - String - The name of the locale (ex. 'fr')
  * `config` - Object - The config object holding all of the localization strings.

  Example of one locale object is:
  ```
  const locale = {
              name: 'fr',
              config: {
                  months : "Janvier_Février_Mars_Avril_Mai_Juin_Juillet_Août_Septembre_Octobre_Novembre_Décembre".split("_"),
                  monthsShort : "Janv_Févr_Mars_Avr_Mai_Juin_Juil_Août_Sept_Oct_Nov_Déc".split("_"),
                  weekdays : "Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi".split("_"),
                  weekdaysShort : "Dim_Lun_Mar_Mer_Jeu_Ven_Sam".split("_"),
                  weekdaysMin : "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
                  longDateFormat : {
                      LT : "HH:mm",
                      LTS : "HH:mm:ss",
                      L : "DD/MM/YYYY",
                      LL : "D MMMM YYYY",
                      LLL : "D MMMM YYYY LT",
                      LLLL : "dddd D MMMM YYYY LT"
                  },
                  calendar : {
                      sameDay: "[Aujourd'hui à] LT",
                      nextDay: '[Demain à] LT',
                      nextWeek: 'dddd [à] LT',
                      lastDay: '[Hier à] LT',
                      lastWeek: 'dddd [dernier à] LT',
                      sameElse: 'L'
                  },
                  relativeTime : {
                      future : "dans %s",
                      past : "il y a %s",
                      s : "quelques secondes",
                      m : "une minute",
                      mm : "%d minutes",
                      h : "une heure",
                      hh : "%d heures",
                      d : "un jour",
                      dd : "%d jours",
                      M : "un mois",
                      MM : "%d mois",
                      y : "une année",
                      yy : "%d années"
                  },
                  ordinalParse : /\d{1,2}(er|ème)/,
                  ordinal : function (number) {
                      return number + (number === 1 ? 'er' : 'ème');
                  },
                  meridiemParse: /PD|MD/,
                  isPM: function (input) {
                      return input.charAt(0) === 'M';
                  },
                  // in case the meridiem units are not separated around 12, then implement
                  // this function (look at locale/id.js for an example)
                  // meridiemHour : function (hour, meridiem) {
                  //     return /* 0-23 hour, given meridiem token and hour 1-12 */
                  // },
                  meridiem : function (hours, minutes, isLower) {
                      return hours < 12 ? 'PD' : 'MD';
                  },
                  week : {
                      dow : 1, // Monday is the first day of the week.
                      doy : 4  // The week that contains Jan 4th is the first week of the year.
                  }
              }
          };
  ```

#### ToDo

 * [ ] Add unit tests
 * [ ] Add Travis CI integration
 * [ ] Implement week view, which should show weeks in a month rather than days, so that you select the whole week
 * [ ] Add a month and a year selection in a form of a popup
