'use strict';

module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.addColumn(
            'Codes',
            'multiUse',
            Sequelize.BOOLEAN
        );
    },

    down: function(queryInterface, Sequelize) {
        return queryInterface.removeColumn(
            'Codes',
            'multiUse'
        );
    }
};
