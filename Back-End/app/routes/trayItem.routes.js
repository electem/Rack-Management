module.exports = app => {
    const trayItem = require("../controllers/trayItem.controller.js");
    
      var router = require("express").Router();
  
       router.post("/createTrayItem/", trayItem.trayItemCreate);

       router.put("/:formId", trayItem.updateTrayItems);

       router.get("/findAllItems", trayItem.findAllItems);

       router.get("/fetchItem/:formId", trayItem.fetchItem);
     
       app.use('/api/trayItem', router);
    };
    