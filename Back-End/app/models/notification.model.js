module.exports = (sequelize, Sequelize) => {
    const notification = sequelize.define("notifications", {
        notificationType: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.JSON,
    },
      noOfRetry: {
        type: Sequelize.INTEGER,
    },
      user_fk: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {         
          model: 'users',
          key: 'id'
        }
        },

    });

    notification.associate = (models) => {
        notification.belongsTo(models.User, { foreignKey: 'user_fk', as: 'users' })
    };
    
  
    return notification;
  };
  