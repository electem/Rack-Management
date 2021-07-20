const db = require("../models");
const TrayItem = db.trayItems;
const Sequelize = require("sequelize");
const Op = db.Sequelize.Op;
const sequelize = require("../config/seq.config.js");
exports.trayItemCreate = (req, res) => {

    const trayItem = {
      quantity: req.body.quantity,
      rackId: req.body.rackId,
      trayId: req.body.trayId,
      itemId: req.body.itemId,
    };

    // Save TrayItem in the database
    TrayItem.create(trayItem)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the TrayItem."
            });
        });
};

exports.fetchTrayItem = (req, res) => {
    const trayId= req.params.trayId;
    let query = `SELECT * FROM "trayItems" WHERE "trayId" = ${trayId} `;
    sequelize.query(query, { type: sequelize.QueryTypes.SELECT})
    .then(data => {
      res.send(data);
    }).catch(err => {
        res.status(500).send({
          message: "Error retrieving Form with id=" + trayId
        });
      });
  };