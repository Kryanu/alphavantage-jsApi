const { calcAverage } = require('../helpers');
const parseCashFlow = (incomeSheet) => {
  return incomeSheet.map((x) => {
    return {
      fiscaldateending: new Date(x.fiscaldateending),
      capitalexpenditures: parseInt(x.capitalexpenditures),
      netincome: parseInt(x.netincome),
    };
  });
};

const checkCapEx = (cashFlow) => {
  let success = true;
  let state = '';
  const res = cashFlow.map((x) => {
    return (parseInt(x.capitalexpenditures) / parseInt(x.netincome)) * 100;
  });
  let answer = calcAverage(res);
  if (answer < 25) {
    state = 'veryGood';
  } else if (answer < 50) {
    state = 'accepted';
  } else {
    success = false;
    state = 'rejected';
  }
  return {
    value: answer,
    success: success,
    state: state,
  };
};

const checkCashFlow = (cashFlow) => {
  const parsedData = parseCashFlow(cashFlow);
  const results = {
    capExOnEarnings: checkCapEx(parsedData),
  };
  let totalTests = 0;
  let success = 0;
  if(results.capExOnEarnings.success){
    success++;
  }
  totalTests++;
  return {
    tests:results,
    successCount:success,
    totalTests
  }
};

exports.checkCashFlow = checkCashFlow;
