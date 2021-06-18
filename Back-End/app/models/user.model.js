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
    confirmPass: {
      type: Sequelize.STRING
    },
    location: {
      type: Sequelize.STRING
    },
    status:{
      type:Sequelize.STRING,
      defaultValue:"registered"
    },
    clientFk: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {         
        model: 'clients',
        key: 'id'
      }
    }
  }, {});

  User.associate = (models) => {
    User.belongsTo(models.Client, { foreignKey: 'clientFk', as: 'client' })
};

  User.associate = function (models) {
    User.hasMany(models.userProfile, { as: 'userProfile' })
    };

User.associate = (models) => {
  User.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' })
};

  return User;
};
