'use strict';
module.exports = (sequelize, DataTypes) => {

    const UserCode = sequelize.define('UserCode', {
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }, {});

    UserCode.associate = function(models) {
        UserCode.belongsTo(models.User);
        UserCode.belongsTo(models.Code);
    };
    
    return UserCode;
}

