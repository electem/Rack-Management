module.exports = (sequelize, Sequelize) => {
    const trayItem = sequelize.define('trayItems', {
        quantity: {
            type: Sequelize.INTEGER,
        },
        formId: {
          type: Sequelize.INTEGER,
      },
        rackId: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {         
              model: 'racks',
              key: 'id'
            }
          },
          trayId: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {         
              model: 'trays',
              key: 'id'
            }
          },

    });

    trayItem.associate = (models) => {
        trayItem.belongsTo(models.Rack, { foreignKey: 'rackId', as: 'rack' })
    };

    trayItem.associate = (models) => {
        trayItem.belongsTo(models.Tray, { foreignKey: 'trayId', as: 'tray' })
    };

    return trayItem;
}