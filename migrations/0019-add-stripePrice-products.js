'use strict';

module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.addColumn(
            'Products',
            'stripePrice',
            Sequelize.STRING
        );
    },

    down: function(queryInterface, Sequelize) {
        return queryInterface.removeColumn(
            'Products',
            'stripePrice'
        );
    }
};
