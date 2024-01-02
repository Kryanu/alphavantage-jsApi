const calcAverage = (array) => {
    return array.reduce((a, b) => a + b) / array.length;
}

const getHighestValue = (array) => {
    const highestValue = array.reduce((acc, ticker) => Math.max(acc, ticker.h), 0);
    return highestValue;
  }

const pricePercentage = (close, ath) => {
    return ((ath - close) / ath) * 100
}

module.exports = {
    getHighestValue,
    calcAverage,
    pricePercentage
}