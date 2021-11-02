'use strict';
module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        daysInMonth: DataTypes.INTEGER,
        dayOnMarket: DataTypes.INTEGER,
        price: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }, {});
    return Product;
}