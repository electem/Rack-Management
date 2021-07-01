const db = require("../models");
const Notification = db.notifications;
const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");
const sequelize = require("../config/seq.config.js");
const transport = require("../config/email.config.js");
db.Sequelize = Sequelize;


exports.fetchAllNotification = (req, res) => {
  let query = `SELECT * FROM notifications WHERE status != 'SENT' `;
  sequelize.query(query, { type: sequelize.QueryTypes.SELECT})
  .then(data => {
    res.send(data);
    sendNotificationBasedOnStatus(data);
  }).catch(err => {
      res.status(500).send({
        message: "Error retrieving notifications"
      });
    });
};

function sendNotificationBasedOnStatus(data) {

  for (let i = 0; i < data.length; i++) {

    let email = data[i].email;
    let notificationType = data[i].notificationType;

    if (data[i].notificationType == 'REGISTERED') {
      query = `UPDATE notifications SET status = 'SENT' WHERE id = ${data[i].id} AND "notificationType" = '${data[i].notificationType}'`;
      sequelize.query(query).then(data => {
        if (data[1].rowCount >= 1) {
          const message = {
            from: 'developers@electems.com',
            to: email,
            subject: 'Registration',
            text: 'Hello,user has registered, Your new password is:' +
              'You can login here:' + 'http://localhost:4200/login ' + 'Thank you'
          };
          transport.sendMail(message, function (err, info) {
            if (err) {
              console.log(err)
            } else {
              console.log('mail has sent.');
              console.log(info);
            }
          });
          console.log("updated notification WITH STATUS" + notificationType);
        }
        else {
          console.log("Cannot updated notification WITH STATUS" + notificationType);
        }
      })
    }
    else if (data[i].notificationType == 'CHANGEPASSWORD') {
      query = `UPDATE notifications SET status = 'SENT' WHERE id = ${data[i].id} AND "notificationType"='${data[i].notificationType}'`;
      sequelize.query(query).then(data => {
        if (data[1].rowCount >= 1) {
          const message = {
            from: 'developers@electems.com',
            to: email,
            subject: 'Change Password',
            text: 'Hello,Password changed, Your new password is:' +
              'You can login here:' + 'http://localhost:4200/login ' + 'Thank you'
          };
          transport.sendMail(message, function (err, info) {
            if (err) {
              console.log(err)
            } else {
              console.log('mail has sent.');
              console.log(info);
            }
          });
          console.log("updated notifications WITH STATUS" + notificationType);
        }
        else {
          console.log("Cannot updated notifications WITH STATUS" + notificationType);
        }
      })
    }

  }
}

