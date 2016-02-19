//
// piDisplay: a module for Node.js
// 2 Digit, 7 Segment LED Display Controller Software for the Raspberry Pi
// 
// Authored By: Justin Drentlaw (amd940)
// Prerequisites: Node.js
// Licensed Under:
//
// The MIT License (MIT)
//
// Copyright (c) 2016 Justin Drentlaw
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//

var wpi = require('wiring-pi');

wpi.wiringPiSetupPhys();

var cathodePins = {
	"digitOne": 15,
	"digitTwo": 13
};

var ledPins = {
	"top": 23,
	"topLeft": 26,
	"topRight": 18,
	"middle": 21,
	"bottomLeft": 19,
	"bottomRight": 22,
	"bottom": 24
};

module.exports = function(userLedPins, userCathodePins) {
	if (typeof userLedPins == 'object') {
		if (userLedPins.top != ledPins.top) {
			ledPins.top = userLedPins.top;
		}
		if (userLedPins.topLeft != ledPins.topLeft) {
			ledPins.topLeft = userLedPins.topLeft;
		}
		if (userLedPins.topRight != ledPins.topRight) {
			ledPins.topRight = userLedPins.topRight;
		}
		if (userLedPins.middle != ledPins.middle) {
			ledPins.middle = userLedPins.middle;
		}
		if (userLedPins.bottomLeft != ledPins.bottomLeft) {
			ledPins.bottomLeft = userLedPins.bottomLeft;
		}
		if (userLedPins.bottomRight != ledPins.bottomRight) {
			ledPins.bottomRight = userLedPins.bottomRight;
		}
		if (userLedPins.bottom != ledPins.bottom) {
			ledPins.bottom = userLedPins.bottom;
		}
	}
	if (typeof userCathodePins == 'object') {
		if (userCathodePins.digitOne != cathodePins.digitOne) {
			cathodePins.digitOne = userCathodePins.digitOne;
		}
		if (userCathodePins.digitTwo != cathodePins.digitTwo) {
			cathodePins.digitTwo = userCathodePins.digitTwo;
		}
	}
	this.displayChars = displayChars;
	this.scrollChars = scrollChars;
	this.count = count;
	this.cathodePins = cathodePins;
	this.ledPins = ledPins;
	this.clearDisplay = function() {
		clearInterval(clock);
		clearInterval(scrollTimer);
		clearInterval(countTimer);
		wpi.digitalWrite(cathodePins.digitOne, 0);
		wpi.digitalWrite(cathodePins.digitTwo, 0);
		wpi.digitalWrite(ledPins.middle, 0);
		wpi.digitalWrite(ledPins.bottomLeft, 0);
		wpi.digitalWrite(ledPins.bottom, 0);
		wpi.digitalWrite(ledPins.bottomRight, 0);
		wpi.digitalWrite(ledPins.topRight, 0);
		wpi.digitalWrite(ledPins.top, 0);
		wpi.digitalWrite(ledPins.topLeft, 0);
	};
	return this;
};

// Common Cathodes
// Digit 1
wpi.pinMode(cathodePins.digitOne, 1);
// Digit 2
wpi.pinMode(cathodePins.digitTwo, 1);

// Display Pins
// Top
wpi.pinMode(ledPins.top, 1);
// Top Left
wpi.pinMode(ledPins.topLeft, 1);
// Top Right
wpi.pinMode(ledPins.topRight, 1);
// Middle
wpi.pinMode(ledPins.middle, 1);
// Bottom Left
wpi.pinMode(ledPins.bottomLeft, 1);
// Bottom Right
wpi.pinMode(ledPins.bottomRight, 1);
// Bottom
wpi.pinMode(ledPins.bottom, 1);

// A helper function for displayChars(). Selects the digit
// in which to display the character on.
function selectDigitNumber(x) {
	if (x == 0) {
		wpi.digitalWrite(cathodePins.digitOne, 0);
		wpi.digitalWrite(cathodePins.digitTwo, 1);
	} else {
		wpi.digitalWrite(cathodePins.digitOne, 1);
		wpi.digitalWrite(cathodePins.digitTwo, 0);
	}
}

// Displays one or two characters on the display. Only accepts
// strings (no symbols, spaces are fine) or numbers (0 to 99).
var clock, frequency = 5;
function displayChars(char) {
	if (typeof clock == 'object') {
		clearInterval(clock);
	}
	if (char === '' || char === undefined || char === null) {
		throw "You must enter a character to display.";
	}
	if (typeof char == 'number') {
		char += '';
	}
	if (char.length > 0 && char.length < 3) {
		if (char.length == 2) {
			var chars = [];
			chars[0] = char.charAt(0);
			chars[1] = char.charAt(1);
		} else {
			var chars = [];
			chars[0] = char.charAt(0);
		}
		if (isNaN(char)) {
			if (chars[0].match(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/) == null && chars[1].match(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/) == null) {
				// Char is either not a number or a combination of letters and numbers.
				if (chars[0].match(/[0-9]/) != null) {
					// First char is a number.
					chars[0] = parseInt(chars[0]);
					if (chars[1].match(/[AbCcdEFHhIJjLlnOoPSyUu]/) == null) {
						throw "Only these letters are allowed: A, b, C, c, d, E, F, H, h, I, J, j, L, l, n, O, o, P, S, y, U, u";
					}
				} else if (chars[1].match(/[0-9]/) != null) {
					// Second char is a number.
					chars[1] = parseInt(chars[1]);
					if (chars[0].match(/[AbCcdEFHhIJjLlnOoPSyUu]/) == null) {
						throw "Only these letters are allowed: A, b, C, c, d, E, F, H, h, I, J, j, L, l, n, O, o, P, S, y, U, u";
					}
				} else {
					// Both chars are letters.
					if (chars[0].match(/[AbCcdEFHhIJjLlnOoPSyUu]/) == null && chars[1].match(/[AbCcdEFHhIJjLlnOoPSyUu]/) == null) {
						throw "Only these letters are allowed: A, b, C, c, d, E, F, H, h, I, J, j, L, l, n, O, o, P, S, y, U, u";
					}
				}
			} else {
				throw 'Symbols are not allowed.';
			}
		} else {
			// Char is a number.
			var char = parseInt(char);
			if (char >= 0 && char < 100) {
				if (chars.length == 1) {
					chars[0] = parseInt(chars[0]);
					chars.unshift(0);
				} else {
					chars[0] = parseInt(chars[0]);
					chars[1] = parseInt(chars[1]);
				}
			}
		}
		var i = 0;
		clock = setInterval(function() {
			if (i % 2 == 0) {
				char = chars[0];
				var digit = 0;
			} else {
				char = chars[1];
				var digit = 1;
			}
			switch (char) {
				case 'A':
					selectDigitNumber(digit);
					wpi.digitalWrite(ledPins.middle, 1);
					wpi.digitalWrite(ledPins.bottomLeft, 1);
					wpi.digitalWrite(ledPins.bottom, 0);
					wpi.digitalWrite(ledPins.bottomRight, 1);
					wpi.digitalWrite(ledPins.topRight, 1);
					wpi.digitalWrite(ledPins.top, 1);
					wpi.digitalWrite(ledPins.topLeft, 1);
					break;
				case 'b':
					selectDigitNumber(digit);
					wpi.digitalWrite(ledPins.middle, 1);
					wpi.digitalWrite(ledPins.bottomLeft, 1);
					wpi.digitalWrite(ledPins.bottom, 1);
					wpi.digitalWrite(ledPins.bottomRight, 1);
					wpi.digitalWrite(ledPins.topRight, 0);
					wpi.digitalWrite(ledPins.top, 0);
					wpi.digitalWrite(ledPins.topLeft, 1);
					break;
				case 'C':
					selectDigitNumber(digit);
					wpi.digitalWrite(ledPins.middle, 0);
					wpi.digitalWrite(ledPins.bottomLeft, 1);
					wpi.digitalWrite(ledPins.bottom, 1);
					wpi.digitalWrite(ledPins.bottomRight, 0);
					wpi.digitalWrite(ledPins.topRight, 0);
					wpi.digitalWrite(ledPins.top, 1);
					wpi.digitalWrite(ledPins.topLeft, 1);
					break;
				case 'c':
					selectDigitNumber(digit);
					wpi.digitalWrite(ledPins.middle, 1);
					wpi.digitalWrite(ledPins.bottomLeft, 1);
					wpi.digitalWrite(ledPins.bottom, 1);
					wpi.digitalWrite(ledPins.bottomRight, 0);
					wpi.digitalWrite(ledPins.topRight, 0);
					wpi.digitalWrite(ledPins.top, 0);
					wpi.digitalWrite(ledPins.topLeft, 0);
					break;
				case 'd':
					selectDigitNumber(digit);
					wpi.digitalWrite(ledPins.middle, 1);
					wpi.digitalWrite(ledPins.bottomLeft, 1);
					wpi.digitalWrite(ledPins.bottom, 1);
					wpi.digitalWrite(ledPins.bottomRight, 1);
					wpi.digitalWrite(ledPins.topRight, 1);
					wpi.digitalWrite(ledPins.top, 0);
					wpi.digitalWrite(ledPins.topLeft, 0);
					break;
				case 'E':
					selectDigitNumber(digit);
					wpi.digitalWrite(ledPins.middle, 1);
					wpi.digitalWrite(ledPins.bottomLeft, 1);
					wpi.digitalWrite(ledPins.bottom, 1);
					wpi.digitalWrite(ledPins.bottomRight, 0);
					wpi.digitalWrite(ledPins.topRight, 0);
					wpi.digitalWrite(ledPins.top, 1);
					wpi.digitalWrite(ledPins.topLeft, 1);
					break;
				case 'F':
					selectDigitNumber(digit);
					wpi.digitalWrite(ledPins.middle, 1);
					wpi.digitalWrite(ledPins.bottomLeft, 1);
					wpi.digitalWrite(ledPins.bottom, 0);
					wpi.digitalWrite(ledPins.bottomRight, 0);
					wpi.digitalWrite(ledPins.topRight, 0);
					wpi.digitalWrite(ledPins.top, 1);
					wpi.digitalWrite(ledPins.topLeft, 1);
					break;
				case 'H':
					selectDigitNumber(digit);
					wpi.digitalWrite(ledPins.middle, 1);
					wpi.digitalWrite(ledPins.bottomLeft, 1);
					wpi.digitalWrite(ledPins.bottom, 0);
					wpi.digitalWrite(ledPins.bottomRight, 1);
					wpi.digitalWrite(ledPins.topRight, 1);
					wpi.digitalWrite(ledPins.top, 0);
					wpi.digitalWrite(ledPins.topLeft, 1);
					break;
				case 'h':
					selectDigitNumber(digit);
					wpi.digitalWrite(ledPins.middle, 1);
					wpi.digitalWrite(ledPins.bottomLeft, 1);
					wpi.digitalWrite(ledPins.bottom, 0);
					wpi.digitalWrite(ledPins.bottomRight, 1);
					wpi.digitalWrite(ledPins.topRight, 0);
					wpi.digitalWrite(ledPins.top, 0);
					wpi.digitalWrite(ledPins.topLeft, 1);
					break;
				case 'J':
				case 'j':
					selectDigitNumber(digit);
					wpi.digitalWrite(ledPins.middle, 0);
					wpi.digitalWrite(ledPins.bottomLeft, 1);
					wpi.digitalWrite(ledPins.bottom, 1);
					wpi.digitalWrite(ledPins.bottomRight, 1);
					wpi.digitalWrite(ledPins.topRight, 1);
					wpi.digitalWrite(ledPins.top, 0);
					wpi.digitalWrite(ledPins.topLeft, 0);
					break;
				case 'L':
					selectDigitNumber(digit);
					wpi.digitalWrite(ledPins.middle, 0);
					wpi.digitalWrite(ledPins.bottomLeft, 1);
					wpi.digitalWrite(ledPins.bottom, 1);
					wpi.digitalWrite(ledPins.bottomRight, 0);
					wpi.digitalWrite(ledPins.topRight, 0);
					wpi.digitalWrite(ledPins.top, 0);
					wpi.digitalWrite(ledPins.topLeft, 1);
					break;
				case 'n':
					selectDigitNumber(digit);
					wpi.digitalWrite(ledPins.middle, 1);
					wpi.digitalWrite(ledPins.bottomLeft, 1);
					wpi.digitalWrite(ledPins.bottom, 0);
					wpi.digitalWrite(ledPins.bottomRight, 1);
					wpi.digitalWrite(ledPins.topRight, 0);
					wpi.digitalWrite(ledPins.top, 0);
					wpi.digitalWrite(ledPins.topLeft, 0);
					break;
				case 'o':
					selectDigitNumber(digit);
					wpi.digitalWrite(ledPins.middle, 1);
					wpi.digitalWrite(ledPins.bottomLeft, 1);
					wpi.digitalWrite(ledPins.bottom, 1);
					wpi.digitalWrite(ledPins.bottomRight, 1);
					wpi.digitalWrite(ledPins.topRight, 0);
					wpi.digitalWrite(ledPins.top, 0);
					wpi.digitalWrite(ledPins.topLeft, 0);
					break;
				case 'P':
					selectDigitNumber(digit);
					wpi.digitalWrite(ledPins.middle, 1);
					wpi.digitalWrite(ledPins.bottomLeft, 1);
					wpi.digitalWrite(ledPins.bottom, 0);
					wpi.digitalWrite(ledPins.bottomRight, 0);
					wpi.digitalWrite(ledPins.topRight, 1);
					wpi.digitalWrite(ledPins.top, 1);
					wpi.digitalWrite(ledPins.topLeft, 1);
					break;
				case 'y':
					selectDigitNumber(digit);
					wpi.digitalWrite(ledPins.middle, 1);
					wpi.digitalWrite(ledPins.bottomLeft, 0);
					wpi.digitalWrite(ledPins.bottom, 1);
					wpi.digitalWrite(ledPins.bottomRight, 1);
					wpi.digitalWrite(ledPins.topRight, 1);
					wpi.digitalWrite(ledPins.top, 0);
					wpi.digitalWrite(ledPins.topLeft, 1);
					break;
				case 'U':
					selectDigitNumber(digit);
					wpi.digitalWrite(ledPins.middle, 0);
					wpi.digitalWrite(ledPins.bottomLeft, 1);
					wpi.digitalWrite(ledPins.bottom, 1);
					wpi.digitalWrite(ledPins.bottomRight, 1);
					wpi.digitalWrite(ledPins.topRight, 1);
					wpi.digitalWrite(ledPins.top, 0);
					wpi.digitalWrite(ledPins.topLeft, 1);
					break;
				case 'u':
					selectDigitNumber(digit);
					wpi.digitalWrite(ledPins.middle, 0);
					wpi.digitalWrite(ledPins.bottomLeft, 1);
					wpi.digitalWrite(ledPins.bottom, 1);
					wpi.digitalWrite(ledPins.bottomRight, 1);
					wpi.digitalWrite(ledPins.topRight, 0);
					wpi.digitalWrite(ledPins.top, 0);
					wpi.digitalWrite(ledPins.topLeft, 0);
					break;
				case 0:
				case 'O':
					selectDigitNumber(digit);
					wpi.digitalWrite(ledPins.middle, 0);
					wpi.digitalWrite(ledPins.bottomLeft, 1);
					wpi.digitalWrite(ledPins.bottom, 1);
					wpi.digitalWrite(ledPins.bottomRight, 1);
					wpi.digitalWrite(ledPins.topRight, 1);
					wpi.digitalWrite(ledPins.top, 1);
					wpi.digitalWrite(ledPins.topLeft, 1);
					break;
				case 1:
				case 'I':
				case 'l':
					selectDigitNumber(digit);
					wpi.digitalWrite(ledPins.middle, 0);
					wpi.digitalWrite(ledPins.bottomLeft, 0);
					wpi.digitalWrite(ledPins.bottom, 0);
					wpi.digitalWrite(ledPins.bottomRight, 1);
					wpi.digitalWrite(ledPins.topRight, 1);
					wpi.digitalWrite(ledPins.top, 0);
					wpi.digitalWrite(ledPins.topLeft, 0);
					break;
				case 2:
					selectDigitNumber(digit);
					wpi.digitalWrite(ledPins.middle, 1);
					wpi.digitalWrite(ledPins.bottomLeft, 1);
					wpi.digitalWrite(ledPins.bottom, 1);
					wpi.digitalWrite(ledPins.bottomRight, 0);
					wpi.digitalWrite(ledPins.topRight, 1);
					wpi.digitalWrite(ledPins.top, 1);
					wpi.digitalWrite(ledPins.topLeft, 0);
					break;
				case 3:
					selectDigitNumber(digit);
					wpi.digitalWrite(ledPins.middle, 1);
					wpi.digitalWrite(ledPins.bottomLeft, 0);
					wpi.digitalWrite(ledPins.bottom, 1);
					wpi.digitalWrite(ledPins.bottomRight, 1);
					wpi.digitalWrite(ledPins.topRight, 1);
					wpi.digitalWrite(ledPins.top, 1);
					wpi.digitalWrite(ledPins.topLeft, 0);
					break;
				case 4:
					selectDigitNumber(digit);
					wpi.digitalWrite(ledPins.middle, 1);
					wpi.digitalWrite(ledPins.bottomLeft, 0);
					wpi.digitalWrite(ledPins.bottom, 0);
					wpi.digitalWrite(ledPins.bottomRight, 1);
					wpi.digitalWrite(ledPins.topRight, 1);
					wpi.digitalWrite(ledPins.top, 0);
					wpi.digitalWrite(ledPins.topLeft, 1);
					break;
				case 5:
				case 'S':
					selectDigitNumber(digit);
					wpi.digitalWrite(ledPins.middle, 1);
					wpi.digitalWrite(ledPins.bottomLeft, 0);
					wpi.digitalWrite(ledPins.bottom, 1);
					wpi.digitalWrite(ledPins.bottomRight, 1);
					wpi.digitalWrite(ledPins.topRight, 0);
					wpi.digitalWrite(ledPins.top, 1);
					wpi.digitalWrite(ledPins.topLeft, 1);
					break;
				case 6:
					selectDigitNumber(digit);
					wpi.digitalWrite(ledPins.middle, 1);
					wpi.digitalWrite(ledPins.bottomLeft, 1);
					wpi.digitalWrite(ledPins.bottom, 1);
					wpi.digitalWrite(ledPins.bottomRight, 1);
					wpi.digitalWrite(ledPins.topRight, 0);
					wpi.digitalWrite(ledPins.top, 1);
					wpi.digitalWrite(ledPins.topLeft, 1);
					break;
				case 7:
					selectDigitNumber(digit);
					wpi.digitalWrite(ledPins.middle, 0);
					wpi.digitalWrite(ledPins.bottomLeft, 0);
					wpi.digitalWrite(ledPins.bottom, 0);
					wpi.digitalWrite(ledPins.bottomRight, 1);
					wpi.digitalWrite(ledPins.topRight, 1);
					wpi.digitalWrite(ledPins.top, 1);
					wpi.digitalWrite(ledPins.topLeft, 0);
					break;
				case 8:
					selectDigitNumber(digit);
					wpi.digitalWrite(ledPins.middle, 1);
					wpi.digitalWrite(ledPins.bottomLeft, 1);
					wpi.digitalWrite(ledPins.bottom, 1);
					wpi.digitalWrite(ledPins.bottomRight, 1);
					wpi.digitalWrite(ledPins.topRight, 1);
					wpi.digitalWrite(ledPins.top, 1);
					wpi.digitalWrite(ledPins.topLeft, 1);
					break;
				case 9:
					selectDigitNumber(digit);
					wpi.digitalWrite(ledPins.middle, 1);
					wpi.digitalWrite(ledPins.bottomLeft, 0);
					wpi.digitalWrite(ledPins.bottom, 1);
					wpi.digitalWrite(ledPins.bottomRight, 1);
					wpi.digitalWrite(ledPins.topRight, 1);
					wpi.digitalWrite(ledPins.top, 1);
					wpi.digitalWrite(ledPins.topLeft, 1);
					break;
				case ' ':
				default:
					selectDigitNumber(digit);
					wpi.digitalWrite(ledPins.middle, 0);
					wpi.digitalWrite(ledPins.bottomLeft, 0);
					wpi.digitalWrite(ledPins.bottom, 0);
					wpi.digitalWrite(ledPins.bottomRight, 0);
					wpi.digitalWrite(ledPins.topRight, 0);
					wpi.digitalWrite(ledPins.top, 0);
					wpi.digitalWrite(ledPins.topLeft, 0);
					break;
			}
			i++;
		}, frequency);
	} else {
		throw "Character(s) to display must be 1 to 2 characters long.";
	}
}

// Scrolls a sentence across the display one letter at a time.
// Accepts the same values that displayChars() accepts.
var scrollTimer;
function scrollChars(sentence, speed) {
	var i = 0;
	if (!speed) {
		var speed = 400;
	}
	scrollTimer = setInterval(function() {
		var chars = sentence.substr(i, 2);
		displayChars(chars);
		i++;
		if (i == sentence.length-1) {
			i = 0;
		}
	}, speed);
}

// Counts up from 0 to 99 or down from 99 to 0 on the display.
var countTimer;
function count(upOrDown, speed) {
	if (!speed) {
		var speed = 200;
	}
	if (upOrDown == 'up') {
		var i = 0;
	} else if (upOrDown == 'down') {
		var i = 99;
	}
	countTimer = setInterval(function() {
		if (upOrDown == 'up') {
			if (i > 99) {
				i = 0;
			}
		} else if (upOrDown == 'down') {
			if (i < 0) {
				i = 99;
			}
		}
		
		displayChars(i);
		if (upOrDown == 'up') {
			i++;
		} else if (upOrDown == 'down') {
			i--;
		}
	}, speed);
}