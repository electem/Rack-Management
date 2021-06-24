const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  var router = require("express").Router();
  const user = require("../controllers/user.controller.js");

  router.post("/client", user.createClient);

  // Create a new Rack
  router.post("/", user.Create);

  router.post("/login", user.login);

  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get(
    "/api/test/user",
    [authJwt.verifyToken],
    controller.userBoard
  );

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  router.get("/client/staff/role", user.getRole);
  router.post("/client/staff/save/:clientName", user.saveClientStaff);
  router.get("/client/staff", user.getClientStaffList);
  router.get("/client/name", user.getClientNameByID);
  router.get("/client/staff/:id", user.findOne);
  router.put("/client/staff/update/:id", user.update);
  router.post("/client/resetPassword/", user.forgotpassword);
  router.delete("/client/staff/delete/:id", user.delete);
  router.get("/client/plans", user.findAllPlans);
  router.get("/activation/:clientPK/:userPk", user.updateUserStatus);
  router.get("/role", user.getRoleNameByID);
  router.get("/client/validation/:value/:type", user.validation);
  router.get("/plan", user.getPlan);
  app.use('/api/user', router);
};    
