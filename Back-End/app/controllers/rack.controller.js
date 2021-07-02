const db = require("../models");
const Rack = db.racks;
const Op = db.Sequelize.Op;
const Tray = db.trays;
const Sequelize = require("sequelize");
const sequelize = require("../config/seq.config.js");
db.Sequelize = Sequelize;

exports.rackCreate = (req, res) => {

    const rack = {
      name: req.body.name,
      no_of_rows: req.body.no_of_rows,
      no_of_columns: req.body.no_of_columns,
      createdon: req.body.createdon,
      client_fk:req.body.client_fk,
    };

    // Save Rack in the database
    Rack.create(rack)
        .then(data => {
            res.send(data);
            createTrayObject(data.id,data.no_of_rows,data.no_of_columns);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Rack."
            });
        });
};


function createTrayObject(id,no_of_rows,no_of_columns){
  var tray={
    x: 0,
    y: 0,
    w: 0,
    h:0,
    rack_fk: 0,
    name: '',
    color:'',
  }
  for (let i = 1; i <=no_of_rows; i++) {
    for (let j = 1; j <=no_of_columns; j++) {
            tray.rack_fk=id;
            tray.x=i;
            tray.y=j;
            tray.w=1;
            tray.h=1;
            tray.name="r"+tray.x+"c"+tray.y;
            tray.color="0000ff";
            Tray.create(tray);
           
    }
    
  }
}

//1Find a single Tutorial with an id
exports.fetchRackById = (req, res) => {
    const id = req.params.id;

    Rack.findByPk(id)
        .then(data => {
            res.send(data);
            console.log(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Rack with id=" + id
            });
        });
};

exports.findAll = (req, res) => {
  const client_fk= req.params.client_fk;
  let query = `SELECT * FROM racks WHERE client_fk = ${client_fk} `;
  sequelize.query(query, { type: sequelize.QueryTypes.SELECT})
  .then(data => {
    res.send(data);
  }).catch(err => {
      res.status(500).send({
        message: "Error retrieving racks with client_fk=" + client_fk
      });
    });
};

// Update a Rack by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
  
    Rack.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Rack was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Rack with id=${id}. Maybe Tutorial was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Rack with id=" + id
        });
      });
  };
  
  // Delete a Rack with the specified id in the request
  exports.delete = (req, res) => {
    const id = req.params.id;
  
    Rack.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Rack was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Rack with id=${id}. Maybe Tutorial was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Rack with id=" + id
        });
      });
  };

//Fetch Rack By ClientId
 exports.fetchRackByClientId = (req, res) => {
  const tableName = req.params.name;
  const client_fk= req.params.client_fk;
  let query = `SELECT * FROM ${tableName} WHERE client_fk = ${client_fk} `;
  sequelize.query(query, { type: sequelize.QueryTypes.SELECT})
  .then(data => {
    res.send(data);
  }).catch(err => {
      res.status(500).send({
        message: "Error retrieving Form with id=" + id
      });
    });
};

//Search Rack
exports.searchRack = (req, res) => {
  var rackname = req.body.name;
  var createdon = req.body.createdon;
  var client_fk = req.body.client_fk;
  if(createdon == ''){
    query = `SELECT * FROM racks WHERE name LIKE '%${rackname}%' AND client_fk = ${client_fk} `;
  }
  else if(rackname == ''){
    query = `SELECT * FROM racks WHERE createdon > '${createdon}' AND client_fk = ${client_fk} `;
  }
  else
   query = `SELECT * FROM racks WHERE name LIKE '%${rackname}%' AND (createdon > '${createdon}' AND client_fk = ${client_fk})`;
  sequelize.query(query, { type: sequelize.QueryTypes.SELECT})
  .then(data => {
    res.send(data);
  }).catch(err => {
      res.status(500).send({
        message: "Error retrieving Form with id"
      });
    });
};

//Tray Create
exports.trayCreate = (req, res) => {

  const tray = {
      x: req.body.x,
      y: req.body.y,
      h: req.body.h,
      w: req.body.w,
      name: req.body.name,
      color: req.body.color,
      quantity: req.body.quantity,
      searchable: req.body.searchable,
      attr1: req.body.attr1,
      val1: req.body.val1,
      attr2: req.body.attr2,
      val2: req.body.val2,
      attr3: req.body.attr3,
      val3: req.body.val3,
      attr4: req.body.attr4,
      val4: req.body.val4,
      attr5: req.body.attr5,
      val5: req.body.val5,
      attribute: req.body.attribute,
      img: req.body.img,
      createdBy: req.body.createdBy,
      modifiedBy: req.body.modifiedBy,
      rack_fk: req.body.rack_fk
  };

  // Save Tray in the database
  Tray.create(tray)
      .then(data => {
          res.send(data);
      })
      .catch(err => {
          res.status(500).send({
              message:
                  err.message || "Some error occurred while creating the Tray."
          });
      });
};


// Find a single Tray with an id
exports.fetchTrayById = (req, res) => {
  const id = req.params.id;

  Tray.findByPk(id)
      .then(data => {
          res.send(data);
          console.log(data);
      })
      .catch(err => {
          res.status(500).send({
              message: "Error retrieving Rack with id=" + id
          });
      });
};


// Update a Tray by the id in the request
exports.updateTray = (req, res) => {
    const id = req.params.id;
  
    Tray.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Tray was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Tray with id=${id}. Maybe Tutorial was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Tray with id=" + id
        });
      });
  };
  
  // Delete a Tray with the specified id in the request
  exports.deleteTray = (req, res) => {
    const id = req.params.id;
  
    Tray.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Tray was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Tray with id=${id}. Maybe Tray was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Tray with id=" + id
        });
      });
  };

   //Fetch Tray By RackId
 exports.fetchTrayPropByRackId = (req, res) => {
  const tableName = "trays";
  const rack_fk= req.params.rack_fk;
  let query = `SELECT id,x,y,w,h FROM ${tableName} WHERE rack_fk = ${rack_fk} `;
  sequelize.query(query, { type: sequelize.QueryTypes.SELECT})
  .then(data => {
    res.send(data);
  }).catch(err => {
      res.status(500).send({
        message: "Error retrieving Form with id=" + rack_fk
      });
    });
};

  //Fetch Tray Data By RackId
  exports.fetchTrayDataByRackId = (req, res) => {
    const tableName = "trays";
    const tableName2="trayItems";
    const rack_fk= req.params.rack_fk;
    let query = `SELECT ${tableName}.id,${tableName}.name,${tableName}.color,${tableName}."searchable",${tableName}.img,SUM("${tableName2}".quantity)
                 AS quantity FROM ${tableName} FULL JOIN "${tableName2}"
                 ON trays.id = "${tableName2}"."trayId"
                 WHERE ${tableName}.rack_fk = ${rack_fk} 
                 GROUP BY ${tableName}.id `;

    sequelize.query(query, { type: sequelize.QueryTypes.FULLJOIN})
    .then(data => {
      res.send(data);
    }).catch(err => { 
        res.status(500).send({
          message: "Error retrieving Form with id=" + rack_fk
        });
      });
  };

exports.saveTrayLayout = (req, res) => {
  const trayList = req.body;
  for (let i = 0; i < trayList.length; i++) {
    let query = `UPDATE trays SET x = '${trayList[i].x}',y = '${trayList[i].y}',h = '${trayList[i].h}',w = '${trayList[i].w}' WHERE id = ${trayList[i].id}`;
    sequelize.query(query).then(trayList => {
      if (trayList[i] == i) {
        res.send({
          message: "TrayLayout was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update TrayLayout with id=${trayList[i].id}`
        });
      }
    })
      .catch(err => {
        res.status(500).send({
          message: "Error updating TrayLayout"
        });
      });
  }

};

