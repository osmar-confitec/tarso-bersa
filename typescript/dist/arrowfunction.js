"use strict";
// Step 1
var resultSum1 = function caculateSum1(x, y, z) {
    var result;
    result = x + y + z;
    return result;
};
// Step 2
var resultSum2 = function (x, y, z) {
    var result;
    result = x + y + z;
    return result;
};
// Step 3
var resultSum3 = function (x, y, z) { return x + y + z; };
var nome = 'Osmar';
var call = function (nome) { console.log(" Ol\u00E1 meu nome \u00E9 " + nome + " "); };
console.log(" esse \u00E9 o resultado das arrow functions primeira: " + resultSum1(1, 2, 5) + " ");
console.log(" esse \u00E9 o resultado das arrow functions segunda: " + resultSum2(1, 2, 5) + " ");
console.log(" esse \u00E9 o resultado das arrow functions terceira: " + resultSum3 + " ");
