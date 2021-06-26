module.exports = app => {
    const menus = require("../controllers/menu.controller.js");

    var router = require("express").Router();

    router.get("/item/:itemId", menus.findMenuByItemId);

    router.get("/", menus.findAll);

    router.post("/createMenu", menus.menuCreate);

    router.get("/fetchMenu", menus.findById);

    app.use('/api/menu', router);
};
