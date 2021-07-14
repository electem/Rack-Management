const db = require("../models");
const TrayItem = db.trayItems;
const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");
db.Sequelize = Sequelize;

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