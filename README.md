# piDisplay
2 Digit, 7 Segment LED Display Controller Software for the Raspberry Pi. A module for Node.js.

This is a very early alpha version of piDisplay. Everything works correctly as is, but I plan on updating it with a lot more features in the coming weeks and months. This module can display numbers and some letters on a 7 segment, 2 digit LED display that is connected to a Raspberry Pi.

# Sample Images

## Scrolling Text Across Display
![Scrolling Text Across Display](https://240studios.com/projects/pi-display/hotlink-ok/scroller.gif "Scrolling Text Across Display")

## Counting Up on the Display
![Counting Up on the Display](https://240studios.com/projects/pi-display/hotlink-ok/countup.gif "Counting Up on the Display")

## Counting Down on the Display
![Counting Down on the Display](https://240studios.com/projects/pi-display/hotlink-ok/countdown.gif "Counting Down on the Display")

# Pin Layout/Configuration

The model of LED display I am using is a Kingbright DA03-11GWA, and the pinout is shown in the image below. For the full tech sheet, [see here](http://www.kingbrightusa.com/images/catalog/SPEC/DA03-11GWA.pdf).
![LED Display Pin Layout](https://240studios.com/projects/pi-display/hotlink-ok/pin-layout.png "LED Display Pin Layout")

As you can see the display uses two pins for common cathodes, seven pins for the LEDs themselves, and pin 2 is not connected. If you do not have the same display, that's fine, just be sure it's common cathode and not common anode, and that it has two common cathode pins and seven pins for the LED segments of the digits. You'll also need to remap the pins manually if your different display does not match the pinout of the display above.

This is how the display's pins are mapped out on the R-Pi's GPIO pins. There wasn't much ryhme or reason to this, and you can feel free to change the defaults if you would like, which I will detail below. All pins are listed by their phsyical pin number.

| LED Pin | R-Pi Pin |
| ------- | -------- |
| 5 | 13 |
| 10 | 15 |
| 9 | 18 |
| 7 | 19 |
| 1 | 21 |
| 8 | 22 |
| 3 | 23 |
| 6 | 24 |
| 4 | 26 |

# Installation

```
npm install pi-display
```

Need help with installation? [See here](https://www.npmjs.com/package/pi-display/tutorial).

# Usage

```javascript
var piDisplay = require("pi-display");

// Displays E7 on the LED display.
piDisplay.displayChars("E7");

// Displays 85.
piDisplay.displayChars(85);

// Scrolls the given string across the display. It looks more natural to scroll
// if you have spaces at either end of the string, but they are not mandatory.
// The second argument is the milliseconds to display each character.
piDisplay.scrollChars(" HI HELLO 1234567890 ", 400);
```

# API

## Methods

| Method | Argument(s) | Description |
| ------ | --------- | ----------- |
| `displayChars()` | `string`\|`number` chars | Displays one to two static characters on the display. Accepts a string or number (0 to 99). Can be updated very rapidly (without needing to use the `clearDisplay()` method) in a loop or through some other means. |
| `scrollChars()` | `string` sentence, `number` speed | Displays the given sentence in a scrolling style across the LED display, moving one character at a time. The scrolling speed is specified in milliseconds. If no speed is specified, the default `400` is used. |
| `count()` | `string` upOrDown, `number` speed | Counts one-by-one either up or down on the display from 0 to 99. Use the string `'up'` or `'down'` to specify if the method should count up or down. The speed at which each new number is displayed is specified in milliseconds. If no speed is specified, the default `200` is used. |
| `clearDisplay()` | none | Completely clears the display (turns off all the LEDs) and stops any method that is currently executing. |

## Properties

These properties do not currently do anything when reassigned.. I'll have this functionality implemented soon.

| Property | Default Value | Description |
| -------- | ------------- | ----------- |
| `ledPins` | `object` { "top": 14, "topLeft": 11, "topRight": 5, "middle": 13, "bottomLeft": 12, "bottomRight": 6, "bottom": 10 } | Which physical pin number is matched to which segment of the LED. |
| `cathodePins` | `object` {"digitOne": 3, "digitTwo": 2} | The physical pin that controls which digit is turned off when set to HIGH. |

# Credits

I'd like to give a huge thanks to drogon for his excellent [Wiring Pi](http://wiringpi.com/) library, Soarez for making the [original Node.js bindings](https://github.com/Soarez/node-wiring-pi) for Wiring Pi, and eugeneware for enhancing Soarez's work on the [newer Node.js bindings](https://github.com/eugeneware/wiring-pi).