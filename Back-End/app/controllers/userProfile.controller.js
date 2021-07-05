const db = require("../models");
const profile = db.userprofile;
const Op = db.Sequelize.Op;
const crypto = require('crypto');
const Sequelize = require("sequelize");
const sequelize = require("../config/seq.config.js");
const userNotification = require('../middleware/userNotification.js');
db.Sequelize = Sequelize;

exports.updateProfile = (req, res) => {
    const id = req.params.id;
  
    profile.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Profile was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Profile with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Profile with id=" + id
        });
      });
  };

  exports.fetchProfileById = (req, res) => {
    const id = req.params.id;

    profile.findByPk(id)
        .then(data => {
            res.send(data);
            console.log(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving profile with id=" + id
            });
        });
};

exports.fetchProfileByUserFK = (req, res) => {
  const user_fk= req.params.user_fk;
  let query = `SELECT * FROM userprofiles WHERE user_fk = ${user_fk} `;
  sequelize.query(query, { type: sequelize.QueryTypes.SELECT})
  .then(data => {
    res.send(data);
  }).catch(err => {
      res.status(500).send({
        message: "Error retrieving userProfile with id=" + user_fk
      });
    });
};

exports.fetchAllProfiles = (req, res) => {
  let query = `SELECT * FROM userprofiles`;
  sequelize.query(query, { type: sequelize.QueryTypes.SELECT})
  .then(data => {
    res.send(data);
  }).catch(err => {
      res.status(500).send({
        message: "Error retrieving userProfile"
      });
    });
};

exports.updatePassword = (req, res) => {
  const user_fk = req.params.user_fk;
  const profile={
     password :req.body.password,
    confirmPassword :req.body.confirmPassword,
    email:req.body.email,
  }
  var hash = crypto.createHash('md5').update(profile.password).digest('hex');
  profile.password = hash;

  let query = `UPDATE userprofiles SET password = '${profile.password}' WHERE user_fk = ${user_fk}`;
  sequelize.query(query).then(data => {
      if (data[1].rowCount >=1) {
        res.send({
          message: "profile password was updated successfully."
        });
        updateUserPassword(profile.password,user_fk,profile.email);
      } else {
        res.send({
          message: `Cannot update profile password id=${user_fk}`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Form with id=" + user_fk
      });
    });
};

function updateUserPassword(password,id,email){
  let query = `UPDATE users SET password = '${password}' WHERE id = ${id}`;
  sequelize.query(query).then(data => {
      if (data[1].rowCount >=1) {
        console.log("updated user password with id"+id);
      }
       else {
        console.log("Cannot update user password  id"+id);
      }
       createNotification(id,email);
    })
    .catch(err => {
      console.log("Error updating user password with id"+err);
    });
}

function createNotification(id,email){
  var notification={
    notificationType: '',
    email: '',
    status: '',
    user_fk:0,
    noOfRetry:0,
  }
  notification.notificationType = 'CHANGEPASSWORD',
  notification.email = email,
  notification.status = 'NEW',
  notification.user_fk = id,
  notificationType.noOfRetry=3,

  userNotification.saveNotification(notification);

}
