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

    if (
      await fs
        .access(path)
        .then(() => true)
        .catch(() => false)
    ) {
      console.log('File already exists');
      return 'File Already Exists';
    } else {
      await fs.appendFile(path, JSON.stringify(response.data));
      console.log('Data appended to file successfully.');
      return response.data;
    }
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
