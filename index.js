const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");

// require("dotenv").config({ path: "../.env" });

const UserRoutes = require("./src/routes/user");
const AuthRoutes = require("./src/routes/user.auth");
const LoginRoute = require("./src/routes/user.login");
const TasksRoutes = require("./src/routes/task");
const AuthTasksRoutes = require("./src/routes/auth.task");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: "POST, PUT, GET, DELETE, OPTIONS, PATCH",
    allowedHeaders:
      "Accept, Content-Type, Accept-Encoding, Content-Length, Authorization",
  })
);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "client/build")));
// }

app.use(cookieParser(process.env.SECRET || "Just a Secret!"));
app.use(
  session({
    secret: process.env.SECRET || "Not a Secret!",
    resave: true,
    saveUninitialized: true,
  })
);

passport.use("local", require("./src/utils/strategy"));

passport.serializeUser(function (user, done) {
  console.log("user logged:" + user.username);
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  console.log("User ID: " + user.id);
  return done(null, user.id);
});

app.use(passport.initialize());
app.use(passport.session());

app.use(UserRoutes);
app.use(AuthRoutes);
app.use(LoginRoute);
app.use(TasksRoutes);
app.use(AuthTasksRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT);
console.log(`App Running on port: ${PORT}`);
// app.set("port", process.env.PORT || 4000);
