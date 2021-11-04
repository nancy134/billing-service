'use strict';
module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        daysInMonth: DataTypes.INTEGER,
        dayOnMarket: DataTypes.INTEGER,
        price: DataTypes.INTEGER,
        stripeProduct: DataTypes.STRING,
        stripePrice: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }, {});
    return Product;
}