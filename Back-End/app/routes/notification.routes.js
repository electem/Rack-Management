module.exports = app => {
    const notification = require("../controllers/notification.controller.js");
    
      var router = require("express").Router();
    
       router.get("/fetchAllNotification", notification.fetchAllNotification);

       router.get("/fetchNotificationByUserFk/:user_fk", notification.fetchNotificationByUserFk);
  
       app.use('/api/notification', router);
    };
    