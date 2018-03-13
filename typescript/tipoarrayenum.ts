enum Color { Red, Green, Blue, Yellow, Black, White };

//window.onload = () => {

    var myListofNumbers: number[] = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
    alert("Array myListofNumbers\nThe item in first position of array is " + myListofNumbers[0] + "\nThe item in third position of array is " + myListofNumbers[2]);

    var myOtherListofNumbers: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    alert("Array myOtherListofNumbers\nThe item in second position of array is " + myOtherListofNumbers[1]);

    var myColor: Color = Color.Green;
    alert("The color is " + myColor);

    myColor = Color.White;
    alert("The color now is " + myColor);
//};