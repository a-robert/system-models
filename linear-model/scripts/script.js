/* global math */
/* global jQuery */
jQuery(document).ready(function ($) {
  var xMIN = -45;
  var xMAX = 45;
  var yMIN = -2;
  var yMAX = 2;
  var bMIN = -10;
  var bMAX = 10;
  var i;
  var j;
  var testModelCoefficients = [];

  var $tBody = $('tbody');

  var nArray = [];
  var xArray = [];
  var yArray = [];
  var k = 4;
  var n = 20;

  // test model initing
  for (i = 0; i < k + 1; i++) {
    testModelCoefficients.push(getRandomNumber(bMIN, bMAX));
  }

  console.log('Test Model Coefficient: ', testModelCoefficients);

  // initializing arrays.
  for (i = 0; i < n; i++) {
    var dummyArr = [];
    var dummyY = testModelCoefficients[0];
    for (j = 0; j < k; j++) {
      dummyArr.push(getRandomNumber(xMIN, xMAX));
      dummyY += testModelCoefficients[j + 1]*dummyArr[j] + getRandomNumber(yMIN, yMAX);
    }
    nArray.push(i + 1);
    xArray.push(dummyArr);
    yArray.push(dummyY);
  }

  // rendering to table.
  for (i = 0; i < n; i++) {
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
    for (j = 0; j < k + 1; j++) {
      var appendText = j ? xArray[i][j - 1] : nArray[i] + '.';
      $trTemp.find('td:eq(' + j + ')').text(appendText);
    }
    $trTemp.find('td:eq(5)').text(yArray[i]);
    $tBody.append($trTemp);
  }

  var cArray = [];
  for (i = 0; i < k + 1; i++) {
    if (i) {
      cArray.push(getArraySum(arrayMultiplier(yArray, xArray, i)));
    } else {
      cArray.push(getArraySum(yArray));
    }
  }

  console.log('C array: ', cArray);

  var aArray = [];
  for (i = 0; i < k + 1; i++) {
    var dummyArray = [];

    for (j = 0; j < k + 1; j++) {
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

  console.log('A array: ', aArray);

  var i_aArray = math.inv(aArray);

  console.log('A array Inverse: ', i_aArray);

  var bArray = math.multiply(cArray, i_aArray);
  var answerText = 'Answer: Y = ';

  for (i = 0; i < k + 1; i++) {
    var s = Math.sign(bArray[i]) === -1 ? ' -' : ' +';
    if (!i) {
      if (s === ' -') {
        answerText += s + Math.abs(bArray[i])
      } else {
        answerText += Math.abs(bArray[i])
      }
    } else {
      answerText += s + Math.abs(bArray[i]) + '*X' + i + ' ';
    }
  }

  $('.answer').text(answerText);

  var ySArray = [];

  for (i = 0; i < n; i++) {
    var val = bArray[0];

    xArray[i].forEach(function (item, idx) {
      val += item * bArray[idx + 1];
    });

    ySArray.push(val);
  }

  console.log('ySArray: ', ySArray);

  var ssE = 0;

  for (i = 0; i < n; i++) {
    ssE += Math.pow(ySArray[i] - yArray[i], 2);
  }

  console.log('SS(E): ', ssE);

  var ssR = 0;
  var yAverage = getArrayAverage(yArray);
  var ySAverage = getArrayAverage(ySArray);

  console.log('yAverage: ', yAverage);

  for (i = 0; i < n; i++) {
    ssR += Math.pow(yArray[i] - yAverage, 2);
  }

  console.log('SS(R): ', ssR);

  var ssO = 0;

  for (i = 0; i < n; i++) {
    ssO += Math.pow(ySArray[i] - ySAverage, 2);
  }

  console.log('ySAverage: ', ySAverage);

  console.log('SS(O): ', ssO);

  var R = ssR/ssO;

  console.log('R: ', R);

  var msR = ssR/k;

  console.log('MS(R): ', msR);

  var G2 = ssE/(n - k -1);

  console.log('G^2: ', G2);

  var F = msR/G2;

  console.log('F: ', F);

  // helpers.
  function getRandomNumber(min, max) {
    return (Math.random() * (max - min) + min).toFixed() - '';
  }

  function getArrayAverage(array) {
    var val = 0;
    array.forEach(function(item) {
      val += item;
    });

    return array.length ? val/array.length : 0;
  }

  function arrayArrayMultiplier(array, j, i) {
    var dummyArr = [];
    array.forEach(function (item) {
      dummyArr.push(item[j] * item[i]);
    });

    return dummyArr;
  }

  function arrayMultiplier(array, mul, i) {
    var dummyArr = [];
    array.forEach(function (item, index) {
      dummyArr.push(item * mul[index][i - 1]);
    });

    return dummyArr;
  }

  function getArraySumCol(array, i) {
    var sum = 0;
    array.forEach(function (item) {
      sum += item[i];
    });
    return sum;
  }

  function getArraySum(array) {
    var sum = 0;
    array.forEach(function (item) {
      sum += item;
    });
    return sum;
  }
});
