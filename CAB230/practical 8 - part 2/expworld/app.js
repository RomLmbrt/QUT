var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// connect to the DB mysql2
/*var mysql = require('mysql2');

var connection = mysql.createConnection({
    host: 'localhost',
    port:3000,
    user: 'root',
    password: ''
});


connection.query('USE world');

connection.query('SELECT name, district FROM city WHERE CountryCode = "AUS"',function(err, result, fields) {
    if (err) {
        return console.error(err); 
    } else {
    	
	var arrayLength = result.length; 

	for (var i = 0; i <= arrayLength-1; i++) {
	    var line = result[i].name + " (" + result[i].district + ")";
	    console.log(line); 
	}
    }
}); 

connection.end(); */

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const options = require('./knexfile.js');
const knex = require('knex')(options);

app.use((req, res, next) => {
 req.db = knex
 next()
}) 

app.get('/knex', function(req,res,next) {
  req.db.raw("SELECT VERSION()").then(
  (version) => console.log((version[0][0]))
  ).catch((err) => { console.log( err); throw err })
  res.send("Version Logged successfully");
 });

app.get("/api/city", function(req,res, next) {
  req.db.from('city').select("name", "district")
  .then((rows) => {
  res.json({"Error" : false, "Message" : "Success", "City" : rows})
  })
  .catch((err) => {
  console.log(err);
  res.json({"Error" : true, "Message" : "Error in MySQL query"})
  })
});

app.get("/api/city/:CountryCode",function(req,res,next) {
  req.db.from('city').select('*').where('CountryCode','=',req.params.CountryCode)
  .then((rows) => {
  res.json({"Error" : false, "Message" : "Success", "Cities" : rows})
  })
  .catch((err) => {
  console.log(err);
  res.json({"Error" : true, "Message" : "Error executing MySQL query"})
  })
 });

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
