/**
 * @param {string} name
 * @param {'query'|'params'|'body'} what
 * @return {*}
 */
const validateJSONSchema = (name, what = 'body') => {
  if (process.env.NODE_ENV === 'production') {
    return (req, res, next) => next();
  }
  const Ajv = require('ajv');
  const ajv = new Ajv({ allErrors: true });
  const cache = {};
  return (req, res, next) => {
    const p = `./schema/${name}.json`;
    let schema;
    if (cache[p]) {
      schema = cache[p];
    } else {
      schema = require(p);
      cache[p] = schema;
    }
    const validate = ajv.compile(schema);
    const valid = validate(req[what]);
    if (valid) {
      next(null);
    } else {
      const err = new Error();
      err.message = validate.errors.map(({ message, keyword, dataPath }) => `ERROR [${keyword}] ${dataPath} - ${message}`).filter(Boolean).join(', ');
      err.name = 'ValidationError';
      console.error(err);
      next(err);
    }
  };
};

module.exports = { validateJSONSchema };
