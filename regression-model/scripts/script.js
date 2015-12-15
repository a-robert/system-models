/* global math */
/* global jQuery */
jQuery(document).ready(function ($) {
  var xMIN = 0;
  var xMAX = 6;
  var yMIN = -1;
  var yMAX = 1;
  var bMIN = 0;
  var bMAX = 3;
  var i;
  var dummyVar;
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
  var xArrayForCalc = xArray[0].map(function(col, i) {
    return xArray.map(function(row) {
      return row[i];
    });
  });

  console.log(xArrayForCalc);

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

  var yAverage = getArrayAverage(yArray);

  var Gy = Math.sqrt((function() {
    var dummyVar = 0;

    yArray.forEach(function(y) {
      dummyVar += Math.pow(y - yAverage, 2);
    });

    return dummyVar/(n - 1);
  })());

  console.log('Gy: ', Gy);

  var Gxj = [];
  for (i = 0; i < k; i++) {
    Gxj.push(Math.sqrt((function() {
      var dummyVar = 0;

      xArrayForCalc[i].forEach(function(x) {
        dummyVar += Math.pow(x - getArrayAverage(xArrayForCalc[i]), 2);
      });

      return dummyVar/(n - 1);
    })()));
  }

  Gxj.forEach(function(G, j) {
    console.log('G[' + (j + 1) + ']: ', G);
  });

  var Rm = [[1,0,0,0], [0,1,0,0], [0,0,1,0], [0,0,0,1]];

  for (j = 0; j < k; j++) {
    for (var l = 0; l < k; l++) {
      if (l !== j) {
        dummyVar = 0;

        for (i = 0; i < n; i++) {
          dummyVar += ((xArrayForCalc[j][i] - getArrayAverage(xArrayForCalc[j])) * (xArrayForCalc[l][i] - getArrayAverage(xArrayForCalc[l])));
        }

        Rm[j][l] = Rm[l][j] = (dummyVar / ((n - 1) * Gxj[j] * Gxj[l]));
      }
    }
  }

  console.log("R Matric: ", Rm);

  var R0 = [];

  for (j = 0; j < k; j++) {
    dummyVar = 0;
    for (i = 0; i < n; i++) {
      dummyVar += ((yArray[i] - yAverage) * (xArrayForCalc[j][i] - getArrayAverage(xArrayForCalc[j])));
    }

    R0.push((dummyVar / ((n - 1) * Gy * Gxj[j])));
  }

  console.log("R0", R0);

  var i_R = math.inv(Rm);

  var aArray = math.multiply(R0, i_R);
  var bArray = [];
  aArray.forEach(function(a, j) {
    bArray.push(((a * Gy) / Gxj[j]));
  });

  console.log("A Array: ", aArray);

  bArray.unshift((function() {
    var val = yAverage;

    for (i = 0; i < k; i++) {
      val -= (bArray[i] * getArrayAverage(xArrayForCalc[i]));
    }

    return val;
  })());

  console.log("B: ", bArray);

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
  var ySAverage = getArrayAverage(ySArray);

  console.log('ySAverage: ', ySAverage);

  for (i = 0; i < n; i++) {
    ssR += Math.pow(ySArray[i] - ySAverage, 2);
  }

  console.log('SS(R): ', ssR);

  var ssO = 0;

  for (i = 0; i < n; i++) {
    ssO += Math.pow(yArray[i] - yAverage, 2);
  }

  console.log('yAverage: ', yAverage);

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