const express = require('express');
const fs = require('fs');
const { fetchCompanyData, fetchCompanyDataDb } = require('./alphaVantage'); // Relative path to fetchCompanyData.js
const { knexSelect, knexJoinSelect } = require('./databaseHandlers');
const { balanceSheetTests } = require('./calculations/balanceSheet');
const { checkCashFlow } = require('./calculations/cashflow');
const cors = require('cors');
const { checkIncomeStatement } = require('./calculations/incomeStatement');
const app = express();
app.use(cors());
const port = 3000;

app.get('/company', async (req, res) => {
  try {
    const companyName = req.query.companyName;
    const isDelete = req.query.isDelete === 'true';
    const path = `C:/Users/Drew/Desktop/docker/API/companies/${companyName}.json`;
    if (isDelete && fs.existsSync(path)) {
      fs.unlink(path, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('File deleted successfully.');
        }
      });
    }
    const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${companyName}&apikey=${process.env.API_KEY}`;
    if (companyName) {
      const companyData = await fetchCompanyDataDb(url, path);
      res.send(companyData);
    } else {
      res.status(400);
      res.send('Parameters are undefined');
    }
  } catch (error) {
    res.status(500).send('An error occurred.' + error);
  }
});

app.get('/company/cashFlow', async (req, res) => {
  try {
    const companyName = req.query.companyName;
    const url = `https://www.alphavantage.co/query?function=CASH_FLOW&symbol=${companyName}&apikey=${process.env.API_KEY}`;
    if (companyName) {
      const result = await fetchCompanyDataDb(url, 'cashFlow');
      res.send(result);
    } else {
      res.status(400);
      res.send('Parameters are undefined');
    }
  } catch (error) {
    res.status(500).send('An error occurred.' + error);
  }
});

app.get('/company/incomeStatement', async (req, res) => {
  try {
    const companyName = req.query.companyName;
    const url = `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${companyName}&apikey=${process.env.API_KEY}`;
    if (companyName) {
      const result = await fetchCompanyDataDb(url, 'incomeStatement');
      res.send(result);
    } else {
      res.status(400);
      res.send('Parameters are undefined');
    }
  } catch (error) {
    res.status(500).send('An error occurred.' + error);
  }
});

app.get('/company/balanceSheet', async (req, res) => {
  try {
    const companyName = req.query.companyName;
    const url = `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${companyName}&apikey=${process.env.API_KEY}`;
    if (companyName) {
      const result = await fetchCompanyDataDb(url, 'balanceSheet');
      res.send(result);
    } else {
      res.status(400);
      res.send('Parameters are undefined');
    }
  } catch (error) {
    res.status(500).send('An error occurred.' + error);
  }
});

app.get('/company/score', async (req, res) => {
  const companyName = req.query.companyName;
  try {
    const balanceSheet = await knexSelect(
      'balancesheet',
      [
        'retainedearnings',
        'fiscaldateending',
        'totalshareholderequity',
        'longtermdebt',
      ],
      companyName
    );
    const cashFlowBalanceSheet = await knexJoinSelect(
      'balancesheet',
      'cashflow',
      'MSFT'
    );
    const cashFlow = await knexSelect(
      'cashflow',
      ['fiscaldateending', 'netincome', 'capitalexpenditures'],
      companyName
    );
    const incomeStatement = await knexSelect(
      'incomestatement',
      ['fiscaldateending', 'netincome', 'grossprofit', 'totalrevenue'],
      companyName
    );
      
    res.send({
      balanceSheet: balanceSheetTests(balanceSheet, cashFlowBalanceSheet),
      cashFlow: checkCashFlow(cashFlow),
      incomeStatement: checkIncomeStatement(incomeStatement),
    });
  }catch(ex){
    res.status(500).send('Company Data not found')
  }
  
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
