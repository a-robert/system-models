/* global math */
/* global jQuery */
jQuery(document).ready(function ($) {
  var xMIN = 0;
  var xMAX = 6;
  var zMIN = -5;
  var zMAX = 7;
  var i;
  var dummyVar;
  var j;
  var testModelCoefficients = [];

  var $tBody = $('tbody');

  var nArray = [];
  var xArray = [];
  var zArray = [];
  var n = 20;

  $('.answer').text('Arman')

  // initializing arrays.
  for (i = 0; i < n; i++) {
    nArray.push(i + 1);
    xArray.push(getRandomNumber(xMIN, xMAX));
    zArray.push(getRandomNumber(zMIN, zMAX));
  }

  // rendering to table.
  for (i = 0; i < n; i++) {
    var $trTemp = $(
      '<tr>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
      '</tr>'
    );
    $trTemp.find('td:eq(0)').text(nArray[i]);
    $trTemp.find('td:eq(1)').text(xArray[i]);
    $trTemp.find('td:eq(2)').text(zArray[i]);
    $tBody.append($trTemp);
  }

  var a11 = 0;
  var a12 = 0;
  var a13 = 0;
  var a14 = 0;
  var a21 = 0;
  var a22 = 0;
  var a23 = 0;
  var a24 = 0;
  var a31 = 0;
  var a32 = 0;
  var a33 = 0;
  var a34 = 0;
  var a41 = 0;
  var a42 = 0;
  var a43 = 0;
  var a44 = 0;

  var c1 = 0;
  var c2 = 0;
  var c3 = 0;
  var c4 = 0;

  for (i = 1; i < n; i++) {
    a11 += Math.pow(xArray[i - 1], 2);
    a12 += xArray[i - 1] * zArray[i - 1];
    a21 += xArray[i - 1] * zArray[i - 1];
    a22 += Math.pow(zArray[i - 1], 2);
    c1 += zArray[i] * xArray[i - 1];
    c2 += zArray[i] * zArray[i - 1];
  }

  var aArray = [[a11, a12], [a21, a22]];
  console.log('A array: ', aArray);

  var cArray = [c1, c2];
  console.log('C array: ', cArray);

  var i_aArray = math.inv(aArray);
  var bArray = math.multiply(cArray, i_aArray);
  console.log('b Array: ', bArray);

  var zCalc = [];

  for (i = 1; i < n; i++) {
    zCalc.push(bArray[0] * xArray[i - 1] + bArray[1] * zArray[i - 1]);
  }

  var G1;
  var sum = 0;

  for (i = 1; i < n; i++) {
    sum += Math.pow(zArray[i] - zCalc[i - 1], 2);
  }

  G1 = Math.sqrt(sum / (n - 3));

  console.log('G1: ', G1);


  for (i = 2; i < n; i++) {
    a11 += Math.pow(xArray[i - 1], 2);
    a12 += xArray[i - 1] * zArray[i - 1];
    a13 += xArray[i - 1] * xArray[i - 2];
    a14 += xArray[i - 1] * zArray[i - 2];

    a21 += xArray[i - 1] * zArray[i - 1];
    a22 += Math.pow(zArray[i - 1], 2);
    a23 += xArray[i - 2] * zArray[i - 1];
    a24 += zArray[i - 2] * zArray[i - 1];

    a31 += xArray[i - 1] * xArray[i - 2];
    a32 += xArray[i - 2] * zArray[i - 1];
    a33 += Math.pow(xArray[i - 2], 2);
    a34 += xArray[i - 2] * zArray[i - 2];

    a41 += xArray[i - 1] * zArray[i - 2];
    a42 += zArray[i - 2] * zArray[i - 1];
    a43 += xArray[i - 2] * zArray[i - 2];
    a44 += Math.pow(zArray[i - 2], 2);

    c1 += zArray[i] * xArray[i - 1];
    c2 += zArray[i] * zArray[i - 1];
    c3 += zArray[i] * xArray[i - 2];
    c4 += zArray[i] * zArray[i - 2];
  }

  aArray = [[a11, a12, a13, a14], [a21, a22, a23, a24], [a31, a32, a33, a34], [a41, a42, a43, a44]];
  console.log('A array: ', aArray);
  cArray = [c1, c2, c3, c4];
  console.log('C array: ', cArray);

  i_aArray = math.inv(aArray);
  bArray = math.multiply(cArray, i_aArray);
  console.log('b Array: ', bArray);

  var G2;
  sum = 0;

  zCalc = [];

  for (i = 2; i < n; i++) {
    zCalc.push(bArray[0] * xArray[i - 1] + bArray[1] * zArray[i - 1] + bArray[2] * xArray[i - 2] + bArray[3] * zArray[i - 2]);
  }

  for (i = 2; i < n; i++) {
    sum += Math.pow(zArray[i] - zCalc[i - 2], 2);
  }

  G2 = Math.sqrt(sum / (n - 6));

  console.log('G2: ', G2);

  if (G2 >= G1) {
    console.log('N = 1 depqy optimal e !');
  } else {
    console.log('petq e ancnel N = 3 depqin');
  }

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
