const axios = require('axios');


/*
  c*number
  The close price for the symbol in the given time period.

  h*number
  The highest price for the symbol in the given time period.

  l*number
  The lowest price for the symbol in the given time period.

  ninteger
  The number of transactions in the aggregate window.

  o*number
  The open price for the symbol in the given time period.

  t*integer
  The Unix Msec timestamp for the start of the aggregate window.

  v*number
  The trading volume of the symbol in the given time period.

  vwnumber
  The volume weighted average price.
*/

const retrieveData = async (url) => {
    try {
        const response = await axios.get(url, { responseType: 'json' });
        return response.data;
      } catch (error) {
        console.error('Error:', error.message);
        throw error;
      }
}

module.exports = {
    retrieveData
};
