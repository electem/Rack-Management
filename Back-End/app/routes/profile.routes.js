module.exports = app => {
  const profile = require("../controllers/userProfile.controller.js");
  
    var router = require("express").Router();
  
     router.put("/:id", profile.updateProfile);

     router.get("/fetchProfileByUserFK/:user_fk", profile.fetchProfileByUserFK);

     router.get("/fetchProfileById/:id", profile.fetchProfileById);

     router.get("/fetchAllProfiles", profile.fetchAllProfiles);

     router.put("/updatePassword/:user_fk", profile.updatePassword);
   
     app.use('/api/profile', router);
  };
  