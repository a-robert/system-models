/* global math */
/* global jQuery */
jQuery(document).ready(function ($) {
    var xMIN = -18;
    var xMAX = 18;
    var yMIN = -48;
    var yMAX = 45;
    
    var $tBody = $('tbody');
    
    var nArray = [];
    var xArray = [];
    var yArray = [];
    var k = 4;
    var n = 20;
    
    // initializing arrays.
    for (var i = 0; i < n; i++) {
      var dummyArr = [];
      for (var j = 0; j < k; j++) {
        dummyArr.push(getRandomNumber(xMIN, xMAX));
      }
      nArray.push(i + 1);
      xArray.push(dummyArr);
      yArray.push(getRandomNumber(yMIN, yMAX));
    }
    
    // rendering to table.
    for (var i = 0; i < n; i++) {
      var $trTemp = $(
      '<tr>' +
        '<td></td>' + 
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
      '</tr>'
      );
      for (var j = 0; j < k + 1; j++) {
        var appendText = j ? xArray[i][j - 1] : nArray[i] + '.';
        $trTemp.find('td:eq(' + j + ')').text(appendText);
      }
      $trTemp.find('td:eq(5)').text(yArray[i]);
      $tBody.append($trTemp);
    }
    
    var cArray = [];
    for (var i = 0; i < k + 1; i++) {
      if (i) {
        cArray.push(getArraySum(arrayMultiplier(yArray, xArray, i)));
      } else {
        cArray.push(getArraySum(yArray));
      }
    }
    
    console.log(cArray);
    
    var aArray = [];
    for (var i = 0; i < k + 1; i++) {
      var dummyArray = [];
      
      for (var j = 0; j < k + 1; j++) {
        if (!i && !j) {
          dummyArray.push(n);
        } else {
          if (!i) {
            dummyArray.push(getArraySumCol(xArray, j - 1));
          } else if (!j) {
            dummyArray.push(getArraySumCol(xArray, i - 1));
          } else {
            dummyArray.push(getArraySum(arrayArrayMultiplier(xArray, i - 1, j - 1)));
          }
        }
      }
      
      aArray.push(dummyArray);
    }
    
    console.log(aArray);
    
    var i_aArray = math.inv(aArray);

    console.log(i_aArray);

    var bArray = math.multiply(cArray, i_aArray);
    var answerText = 'Answer: Y = ';

    for (var i = 0; i < k + 1; i++) {
      var s = Math.sign(bArray[i]) === -1 ? ' -' : ' +';
      if (!i) {
        if (s === ' -') {
          answerText += s + Math.abs(bArray[i]) 
        } else {
          answerText += Math.abs(bArray[i])
        }
      } else {
        answerText += s +  Math.abs(bArray[i]) + '*X' + i + ' ';
      }
    }
    
    $('.answer').text(answerText);
    
    // helpers.
    function getRandomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }

    function generateBinaryArray() {
        var binaryArray = [];
        for (var i = 0; i < 9; i ++) {
            binaryArray.push(Math.round(getRandomNumber(0,1)));
        }

        return binaryArray;
    }
    
    function arrayArrayMultiplier(array, j, i) {
      var dummyArr = [];
      array.forEach(function(item) {
        dummyArr.push(item[j]*item[i]);
      });
      
      return dummyArr;
    }
    
    function arrayMultiplier(array, mul, i) {
      var dummyArr = [];
      array.forEach(function(item, index) {
        dummyArr.push(item*mul[index][i - 1]);
      });
      
      return dummyArr;
    }
    
    function getArraySumCol(array, i) {
      var sum = 0;
        array.forEach(function(item) {
            sum += item[i];
        });
        return sum;
    }

    function getArraySum(array) {
        var sum = 0;
        array.forEach(function(item) {
            sum += item;
        });
        return sum;
    }
 });