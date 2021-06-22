const db = require("../models");
const crypto = require('crypto');
const Op = db.Sequelize.Op;
const User = db.user;
const Client = db.clients;
const UserProfile = db.userprofile;
const Sequelize = require("sequelize");
const sequelize = require("../config/seq.config.js");
db.Sequelize = Sequelize;
const transport = require("../config/email.config.js");
const Plans = db.plans;
const Template =  require("./item.controller.js");
var clientName = '';
exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.Create = (req, res) => {

  const user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    location: req.body.location,
    clientFk: req.body.clientFk
  };
  
  var hash = crypto.createHash('md5').update(user.password).digest('hex');
  user.password = hash;

  // Save User in the database
  User.create(user)
      .then(data => {
          res.send(data);
          createProfileObject(data);
          sendEmailNotification(data);
      })
      .catch(err => {
          res.status(500).send({
              message:
                  err.message || "Some error occurred while creating the Rack."
          });
      });
};

exports.login = (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
    status:'ACTIVE'
  };
  var hash = crypto.createHash('md5').update(user.password).digest('hex');
  user.password = hash;

  User.findOne({where:user })
      .then(data => {
          res.send(data);
      })
      .catch(err => {
          res.status(500).send({
              message: "Error retrieving Tray with id=" + id
          });
      });
};

exports.createClient = (req, res) => {

  // Create a Client
  const client = {
    name: req.body.name,
    planFk: req.body.planFk,
  };

  // Save Client in the database
  Client.create(client)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the client."
      });
    });
};

exports.saveClientStaff = (req, res) => {
  const clientName = req.params.clientName;
  const staff = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    status: req.body.status,
    clientFk: req.body.clientFk,
    roleId: req.body.roleId
  }; 
  
  var hash = crypto.createHash('md5').update(staff.password).digest('hex');
  staff.password = hash;

  // Save User in the database
  User.create(staff)
      .then(data => {
        console.log('sending email..');
        const message = {
          from: 'developers@electems.com',
          to:  data.email,        
          subject: 'Registration',
          text: 'Hello, You are Successfully! registered by ' + clientName + ' Please use the following credentials to login: ' +
          'Username: ' + data.username + ' password: pls contact your admin Here is the Login link ' + 'http://localhost:4200/login ' + 'Thank you'
      };
      transport.sendMail(message, function(err, info) {
          if (err) {
            console.log(err)
          } else {
            console.log('mail has sent.');
            console.log(info);
          }
      });
          res.send(data);

      })
      .catch(err => {
          res.status(500).send({
              message:
                  err.message || "Some error occurred while creating the Rack."
          });
      });
};


//Fetch role 
 exports.getRole = (req, res) => {
  let query = `select id from roles where name = 'staff'`;
  sequelize.query(query, { type: sequelize.QueryTypes.SELECT})
  .then(data => {
    res.send(data);
  }).catch(err => {
      res.status(500).send({
        message: "Error retrieving Form with id=" + id
      });
    });
};

exports.getClientStaffList = (req, res) => {
  var clientFk = req.query.clientFk;
  var roleId = req.query.roleId;
  var status = "ACTIVE";
  // Create a Client
  var tableName = "users";
  let query = `SELECT * FROM ${tableName} WHERE "clientFk" = ${clientFk} AND status = '${status}' AND  "roleId" = ${roleId}`;
  sequelize.query(query, { type: sequelize.QueryTypes.SELECT})
  .then(data => {
    res.send(data);
  }).catch(err => {
      res.status(500).send({
        message: "Error retrieving Form with id=" + id
      });
    });
};


//Fetch role 
exports.getClientNameByID = (req, res) => {
  var clientFk = req.query.clientFk;
  let query = `select name from clients where id = ${clientFk}`;
  sequelize.query(query, { type: sequelize.QueryTypes.SELECT})
  .then(data => {
    clientName = data[0].name;
    res.send(data);
  }).catch(err => {
      res.status(500).send({
        message: "Error retrieving Form with id=" + id
      });
    });
};

// Find a single Customer with a customerId
exports.findOne = (req, res) => {
  const id = req.params.id;
  User.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Template with id=" + id
      });
    });
};


// Update a Staff by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  var hash = crypto.createHash('md5').update(req.body.password).digest('hex');
  req.body.password = hash;
  User.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully."
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

exports.validation = (req, res) => {
  const value= req.params.value;
  const type= req.params.type;
  if(value){
     query = `SELECT * FROM users WHERE username = '${value}' `;
  }
  else if(type){
    query = `SELECT * FROM users WHERE email = '${type}' `;
  }
  sequelize.query(query, { type: sequelize.QueryTypes.SELECT})
  .then(data => {
    res.send(data);
  }).catch(err => {
      res.status(500).send({
        message: "Error retrieving users"
      });
    });
};

// Delete a Staff with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
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

exports.forgotpassword = (req, res) => {
  const user = {
    email: req.body.email,
  }; 

  const email = user.email;
  var randomNumber = Math.random().toString(36).slice(2);
  var hash = crypto.createHash('md5').update(randomNumber).digest('hex');
  const password = hash;
  let query = `UPDATE users SET password = '${password}' WHERE email = '${email}' `;

 sequelize.query(query).then(data => {
            if(data[1].rowCount >=1) {
              console.log(data[1]);
              console.log('sending email..');
        const message = {
          from: 'developers@electems.com',
          to:  email,        
          subject: 'Forgot Password',
          text: 'Hello,password was reset, Your new password is:' +randomNumber+ 
          'You can login here:'+ 'http://localhost:4200/login ' + 'Thank you'
      };
      transport.sendMail(message, function(err, info) {
          if (err) {
            console.log(err)
          } else {
            console.log('mail has sent.');
            console.log(info);
          }
      });     
      res.send({
        message: "password was updated successfully."
      });  
    }
    else{
      res.send({
        message: `Cannot update password with email=${email}.`
      });
    }
        
      })    
      .catch(err => {
          res.status(500).send({
              message:
                  err.message || "Some error occurred while update password"
          });
      });
};

function createProfileObject(data){
  var profile={
    userName: '',
    email: '',
    phone: '',
    address: '',
    password:'',
    confirmPassword:'',
    city:'',
    image:'',
    user_fk:0,
  }
  profile.userName=data.username;
  profile.email=data.email;
  profile.phone=data.phone;
  profile.city=data.location;
  profile.user_fk=data.id;
  profile.password=data.password;

  UserProfile.create(profile);

}

exports.profileCreate = (req, res) => {

  const profile = {
    userName: req.body.userName,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    city:req.body.city,
    image:req.body.image,
    user_fk:req.body.user_fk,
  };

  // Save UserProfile in the database
  UserProfile.create(profile)
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

// Retrieve all Plans from the database.
exports.findAllPlans = (req, res) => {
  Plans.findAll({})
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


function sendEmailNotification(data) {
  const message = {
    from: 'developers@electems.com',
    to: data.email,
    subject: 'Activation',
    html:  '<body> Hello,<br /><p>Click url: <a href="http://localhost:8080/api/user/activation/' + data.clientFk + '/'  + data.id +'">http://localhost:8080/api/user/activation/' + data.clientFk + '/' + data.id + '</a> to Activate your account.</p></body>'
  };
  transport.sendMail(message, function (err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log('mail has sent.');
      console.log(info);
    }
  });
}

exports.updateUserStatus = (req, res) => {
  var clientFk = req.params.clientPK;
  var userPk = req.params.userPk;
  let query = `UPDATE users SET status = 'ACTIVE' WHERE id = '${userPk}' `;
  req.query.clientFk = clientFk;
   exports.getClientNameByID(req, res);
  sequelize.query(query, { type: sequelize.QueryTypes.SELECT})
  .then(data => {
    exports.createTemplateByPlan(req, res);
    res.send("successfully updated the user status");  
  }).catch(err => {
      res.status(500).send({
        message: "Error retrieving Form with id=" + id
      });
    });
};

exports.createTemplateByPlan = (req, res) => {
  var clientFk = req.query.clientFk;
  let query = `SELECT p.* FROM plans p, clients c where c."planFk" = p.id and c.id = ${clientFk} `;
  sequelize.query(query, { type: sequelize.QueryTypes.SELECT})
    .then(data => {
      planList = data[0];
      for (let i = 0; i < planList.noOfItemTypes; i++) {
        var templateName = "Item_" +i+ '_' + clientName;
        req.body.name = templateName;
        req.body.clientFk = clientFk;
        Template.create(req, res);
      }
    }).catch(err => {
      res.status(500).send({
        message: "Error retrieving Form with id=" + id
      });
    });
};

exports.getRoleNameByID = (req, res) => {
  var roleId = req.query.roleId;
  let query = `select name from roles where id = ${roleId}`;
  sequelize.query(query, { type: sequelize.QueryTypes.SELECT})
  .then(data => {
    res.send(data);
  }).catch(err => {
      res.status(500).send({
        message: "Error retrieving Form with id=" + id
      });
    });
};
