'use strict'
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('BillingEvents', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            start: {
                type: Sequelize.DATE
            },
            end: {
                type: Sequelize.DATE
            },
            ListingId: {
                type: Sequelize.INTEGER
            },
            owner: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
               allowNull: false,
               type: Sequelize.DATE
            },
            BillingCycleId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'BillingCycles',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            }
        });
    }
}
