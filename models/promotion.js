'use strict';
module.exports = (sequelize, DataTypes) => {
    const Promotion = sequelize.define('Promotion', {
        description: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }, {});
    return Promotion;
}

