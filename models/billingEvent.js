'use strict'
module.exports = (sequelize, DataTypes) => {
    const BillingEvent = sequelize.define('BillingEvent', {
        start: DataTypes.DATE,
        end: DataTypes.DATE,
        ListingId: DataTypes.INTEGER,
        owner: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        ProductId: DataTypes.INTEGER,
        daysOnMarket: {
            type: DataTypes.VIRTUAL,
            get(){

                var time = this.end - this.start;
                var days = time / (1000 * 3600 * 24);
                return days.toFixed(2);
            }
        },
        cost: {
            type: DataTypes.VIRTUAL,
            get() {
                var time = this.end - this.start;
                var days = time / (1000 * 3600 * 24);
                var cost = days * 0.82;
                var costFormatted = "$"+cost.toFixed(2);
                return costFormatted;
            }
        }
    }, {});

    BillingEvent.associate = function(models){
        BillingEvent.belongsTo(models.BillingCycle);
        BillingEvent.belongsTo(models.Product);
    };

    return BillingEvent;
}


