'use strict';
module.exports = (sequelize, DataTypes) => {

    const Code = sequelize.define('Code', {
        code: DataTypes.STRING,
        description: DataTypes.STRING,
        multiUse: DataTypes.BOOLEAN,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }, {});

    Code.associate = function(models) {
        Code.belongsTo(models.Promotion);
        Code.belongsToMany(models.User, {as: 'user', through: models.UserCode});
    };
    
    return Code;
}

