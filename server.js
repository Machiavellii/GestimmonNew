const express = require("express");
var mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const users = require("./routes/users");
const dashboard = require("./routes/dashboard");
const admin = require("./routes/admin");
const scheduler = require("./service/scheduler");
var cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "client/build")));
app.use(express.static(path.join(__dirname, "static")));

const db = require("./config/key").mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB connected123");
    //fake
     const dbController = require("./utils/DbControll");
     //dbController.addFromListe();
     //dbController.addFromKoalito();
    //  dbController.addFromAnibis();
    //  dbController.addFromUnLoad();
    // dbController.addFromAnibisCSV();
  })
  .catch(err => console.log(err));

app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/users", users);
app.use("/api/dashboard", dashboard);
app.use("/api/admin", admin);
// app.use("/", )
const port = process.env.PORT || 5005;

app.listen(port, () => console.log(`server up and running on port ${port} !`));
