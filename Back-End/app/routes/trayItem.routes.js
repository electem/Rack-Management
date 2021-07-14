module.exports = app => {
    const trayItem = require("../controllers/trayItem.controller.js");
    
      var router = require("express").Router();
  
       router.post("/createTrayItem/", trayItem.trayItemCreate);
     
       app.use('/api/trayItem', router);
    };
    