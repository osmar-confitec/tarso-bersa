"use strict";
var Fruits = /** @class */ (function () {
    function Fruits() {
    }
    return Fruits;
}());
var i = 1;
var textOut = "";
while (i < 10) {
    textOut += "The number is " + i + "<br>";
    i++;
}
console.log(textOut);
var k = 1;
var textOut2 = "";
do {
    textOut2 += "The number is " + k + "<br>";
    k++;
} while (k < 10);
console.log(textOut2);
var i;
var textOut5 = "";
for (i = 0; i < 5; i++) {
    textOut5 = textOut5 + "The number is " + i + "<br>";
}
console.log(textOut5);
var myArray = ["cat", "dog", "bird", "fish", "chicken", "bat"];
var textOut6 = "";
for (var k = 0; k < 6; k++) {
    textOut6 += myArray[k] + "<br>";
}
textOut2 += textOut6;
var textOutRelative = "";
for (i = 0; i < 10; i++) {
    if (i == 5) {
        break;
    }
    else {
        textOutRelative = textOutRelative + "The number is " + i + "<br>";
    }
}
textOut2 += textOutRelative;
var k;
var textOutx = "";
for (k = 0; k < 10; k++) {
    if (k == 3) {
        continue;
    }
    else {
        textOutx = textOutx + "The number is " + k + "<br>";
    }
}
textOut2 += textOutx;
//# sourceMappingURL=app.js.map
