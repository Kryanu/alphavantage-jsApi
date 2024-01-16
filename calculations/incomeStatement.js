const { calcAverage } = require('../helpers');

const parseIncomeStatement = (incomeSheet) => {
  return incomeSheet.map((x) => {
    return {
      fiscalDateEnding: new Date(x.fiscaldateending),
      grossProfit: parseInt(x.grossprofit),
      netIncome: parseInt(x.netincome),
      totalRevenue: parseInt(x.totalrevenue),
    };
  });
};

const checkNetProfit = (incomeStatement) => {
  let netProfitIncrease = true;
  let previousIncome = null;
  let years = [];
  let success = true;
  incomeStatement.sort((a, b) => a.fiscaldateending - b.fiscaldateending);
  for (let i = 0; i < incomeStatement.length; i++) {
    const x = incomeStatement[i];
    if (previousIncome !== null && x.netProfit <= previousIncome) {
      netProfitIncrease = false;
      success = false;
      break;
    }

    previousIncome = x.netProfit;
    years.push(1);
  }

  return {
    success: success,
    value: netProfitIncrease,
    years: years.length,
  };
};

const checkGrossProfitMarginAvg = (incomeStatement) => {
  let success = false;
  const res = incomeStatement.map((x) => {
    return (parseInt(x.grossProfit) / parseInt(x.totalRevenue)) * 100;
  });
  let grossMargin = calcAverage(res);
  if (grossMargin > 40) {
    success = true;
  }
  return {
    success: success,
    value: grossMargin,
  };
};

const checkNetProfitMarginAvg = (incomeStatement) => {
  let success = false;
  const res = incomeStatement.map((x) => {
    return (parseInt(x.netIncome) / parseInt(x.totalRevenue)) * 100;
  });

  let netMargin = calcAverage(res);
  if (netMargin > 20) {
    success = true;
  }
  return {
    success: success,
    value: netMargin,
  };
};

const checkIncomeStatement = (incomeStatement) => {
  const parsed = parseIncomeStatement(incomeStatement);
  let success = 0;
  let totalTests = 0;
  const results = {
    netProfit: checkNetProfit(parsed),
    grossProfitMarginAvg: checkGrossProfitMarginAvg(parsed),
    netProfitMarginAvg: checkNetProfitMarginAvg(parsed),
  };
  for(const test in results){
    totalTests++;
    if(results[test].success){
      success++;
    }
  }
  return {
    tests:results,
    successCount: success,
    totalTests 
  }
};

exports.checkIncomeStatement = checkIncomeStatement;
