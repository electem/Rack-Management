module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.BIGINT
    },
    location: {
      type: Sequelize.STRING
    },
    status:{
      type:Sequelize.STRING,
      defaultValue:"REGISTERED"
    },
    clientFk: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {         
        model: 'clients',
        key: 'id'
      }
    },
    planFk: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {         
        model: 'plans',
        key: 'id'
      }
      },
  }, {});

  User.associate = (models) => {
    User.belongsTo(models.Client, { foreignKey: 'clientFk', as: 'client' })
};

User.associate = (models) => {
  User.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' })
};

User.associate = (models) => {
  User.belongsTo(models.Plan, { foreignKey: 'planFk', as: 'plans' })
};

  return User;
};
