'use strict'
module.exports = (sequelize, DataTypes) => {
    const BillingCycle = sequelize.define('BillingCycle', {
        start: DataTypes.DATE,
        end: DataTypes.DATE,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        startDate: {
            type: DataTypes.VIRTUAL,
            get() {
                //var startDate = Date.parse(this.start);
                var startDate = new Date(this.start);
                startDate = startDate.toDateString();
                return startDate;
            }
        },
        endDate: {
            type: DataTypes.VIRTUAL,
            get() {
                //var endDate = Date.parse(this.end);
                var endDate = new Date(this.end);
                endDate = endDate.toDateString();
                return endDate;
            }
        }
    }, {});;
    BillingCycle.associate = function(models){
        BillingCycle.hasMany(models.BillingEvent, {as: 'billingEvents'});
    };
    return BillingCycle;
}
