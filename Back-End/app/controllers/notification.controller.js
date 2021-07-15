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
        message: "Error retrieving notifications"+err
      });
    });
};

exports.fetchNotificationByUserFk = (req, res) => {
  const user_fk = req.params.user_fk;
  let query = `SELECT * FROM notifications WHERE user_fk = ${user_fk}`;
  sequelize.query(query, { type: sequelize.QueryTypes.SELECT})
  .then(data => {
    res.send(data);
  }).catch(err => {
      res.status(500).send({
        message: "Error retrieving notifications"+err
      });
    });
};

function sendNotificationBasedOnStatus(data) {

  for (let i = 0; i < data.length; i++) {

    let email = data[i].email;
    let noOfRetry = data[i].noOfRetry;

    const message = {
      from: 'developers@electems.com',
      to: email,
      subject: 'Registration',
      text: 'Hello,user has registered, Your new password is:' +
        'You can login here:' + 'http://localhost:4200/login ' + 'Thank you'
    };
      try {
        transport.sendMail(message, function (err, info) {
        console.log('mail has sent');
        console.log(info);
        query = `UPDATE notifications SET status = 'SENT' WHERE id = ${data[i].id} AND "noOfRetry"= ${noOfRetry}`;
        sequelize.query(query).then(data => {
          if(data[1].rowCount >=1) {
            console.log(data[1]);
          }
    })
  });
      } catch (e) {
          noOfRetry = noOfRetry-1;
          query = `UPDATE notifications SET status = 'RETRY',"noOfRetry"= ${noOfRetry} WHERE id = ${data[i].id}`;
          sequelize.query(query).then(data => {
            if(data[1].rowCount >=1) {
              console.log(data[1]);
            }
          })
        }
  }
}

