const calcAverage = (array) => {
    return array.reduce((a, b) => a + b) / array.length;
}

exports.calcAverage = calcAverage