var express = require('express');
var router = express.Router();

/* GET countries page. */
router.get('/countries', function(req, res, next) {
  queries = req.query

  if(queries.length > 0){
    res.status(400).json({
      error: true,
      message: "Invalid query parameters. Query parameters are not permitted."
    })
    return;
  } else {

  req.db.from('data').select('country')
  .then(rows =>rows.map((row)=>row.country))
  .then( countries => {
    countries.sort()
    res.status(200).json(
      countries.filter(function(ele , pos){
        return countries.indexOf(ele) == pos;
    })
    )
  })
}
});

/* GET volcanoes page. */
router.get('/volcanoes', function(req, res, next) {
  const Country = req.query.country
  const PopulatedWithin = req.query.populatedWithin

  if(Country.length === 0){
    res.status(400).json({
      error: true,
      message: "Country is a required query parameter."
    });
    return;
  }else{
  
  const queries = req.query
  for (query in queries) {
    if( query !== 'country' && query !== 'populatedWithin' ){
      res.status(400).json({
        error: true,
        message: "Invalid query parameters. Only country and populatedWithin are permitted."
      });
      return;
    }
  }

  if(PopulatedWithin && ( PopulatedWithin !== '5km' && PopulatedWithin !== '10km' && PopulatedWithin !== '30km' && PopulatedWithin !== '100km' )){
    res.status(400).json({
      error: true,
      message: "Invalid value for populatedWithin. Only: 5km,10km,30km,100km are permitted"
    });
    return;
  }else if(PopulatedWithin){
    const queryPop = req.db.from('data')
    .select('id','name','country','region','subregion')
    .where("country","=",Country)
    .where("population_"+PopulatedWithin,">",0)

    queryPop.then((volcanoes) => {
      res.status(200).json(
        volcanoes
      )
    });
    return;
  }
  else{
    const queryCountry = req.db.from('data').select('id','name','country','region','subregion').where("country","=",Country)
    queryCountry.then((volcanoes) => {
      res.status(200).json(
        volcanoes
      )
    });
    return;
  }
}
});

/* GET volcano/{id} page. */
router.get('/volcano/:id', function(req, res, next) {
  const Id = req.params.id;
  queries = req.query

  if(queries.length > 0){
    res.status(400).json({
      error: true,
      message: "Invalid query parameters. Query parameters are not permitted."
    });
    return;
  }else{

  const auth = req.headers.authorization;

  //The non logged-in version
  if (!auth){
    const queryId = req.db.from('data').select('id','name','country','region','subregion','last_eruption','summit','elevation','latitude','longitude').where('id','=',Id)
    queryId.then((volcanoe) => {
      //If there is no such volcano
      if (volcanoe.length === 0){
        res.status(404).json({
          error: true,
          message: "Volcano with ID: "+ Id +" not found."
        });
        return;
      }else{
        //return the non authorized version
        res.status(200).json(
          volcanoe[0]
        )
        return;
      }
    })
  }
  else{

  //Logged-in version

  if(auth.split(" ").length !== 2) {
    res.status(401).json({
      error: true,
      message: "Authorization header is malformed"
    });
    return;
  }else{
  const token = auth.split(" ")[1];
  try {
    const secretKey = "secret key"
    const payload = require('jsonwebtoken').verify(token, secretKey);
    if (Date.now() > payload.exp) {
      res.status(401).json({
        error: true,
        message: "JWT token has expired"
      });
      return;
    }else{

    const queryId = req.db.from('data').select("*").where('id','=',Id)
    queryId.then((volcanoe) => {
      if (volcanoe.length === 0){
        res.status(404).json({
          error: true,
          message: "Volcano with ID: "+ Id +" not found."
        });
        return;
      }else{
        //return the authorized version
        res.status(200).json(
          volcanoe[0]
        )
        return;
      }
    })
  }
  } catch (e) {
    res.status(401).json({
      error: true,
      message: "Invalid JWT token"
    });
    return;
  } 
}
}
  }
});

/* GET /me page. */

router.get('/me', function(req, res, next) {
  res.status(200).json({
    name: "Romain Lambert",
    student_number: "n11232480"
  })
});


module.exports = router;
