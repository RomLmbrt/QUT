var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'The World Database API' });
});

router.get('/api', function (req, res, next) {
  res.render('index', { title: 'Lots of routes available' });
});

router.get('/api/city', function (req, res, next) {
  req.db.from('city').select('name', 'district')
  .then(rows => {
    res.json({
      "Error": false,
      "Message": "Success",
      "City": rows
    });
  })
  .catch(err =>
    {
      console.log(err);
      res.json({"Error": true, "Message": "Error in MySQL query"});
    }
  )
});

router.get('/api/city/:CountryCode', function (req, res, next) {
  const countryCode = req.params.CountryCode;
  req.db.from('city').select('*').where('CountryCode','=',countryCode)
  .then(rows => {
    res.json({
      "Error": false,
      "Message": "Success",
      "Cities": rows
    })
  })
  .catch(err =>
    {
      console.log(err);
      res.json({"Error": true, "Message": "Error in MySQL query"});
    }
  )
});


router.get('/knex', function (req, res, next) {
  req.db.raw("SELECT VERSION()").then(
    (version) => console.log((version[0][0]))
  ).catch((err) => { console.log(err); throw err })
  res.send("Version Logged successfully");
});

module.exports = router;
