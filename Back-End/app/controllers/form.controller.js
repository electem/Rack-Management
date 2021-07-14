const db = require("../models");
const Forms = db.products;
const Sequelize = require("sequelize");
const Op = db.Sequelize.Op;
const sequelize = require("../config/seq.config.js");
db.sequelize = sequelize;
db.Sequelize = Sequelize;
// Create and Save a new Product
exports.create = (req, res) => {
    //const data =  JSON.stringify(req.body.itemData)
    var itemName = req.query.tempName;
    var formData = JSON.stringify(req.body.attributes)
    const item = {
      attributes: formData,
      name: req.body.name,
      itemTempId: req.body.itemTempId,
      description: req.body.description,
    };
    
    let insert = `INSERT INTO ${itemName}_template(`;
  for (let key in item) {
    if(key === 'description') {
      insert += `${key}`;
    }else {
      insert += `${key}, `;
    }
     
  }
  insert += ") VALUES (";
  for (let key in item) {
    if(key === 'description') {
      insert += `'${item[key]}'`; 
    }else {
      insert += `'${item[key]}', `;
    }
  }
  insert += ")";

  insert += "RETURNING id";
  sequelize.query(insert, { type: sequelize.QueryTypes.INSERT, raw: true})
  .then(data => {
    res.send(data);
  })
  };


  // Retrieve all Forms from the database.
exports.findAll = (req, res) => {
  var itemTempId = req.query.itemTempId;
  var formName = req.query.formName;
  //var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
  // var condition = itemTempId ? { itemTempId: { [Op.eq]: itemTempId } } : null;
   let querys = `SELECT * FROM ${formName}_template`;
   sequelize.query(querys, { type: sequelize.QueryTypes.SELECT})
   .then(data => {
     res.send(data);
   })
   .catch(err => {
     res.status(500).send({
       message: "Error retrieving Form with id=" + itemTempId
     });
   });
};

// Find a single Forms with a customerId
exports.findOne = (req, res) => {
  const id = req.params.prodId;
  var name =  req.params.name;
  let query = `SELECT * FROM ${name}_template  WHERE id = ${id} `;
  sequelize.query(query, { type: sequelize.QueryTypes.SELECT})
  .then(data => {
    res.send(data);
  }).catch(err => {
      res.status(500).send({
        message: "Error retrieving Form with id=" + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  const name = req.params.name;
  let query = `UPDATE ${name}_template SET name = '${req.body.name}',description = '${req.body.description}',
  attributes = '${JSON.stringify(req.body.attributes)}' WHERE id = ${id}`;
  sequelize.query(query).then(num => {
      if (num == 1) {
        res.send({
          message: "Form was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Form with id=${id}. Maybe Form was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Form with id=" + id
      });
    });
};

// Delete a Forms with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  const name = req.params.name;
  let query = `Delete from ${name}_template WHERE id = ${id}`;
  sequelize.query(query, { type: sequelize.QueryTypes.DELETE}).then(num => {
    
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Form with id=" + id
      });
    });
};

// Delete a Forms with the specified id in the request
exports.deleteFromTemplate = (req, res) => {
  const itemtempid = req.params.id;
  const name = req.params.name;
  let query = `Delete from ${name}_template WHERE itemtempid = ${itemtempid}`;
  sequelize.query(query, { type: sequelize.QueryTypes.DELETE}).then(num => {
    
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Form with id=" + id
      });
    });
};