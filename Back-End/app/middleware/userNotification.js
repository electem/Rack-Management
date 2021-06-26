const db = require("../models");
const notifications = db.notifications;

saveNotification = (req, res, next) => {
 
  const notification = {
    notificationType: req.notificationType,
    email: req.email,
    status: req.status,
    user_fk:req.user_fk
  };

  // Save Tutorial in the database
  notifications.create(notification)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.send(500).send({
        message:
          err.message || "Some error occurred while creating the stores."
      });
    });
};

const userNotification = {
    saveNotification: saveNotification,
};

module.exports = userNotification;
