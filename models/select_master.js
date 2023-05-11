"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class select_master extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      select_master.hasMany(models.option_master, {
        foreignKey: "select_id",
      });
    }
  }
  select_master.init(
    {
      select_name: DataTypes.STRING,
      email: DataTypes.STRING,
      type: DataTypes.STRING,
      key: DataTypes.INTEGER,
    },
    {
      sequelize,
      paranoid: true,
      modelName: "select_master",
    }
  );
  return select_master;
};
