const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
global.__basedir = __dirname; 
// var corsOptions = {
//   origin: "http://localhost:8080"
// };

app.use(cors())
const initRoutes = require("./app/routes");
// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const Role = db.role;
const Menu = db.menus;
const Plan = db.plans;

db.sequelize.sync();
// force: true will drop the table if it already exists
 db.sequelize.sync({force: false}).then(() => {
   console.log('Drop and Resync Database with { force: true }');
   initial();
 });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/index')(app);
require('./app/routes/rack.routes')(app);
//require('./app/routes/itemTemplate.routes')(app);
require('./app/routes/item.routes')(app);
require('./app/routes/itemTemplateProperty.routes')(app);
require('./app/routes/store.routes')(app);
require('./app/routes/menu.route')(app);
require('./app/routes/form.routes')(app);
require('./app/routes/profile.routes')(app);
initRoutes(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  // Role.create({
  //   id: 1,
  //   name: "Admin"
  // });
 
  // Role.create({
  //   id: 2,
  //   name: "moderator"
  // });
 
  // Role.create({
  //   id: 3,
  //   name: "staff"
  // });

  // Menu.create({
  //   id: 1,
  //   label: "Home",
  //   action: '/template',
  //   menu_fk: 1,
  //   roleId: 1
  // });

  // Menu.create({
  //   id: 2,
  //   label: "staff",
  //   action: '/staff',
  //   menu_fk: 1,
  //   roleId: 1
  // });

  // Plan.create({
  //   id: 1,
  //   name: "Personal",
  //   noOfUsers : 1,
  //   noOfRacks: 2,
  //   noOfItemTypes: 3,
  //   rate: 500
  // });

  // Plan.create({
  //   id: 2,
  //   name: "Company/Traders",
  //   noOfUsers : 5,
  //   noOfRacks: 10,
  //   noOfItemTypes: 10,
  //   rate: 1000
  // });

  // Plan.create({
  //   id: 3,
  //   name: "Distributors",
  //   noOfUsers : 25,
  //   noOfRacks: 50,
  //   noOfItemTypes: 20,
  //   rate: 2000
  // });
}