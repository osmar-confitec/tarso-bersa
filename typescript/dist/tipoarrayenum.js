"use strict";
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
    Color[Color["Yellow"] = 3] = "Yellow";
    Color[Color["Black"] = 4] = "Black";
    Color[Color["White"] = 5] = "White";
})(Color || (Color = {}));
;
//window.onload = () => {
var myListofNumbers = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
alert("Array myListofNumbers\nThe item in first position of array is " + myListofNumbers[0] + "\nThe item in third position of array is " + myListofNumbers[2]);
var myOtherListofNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
alert("Array myOtherListofNumbers\nThe item in second position of array is " + myOtherListofNumbers[1]);
var myColor = Color.Green;
alert("The color is " + myColor);
myColor = Color.White;
alert("The color now is " + myColor);
//}; 
