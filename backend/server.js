const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const User = require("./user");
const Event = require("./event");
const Team = require("./team");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const jwt = require("jsonwebtoken");
const pug = require("pug");
const nodemailer = require("nodemailer");
const morgan = require("morgan");
const { domainToASCII } = require("url");
//----------------------------------------- END OF IMPORTS---------------------------------------------------
mongoose.connect(
  "mongodb+srv://Ayan:1234ayan@contactkeeper.lc9s0.mongodb.net/AuthPassport?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) console.log(err);
    else console.log("Mongoose Is Connected");
  }
);

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "pug");

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000", // <-- location of the react app were connecting to
    credentials: true,
  })
);
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);

app.use(morgan("dev"));
//----------------------------------------- END OF MIDDLEWARE---------------------------------------------------

// Routes
app.post("/api/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("No User Exists");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send("Successfully Authenticated");
        console.log(req.user);
      });
    }
  })(req, res, next);
});

app.post("/api/register/mail", (req, res) => {
  let email = req.body.email;
  let name = req.body.name;
  let contact = req.body.contact;
  let college = req.body.college;
  let password = req.body.password;

  User.findOne({ email }, (err, user) => {
    if (err) throw err;
    if (user) res.send("User already exists");
    if (!user) {
      const token = jwt.sign(
        {
          email,
          name,
          contact,
          college,
          password,
        },
        "secret",
        { expiresIn: "1h" }
      );

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "ayanadhya1999@gmail.com",
          pass: "1234ayan",
        },
      });

      let mailOptions = {
        from: "ayanadhya1999@gmail.com",
        to: email,
        subject: "Cepheus Registration",
        html: pug.renderFile(`${__dirname}/views/index.pug`, {
          email,
          name,
          contact,
          college,
          password,
          link: `http://localhost:5000/api/confirmregistration/${token}`,
        }),
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) throw err;
        else {
          res.send("Mail sent successfully");
        }
      });
    }
  });

  console.log(email, name, contact, college, password);
});

app.get("/api/confirmregistration/:token", async (req, res) => {
  const token = req.params.token;
  jwt.verify(token, "secret", (err, decoded) => {
    if (err) throw err;
    else {
      const email = decoded.email;
      const password = decoded.password;
      const college = decoded.college;
      const contact = decoded.contact;
      const name = decoded.name;

      User.findOne({ email: email }, async (err, doc) => {
        if (err) throw err;
        if (doc) res.send("User Already Exists");
        if (!doc) {
          const hashedPassword = await bcrypt.hash(password, 10);

          const newUser = new User({
            email,
            password: hashedPassword,
            college,
            contact,
            uid: uuidv4(),
            name,
          });
          await newUser.save();
          // res.send("User Created");
          res.redirect("http://localhost:3000");
        }
      });
    }
  });
});
app.get("/api/user", (req, res) => {
  console.log(req.user);
  res.send(req.user); // The req.user stores the entire user that has been authenticated inside of it.
});

app.get("/api/auth", (req, res) => {
  console.log(req.user);
  if (req.isAuthenticated()) {
    res.send({
      auth: "true",
      user: req.user,
    });
  } else {
    res.send({
      auth: "false",
    });
  }
});

app.post("/api/:eventName/register", async (req, res) => {
  console.log(req.params.eventName);
  console.log(req.body);
  let userIds = [];
  for (var i = 0; i < req.body.email.length; i++) {
    await User.findOne({ email: req.body.email[i] }, (err, user) => {
      if (err) throw err;
      if (!user) {
        res.send("One of the users is not registered");
      }
      if (user) {
        userIds.push(user._id);
      }
    });
  }

  if (userIds.length > 0) {
    // console.log("reached", userIds);
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const query = {
      $set: {
        name: req.params.eventName,
      },
    };

    await Event.findOneAndUpdate(
      { name: req.params.eventName },
      options,
      async (err, doc) => {
        // console.log(doc);
        if (err) throw err;
        if (!doc) {
          const newEvent = new Event({
            name: req.params.eventName,
            teams: [
              {
                participants: userIds,
              },
            ],
          });
          const d = await newEvent.save();
          // console.log(d);
          console.log("No event");
          res.send("No event");
        }
        if (doc) {
          // console.log("yoyoyo", doc);
          const doc = await Event.findOne({ name: req.params.eventName });

          for (var j = 0; j < doc.teams.length; j++) {
            for (var k = 0; k < doc.teams[j].participants.length; k++) {
              for (var m = 0; m < userIds.length; m++) {
                console.log(doc.teams[j].participants[k], userIds[m]);
                if (
                  String(doc.teams[j].participants[k]) === String(userIds[m])
                ) {
                  console.log("nononono");
                  res.send("One of the participants is already registered");
                  return;
                }
              }
            }
          }

          doc.teams.push({
            participants: userIds,
          });
          const updated = await doc.save();
          // console.log(updated);

          res.send(doc);
        }
      }
    );
  }

  // res.send(userIds);
});

app; //----------------------------------------- END OF ROUTES---------------------------------------------------
//Start Server
app.listen(5000, () => {
  console.log("Server Has Started");
});
