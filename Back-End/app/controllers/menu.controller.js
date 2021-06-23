const db = require("../models");
const Op = db.Sequelize.Op;
const Role = db.role;
const Menu=db.menus;
const Sequelize = require("sequelize");
const sequelize = require("../config/seq.config.js");
db.sequelize = sequelize;
db.Sequelize = Sequelize;

exports.menuCreate = (req, res) => {

  const menu = {
      label: req.body.label,
      action: req.body.action,
      menu_fk: req.body.menu_fk,
      roleId: req.body.roleId,
      templateID:req.body.templateID,
      clientFk: req.body.clientFk,
  };

  // Save Rack in the database
  Menu.create(menu)
};



exports.findMenuByItemId = (req, res) => {
    const id = req.params.itemId;
  
    Menu.findByPk(id)
      .then(data => {
       // data.dataValues.attributes =JSON.parse(data.dataValues.attributes);
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Tutorial with id=" + id
        });
      });
  };

exports.findAll = (req, res) => {
    var clientFk = req.query.clientFk;
    let query = `SELECT * FROM menus  WHERE "templateID" IS NULL OR "templateID" IN (SELECT "templateID" FROM Templates WHERE "clientFk" = ${clientFk})`;
    sequelize.query(query, { type: sequelize.QueryTypes.SELECT})
    .then(data => {
      res.send(data);
    }).catch(err => {
        res.status(500).send({
          message: "Error retrieving Form with id=" + id
        });
      });
  };

  exports.delete = (req, res) => {
    const templateID = req.params.templateID;
    Menu.destroy({
      where: { templateID: templateID }
    })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Tutorial with id=" + templateID
        });
      });
  };

