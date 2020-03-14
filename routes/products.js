const express = require('express');

const router = express.Router();

const { transformQuery } = require('./utils');
const { validateJSONSchema } = require('../middleware');

const DB = require('../db');

const db = new DB();

db.connect();

router.put('/', async (req, res, next) => {
  try {
    await db.Product.destroy({ truncate: true });
    const products = await db.Product.bulkCreate(req.body);
    res.json(products);
  } catch (e) {
    next(e);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const products = await db.Product.findAll({
      order: db.sequelize.col('updated'),
    });
    res.json(products);
  } catch (e) {
    next(e);
  }
});

router.get(
  '/search',
  validateJSONSchema('products/get-search-query', 'query'),
  async (req, res, next) => {
    try {
      const products = await db.Product.findAll({
        where: transformQuery(req.query),
      });
      res.json(products);
    } catch (e) {
      next(e);
    }
  },
);

router.patch(
  '/:id',
  validateJSONSchema('products/put-id-body', 'body'),
  async (req, res, next) => {
    try {
      await db.Product.update(req.body, { where: { id: req.params.id } });
      res.send().status(200);
    } catch (e) {
      next(e);
    }
  },
);

module.exports = router;
