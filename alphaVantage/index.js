const axios = require('axios');
const fs = require('fs/promises');

const {
  cashFlowInsert,
  incomeStatementInsert,
  balanceSheetInsert,
} = require('../databaseHandlers');

async function fetchCompanyData(url, path) {
  try {
    const response = await axios.get(url, { responseType: 'json' });
    return response.data;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

async function fetchCompanyDataDb(url, type) {
  try {
    const response = await axios.get(url, { responseType: 'json' });
    switch (type) {
      case 'cashFlow':
        cashFlowInsert(response);
        break;
      case 'incomeStatement':
        incomeStatementInsert(response);
        break;
      case 'balanceSheet':
        balanceSheetInsert(response);
        break;
    }

    return response.data;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

module.exports = {
  fetchCompanyDataDb: fetchCompanyDataDb,
  fetchCompanyData: fetchCompanyData,
};
