const { calcAverage } = require('../helpers');

const parseBalanceSheetData = (balanceSheetData) => {
  return balanceSheetData.map((x) => {
    return {
      fiscaldateending: new Date(x.fiscaldateending),
      retainedearnings: parseInt(x.retainedearnings),
      longtermdebt: parseInt(x.longtermdebt),
      totalshareholderequity: parseInt(x.totalshareholderequity),
    };
  });
};

const parseIncomeSheetData = (incomeSheet) => {
  return incomeSheet.map((x) => {
    return {
      fiscaldateending: new Date(x.fiscaldateending),
      retainedearnings: parseInt(x.retainedearnings),
      longtermdebt: parseInt(x.longtermdebt),
      totalshareholderequity: parseInt(x.totalshareholderequity),
      netincome: parseInt(x.netincome),
    };
  });
};

const checkRetainedEarnings = (balanceSheetData) => {
  let retainedEarningsIncrease = true;
  let previousIncome = null;
  let years = [];
  let data = balanceSheetData;
  let success = true;
  data.sort((a, b) => a.fiscaldateending - b.fiscaldateending);
  for (let i = 0; i < data.length; i++) {
    const x = data[i];
    if (previousIncome !== null && x.retainedearnings <= previousIncome) {
      retainedEarningsIncrease = false;
      success = false;
      break;
    }
    previousIncome = x.retainedearnings;
    years.push(1);
  }

  return {
    success: success,
    value: retainedEarningsIncrease,
    years: years.length,
  };
};

const checkReturnOnEquity = (balanceSheet) => {
  const res = balanceSheet.map((x) => {
    return (parseInt(x.netincome) / parseInt(x.totalshareholderequity)) * 100;
  });
  return { value: calcAverage(res), success: calcAverage(res) > 40 };
};

const checkLongTermDebt = (balanceSheet) => {
  const netIncome = balanceSheet.map((x) => {
    return x.netincome;
  });
  const debt = balanceSheet.map((x) => {
    return x.longtermdebt;
  });
  const avgNetIncome = calcAverage(netIncome);
  const avgDebt = calcAverage(debt);
  if (avgDebt > avgNetIncome) {
    return { value: true, success: false };
  }
  return { value: false, success: true };
};

const balanceSheetTests = (balancesheet, incomeJoinTable) => {
  let incomeSheet = parseIncomeSheetData(incomeJoinTable);
  let count = 0;
  const results = {
    retainedEarnings: checkRetainedEarnings(
      parseBalanceSheetData(balancesheet)
    ),
    returnOnEquity: checkReturnOnEquity(incomeSheet),
    longTermDebt: checkLongTermDebt(incomeSheet),
  };
  for(const test in results){
    if(results[test].success){
      count++;
    }
  }

  return {
    ...results,
    successCount: count
  }
};

exports.checkRetainedEarnings = checkRetainedEarnings;
exports.balanceSheetTests = balanceSheetTests;
