const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
require("./Helpers/init_mongodb");
// require('./Helpers/init_db_data')
require("./Helpers/init_cron");
const cors = require("cors");
const debug = require("debug")(process.env.DEBUG + "server");
const path = require("path");
const compression = require("compression");
const createError = require("http-errors");

const app = express();

if (process.env.ENV == "development") {
  app.use(morgan("dev"));
}
app.use(cors());
app.use(compression({ filter: shouldCompress }));

function shouldCompress(req, res) {
  if (req.headers["x-no-compression"]) {
    // don't compress responses with this request header
    return false;
  }

  // fallback to standard filter function
  return compression.filter(req, res);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes Start ------
app.use("/auth", require("./routes/Auth.route"));
app.use("/user", require("./routes/user.route"));
app.use("/categories", require("./routes/category.route"));

// API Routes End --------

app.use(express.static(path.join(__dirname, "public", "dist")));

app.use((err, req, res, next) => {
  console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.ENV === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

app.use(async (err, req, res, next) => {
  console.log(err);
  next(createError.NotFound(err));
});

const PORT = process.env.PORT || 3051;
app.listen(PORT, () => {
  debug("Listening on " + PORT);
});
