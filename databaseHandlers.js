const hash = require('object-hash');
const knex = require('knex');

const knexConfig = {
  client: 'postgres',
  connection: {
    host: '172.17.0.2',
    // host:'127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: 'pass',
    database: 'postgres',
  },
};

const insert = (table, payload) => {
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
  insert('cashflow', dbPayload);
  insert('companies',{symbol})
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
  insert('incomestatement', dbPayload);
  insert('companies',{symbol})
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

  insert('balancesheet', dbPayload);
  insert('companies',{symbol})
};

const select = async (table, columns, symbol) => {
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

const selectAll = async (table, columns, symbol) => {
  const knexDb = knex(knexConfig);
  try {
    return await knexDb(table)
      .select()
  } catch (ex) {
    console.log(ex);
  } finally {
    knexDb.destroy();
  }
};

const distinctSelect = async (table, col) => {
    const knexDb = knex(knexConfig);
    try {
      return await knexDb(table)
      .select(col)
      .distinct()
    }catch (ex){
      console.log(ex);
    }finally {
      knexDb.destroy();
    }
}

const joinSelect = async (table, joinTable, companyName) => {
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

const update = async (table,symbol,data) => {
  const knexDb = knex(knexConfig);
  try{
    return await knexDb(table)
    .where('symbol', '=',symbol)
    .update(data)
    
  }catch(ex){

  }finally {
    knexDb.destroy();
  }
}

exports.cashFlowInsert = cashFlowInsert;
exports.incomeStatementInsert = incomeStatementInsert;
exports.balanceSheetInsert = balanceSheetInsert;
exports.knexSelect = select;
exports.knexJoinSelect = joinSelect;
exports.knexDistinctSelect = distinctSelect;
exports.update = update;
exports.selectAll = selectAll;