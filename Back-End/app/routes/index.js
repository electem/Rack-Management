const express = require("express");
const router = express.Router();
const controller = require("../controllers/file.controller");

let routes = (app) => {
  router.post("/upload", controller.upload);
  router.get("/files", controller.getListFiles);
  router.get("/files/profile", controller.getListFilesInProfile);
  
  router.get("/files/:name", controller.download);
  router.get("/files/profile/:name", controller.downloadProfileImages);
  router.get("/files/profileImageAfterMoved/:name", controller.profileImageAfterMoved);

  app.use(router);
};

module.exports = routes;
