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
    formId: req.body.formId,
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

exports.updateTrayItems = (req, res) => {
  const formId = req.params.formId;

  TrayItem.update(req.body, {
    where: { formId: formId }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "TrayItem was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update TrayItem with id=${formId}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating TrayItem with id=" + formId
      });
    });
};

exports.findAllItems = (req, res) => {
  let query = `SELECT * FROM "trayItems"`;
  sequelize.query(query, { type: sequelize.QueryTypes.SELECT})
  .then(data => {
    res.send(data);
  }).catch(err => {
      res.status(500).send({
        message: "Error retrieving racks with client_fk=" + client_fk
      });
    });
};

exports.fetchItem = (req, res) => {
  const formId = req.params.formId;
  let query = `SELECT * FROM "trayItems" WHERE "formId" = ${formId} `;
  sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
    .then(data => {
      res.send(data);
    }).catch(err => {
      res.status(500).send({
        message: "Error retrieving trayItems with formId=" + formId
      });
    });
};