'use strict'
module.exports = (sequelize, DataTypes) => {
    const BillingEvent = sequelize.define('BillingEvent', {
        start: DataTypes.DATE,
        end: DataTypes.DATE,
        ListingId: DataTypes.INTEGER,
        owner: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }, {});

    BillingEvent.associate = function(models){
        BillingEvent.belongsTo(models.BillingCycle);
    };

    return BillingEvent;
}
