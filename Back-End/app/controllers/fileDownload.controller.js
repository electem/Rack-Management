const db = require("../models");
const fileOp = require("fs");
const files = db.files;
const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");
const sequelize = require("../config/seq.config.js");
db.Sequelize = Sequelize;
const baseUrl = "http://localhost:8080/files/profile/";
const directoryPath = __basedir + "/resources/static/assets/uploads/";

exports.fileCreate = (req, res) => {
    const filePath = baseUrl + req.body.filename;
  const file = {
    filename: req.body.filename,
    filepath: filePath,
    user_fk:req.body.user_fk,
    tray_fk:req.body.tray_fk,
  };

  // Save File in the database
  files.create(file)
      .then(data => {
          res.send(data);
      })
      .catch(err => {
          res.status(500).send({
              message:
                  err.message || "Some error occurred while creating the File."
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
          message: "Error retrieving while fetching File with user_fk=" + user_fk
        });
      });
  }

  exports.updateFile = (req, res) => {
    const uploadedFile = directoryPath + req.body.filename;
    const id = req.params.id;
    const file = {
        filename: req.body.filename,
        filepath: uploadedFile,
      };
      
    let query = `UPDATE files SET filepath = '${file.filepath}',filename = '${file.filename}' WHERE id = ${id}`;
    sequelize.query(query).then(data => {
        if (data[1].rowCount >=1) {
            fileOp.rename(uploadedFile, directoryPath+"/profile/"+file.filename, (err) => {
              if (err) throw err;
              console.log('Rename complete!');
          })

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

  exports.fetchTrayFile = (req, res) => {
    let query = `SELECT * FROM files WHERE tray_fk IS NOT NULL; `;
    sequelize.query(query, { type: sequelize.QueryTypes.SELECT})
    .then(data => {
      res.send(data);
    }).catch(err => {
        res.status(500).send({
          message: "Error retrieving while fetching File with tray_fk=" + tray_fk
        });
      });
  }

  exports.updateTrayByFile = (req, res) => {
    const directoryPath = baseUrl + req.body.filename;
    const tray_fk = req.params.tray_fk;
    const file = {
        filename: req.body.filename,
        filepath: directoryPath,
      };
    let query = `UPDATE files SET filepath = '${file.filepath}' WHERE tray_fk = ${tray_fk}`;
    sequelize.query(query).then(data => {
        if (data[1].rowCount >=1) {
          res.send({
            message: "profile password was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update profile password tray_fk=${tray_fk}`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Form with tray_fk=" + tray_fk
        });
      });
  };

