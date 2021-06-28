const db = require("../models");
const Notification = db.notifications;
const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");
const sequelize = require("../config/seq.config.js");
db.Sequelize = Sequelize;


exports.fetchAllNotification = (req, res) => {
  let query = `SELECT * FROM notifications WHERE status != 'SENT' `;
  sequelize.query(query, { type: sequelize.QueryTypes.SELECT})
  .then(data => {
    res.send(data);
  }).catch(err => {
      res.status(500).send({
        message: "Error retrieving racks with client_fk=" + user_fk
      });
    });
};





