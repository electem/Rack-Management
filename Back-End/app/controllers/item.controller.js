const db = require("../models");
const Sequelize = require("sequelize");
const sequelize = require("../config/seq.config.js");
db.sequelize = sequelize;
db.Sequelize = Sequelize;

const Items = db.templates;
const Op = db.Sequelize.Op;
const Menu =  require("./menu.controller.js");
// Create and Save a new Template
exports.create = (req, res) => {
  // Validate request

  //const data =  JSON.stringify(req.body.itemData)
  var ites = JSON.stringify(req.body.attributes)
  const item = {
    attributes: ites,
    name: req.body.name,
    description: req.body.description,
    clientFk: req.body.clientFk,
  };

  let query = `CREATE TABLE ${req.body.name}_template (`;
             query += `id SERIAL PRIMARY KEY, name character varying(255),  itemTempId integer, description character varying(255), attributes json, createdAt timestamp with time zone NULL,
             updatedAt timestamp with time zone NULL, CONSTRAINT ${req.body.name}_fkey FOREIGN KEY (itemTempId)
             REFERENCES templates (id)
             ON UPDATE NO ACTION ON DELETE NO ACTION`;
        query += ")";

        sequelize.query(query, { type: sequelize.QueryTypes.CREATE})
        .then(data => {
        })
        .catch(err => {
          res.status(500).send({
            message: "Error retrieving Templates with id=" + id
          });
    });   
    
     // Save Template in the database
  Items.create(item)
  .then(data => {
    var citemData = JSON.parse(data.dataValues.attributes);
    req.body.label = data.dataValues.name;
    req.body.action = "menu" + '/' + data.dataValues.name + '/' + data.dataValues.id;
    req.body.roleId = 1,
    req.body.menu_fk = 1,
    req.body.templateID = data.dataValues.id;
    Menu.menuCreate(req, res);
    citemData.forEach(function(citemData) {
        data.dataValues[citemData.name] = citemData.value;
    });
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the users."
    });
  });
};

// Retrieve all Templates from the database.
exports.findAll = (req, res) => {
  var name = req.query.name;
  var clientFk = req.query.clientFk;
  var condition = clientFk ? { clientFk: { [Op.eq]: clientFk } } : null;
  Items.findAll({ where: condition})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Users."
      });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Items.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Template was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Template with id=${id}. Maybe Template was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Template with id=" + id
      });
    });
};

// Delete a Template with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Items.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Template was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Template with id=${id}. Maybe Template was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Template with id=" + id
      });
    });
};

// Find a single Customer with a customerId
exports.findOne = (req, res) => {
  const id = req.params.id;

  Items.findByPk(id)
    .then(data => {
     // data.dataValues.attributes =JSON.parse(data.dataValues.attributes);
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Template with id=" + id
      });
    });
};


