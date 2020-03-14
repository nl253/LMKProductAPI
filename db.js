const { Sequelize, Model, DataTypes } = require('sequelize');

module.exports = class DB {
  constructor() {
    this.sequelize = new Sequelize(process.env.DB_URI, {
      define: {
        freezeTableName: true,
      },
    });
    /** @type {Model} */
    this.Product = null;
  }

  /**
   * @return {Promise<void>}
   */
  async connect() {
    class Product extends Model {}

    const options = {
      sequelize: this.sequelize,
      modelName: 'Product',
      timestamps: false,
    };

    const attributes = {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      price: DataTypes.FLOAT,
      stock: DataTypes.INTEGER,
      updated: DataTypes.DATE,
    };

    try {
      Product.init(attributes, options);
      await this.sequelize.sync({ force: process.env.NODE_ENV !== 'production' });

      if (process.env.NODE_ENV !== 'production') {
        await Product.bulkCreate(require('./data.json'));
      }
    } catch (e) {
      console.error(e);
      throw e;
    }

    this.Product = Product;

    console.log('database connection made');
  }
};
