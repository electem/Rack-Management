const db = require("../models");
const files = db.files;
const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");
const sequelize = require("../config/seq.config.js");
db.Sequelize = Sequelize;
const baseUrl = "http://localhost:8080/files/";

exports.fileCreate = (req, res) => {
    const directoryPath = baseUrl + req.body.filename;
  const file = {
    filename: req.body.filename,
    filepath: directoryPath,
    user_fk:req.body.user_fk,
  };

  // Save Rack in the database
  files.create(file)
      .then(data => {
          res.send(data);
      })
      .catch(err => {
          res.status(500).send({
              message:
                  err.message || "Some error occurred while creating the Rack."
          });
      });
};

exports.findOne = (req, res) => {
    const user_fk= req.params.user_fk;
    let query = `SELECT * FROM files WHERE user_fk = ${user_fk} `;
    sequelize.query(query, { type: sequelize.QueryTypes.SELECT})
    .then(data => {
      res.send(data);
    }).catch(err => {
        res.status(500).send({
          message: "Error retrieving racks with user_fk=" + user_fk
        });
      });
  }

  exports.updateFile = (req, res) => {
    const directoryPath = baseUrl + req.body.filename;
    const id = req.params.id;
    const file = {
        filename: req.body.filename,
        filepath: directoryPath,
      };
    let query = `UPDATE files SET filepath = '${file.filepath}' WHERE id = ${id}`;
    sequelize.query(query).then(data => {
        if (data[1].rowCount >=1) {
          res.send({
            message: "profile password was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update profile password id=${id}`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Form with id=" + id
        });
      });
  };

