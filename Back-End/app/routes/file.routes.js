module.exports = app => {
    const file = require("../controllers/fileDownload.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", file.fileCreate);

    router.get("/fetchFileById/:user_fk", file.findOne);

    router.put("/updateFile/:id", file.updateFile);

    router.get("/fetchTrayFile/", file.fetchTrayFile);

    router.put("/updateTrayByFile/:tray_fk", file.updateTrayByFile);
      
    app.use('/api/file', router);


  };
  