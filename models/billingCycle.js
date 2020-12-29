'use strict'
module.exports = (sequelize, DataTypes) => {
    const BillingCycle = sequelize.define('BillingCycle', {
        start: DataTypes.DATE,
        end: DataTypes.DATE,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }, {});;
    return BillingCycle;
}
