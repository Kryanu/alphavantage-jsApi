const hash = require('object-hash');
const knex = require('knex');

const knexConfig = {
  client: 'postgres',
  connection: {
    host: '172.17.0.3',
    // host:'127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: 'pass',
    database: 'postgres',
  },
};

const knexInsert = (table, payload) => {
  const knexDb = knex(knexConfig);
  knexDb(table)
    .insert(payload)
    .then((res) => {
      console.log(res);
    })
    .catch((ex) => {
      console.log(ex);
    })
    .finally(() => {
      knexDb.destroy();
    });
};

const cashFlowInsert = (response) => {
  const { symbol, annualReports } = response.data;
  const dbPayload = annualReports.map((x) => {
    return {
      hash: hash(x),
      symbol,
      fiscaldateending: x.fiscalDateEnding,
      netincome: parseInt(x.netIncome),
      capitalexpenditures: parseInt(x.capitalExpenditures),
    };
  });
  knexInsert('cashflow', dbPayload);
};

const incomeStatementInsert = (response) => {
  const { symbol, annualReports } = response.data;
  const dbPayload = annualReports.map((x) => {
    return {
      hash: hash(x),
      symbol,
      fiscaldateending: x.fiscalDateEnding,
      netincome: parseInt(x.netIncome),
      grossprofit: parseInt(x.grossProfit),
      totalrevenue: parseInt(x.totalRevenue),
    };
  });
  knexInsert('incomestatement', dbPayload);
};

const balanceSheetInsert = (response) => {
  const { symbol, annualReports } = response.data;
  const dbPayload = annualReports.map((x) => {
    return {
      hash: hash(x),
      symbol,
      fiscaldateending: x.fiscalDateEnding,
      retainedearnings: parseInt(x.retainedEarnings),
      totalshareholderequity: parseInt(x.totalShareholderEquity),
      longtermdebt: parseInt(x.longTermDebt),
    };
  });

  knexInsert('balancesheet', dbPayload);
};

const knexSelect = async (table, columns, symbol) => {
  const knexDb = knex(knexConfig);
  try {
    return await knexDb(table)
      .columns(columns)
      .select()
      .where({ symbol: symbol });
  } catch (ex) {
    console.log(ex);
  } finally {
    knexDb.destroy();
  }
};

const knexJoinSelect = async (table, joinTable, companyName) => {
  const knexDb = knex(knexConfig);
  try {
    return await knexDb
      .select('*')
      .from(table)
      .join(joinTable, function () {
        this.on(`${table}.symbol`, '=', `${joinTable}.symbol`).andOn(
          `${table}.fiscaldateending`,
          '=',
          `${joinTable}.fiscaldateending`
        );
      })
      .where(`${table}.symbol`, '=', companyName);
  } catch (ex) {
    console.log(ex);
  } finally {
    knexDb.destroy();
  }
};

exports.cashFlowInsert = cashFlowInsert;
exports.incomeStatementInsert = incomeStatementInsert;
exports.balanceSheetInsert = balanceSheetInsert;
exports.knexSelect = knexSelect;
exports.knexJoinSelect = knexJoinSelect;
