'use strict';

module.exports = {
    up: function(queryInterface, Sequelize){
        return queryInterface.addColumn(
            'BillingEvents',
            'ProductId',
            {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "Products",
                    key: 'id'
                }
            }
        );
    },
    down: function(queryInterface, Sequelize){
        return queryInterface.removeColumn(
            'BillingEvents',
            'ProductId'
        );
    }
};