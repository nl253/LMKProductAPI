const { Op } = require('sequelize');

/**
 * @param {Record<string, *>} q
 */
const transformQuery = (q) => {
  const query = { ...q };
  for (const key of Object.keys(q)) {
    if (parseInt(query[key]).toString() === query[key]) {
      query[key] = { [Op.eq]: parseInt(query[key]) };
    } else if (parseFloat(query[key]).toString() === query[key]) {
      query[key] = { [Op.eq]: parseFloat(query[key]) };
    } else if (typeof query[key] === 'string') {
      query[key] = { [Op.substring]: query[key] };
    } else {
      throw new Error(`could not understand ${key} = ${query[key]}`);
    }
  }
  return query;
};

module.exports = { transformQuery };
