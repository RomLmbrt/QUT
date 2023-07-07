var express = require('express');
var router = express.Router();

/* POST new user account. */
router.post('/register', function(req, res, next) {
  const email = req.body.email
  const Password = req.body.password

  //verify body
  if (!email || !Password) {
    res.status(400).json({ Error: true, Message: "Request body incomplete, both email and password are required" })
    return
  }else{

  const queryUsers = req.db.from('users').select("*").where("email","=",email)
  queryUsers.then((users) => {
    if (users.length > 0){
      res.status(409).json({
        error: true,
        message: "User already exists"
      });
      return;
    }else{
      res.status(201).json({
        message: "User created"
      })

      //insert user into DB
      const saltRounds = 10
      const password = require('bcrypt').hashSync(Password, saltRounds)

      return req.db.from("users").insert({email, password})

    }
    })
  }
  });

/* POST log-in to user account. */
router.post('/login', function(req, res, next) {
  const email = req.body.email
  const password = req.body.password
  
  //verify body
  if(!email || !password) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete, both email and password are required"
    })
    return
  }else{

  const queryUsers = req.db.from('users').select("*").where("email","=",email)
  queryUsers.then((users) => {
    if (users.length === 0){
      res.status(401).json({
        error: true,
        message: "Incorrect email or password"
      })
      return
    }else{
      //Compare password hashes
      const user = users[0]
      const match = require('bcrypt').compare(password, user.password)
      if(!match) {
        res.status(401).json({
          error: true,
          message: "Incorrect email or password"
        })
        return
      }else{

      //Create and return JWT token
        const secretKey = "secret key"
        const expires_in = 60*60*24 // 1 Day
        const exp = Date.now() + expires_in * 1000
        const token = require('jsonwebtoken').sign({ email, exp }, secretKey)

        res.status(200).json({
          token: token,
          token_type: "Bearer",
          expires_in: expires_in
        })
        return
      } 
    }
    })
  }
})

/* GET user's profil informations. */

router.get('/:email/profile', function(req, res, next) {
  const email = req.params.email

  const auth = req.headers.authorization;

  //non logged-in part
  if (!auth){
    const queryEmail = req.db.from('users').select('email','firstName','lastName').where('email','=',email)
    queryEmail.then((data) => {
      //if the account is not in the db
      if (data.length === 0){
        res.status(404).json({
          error: true,
          message: "User not found"
        });
        return;
      }else{  
        //return volcanoe without logged-in access
        res.status(200).json(
          data[0]
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
    }else if (email != payload.email){
      const queryEmail = req.db.from('users').select('email','firstName','lastName').where('email','=',email)
      queryEmail.then((data) => {
        if (data.length === 0){
          res.status(404).json({
            error: true,
            message: "User not found"
          });
          return;
      }else{
        //return the logged-in version
        res.status(200).json(
          data[0]
        )
        return;
      }
    })
  }else{

    const queryEmail = req.db.from('users').select('email','firstName','lastName','dob','address').where('email','=',email)
    queryEmail.then((data) => {
      if (data.length === 0){
        res.status(404).json({
          error: true,
          message: "User not found"
        });
        return;
      }else{
        //return the logged-in version
        res.status(200).json(
          data[0]
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
});

/* PUT user's profil informations. */

router.put('/:email/profile', function(req, res, next) {
  const email = req.params.email

  const auth = req.headers.authorization;

  if (!auth){
    res.status(401).json({
      error: true,
      message: "Authorization header ('Bearer token') not found"
    })
    return
  }
  
  else if (auth.split(" ").length !== 2) {
    res.status(401).json({
      error: true,
      message: "Authorization header is malformed"
    });
    return;
  }
  
  else{
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
      }else if (payload.email !== email){
        res.status(403).json({
          error: true,
          message: "Forbidden"
        });
        return;
      }else{

      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      const dob = req.body.dob;
      const address = req.body.address;

      if (!firstName || !lastName || !dob || !address){
        res.status(400).json({
          error: true,
          message: "Request body incomplete: firstName, lastName, dob and address are required."
        });
        return;
      }else if (!(typeof firstName === 'string') || !(typeof lastName === 'string') || !(typeof address === 'string')){
        res.status(400).json({
          error: true,
          message: "Request body invalid: firstName, lastName and address must be strings only."
        });
        return;
      }else {

      const regex = /^\d{4}-\d{2}-\d{2}$/;
      const date = new Date(dob);
      const timestamp = date.getTime(); 
      if (dob.match(regex) === null || typeof timestamp !== 'number' || Number.isNaN(timestamp)){
        res.status(400).json({
          error: true,
          message: "Invalid input: dob must be a real date in format YYYY-MM-DD."
        });
        return;
      }else if (date > Date.now()){
        res.status(400).json({
          error: true,
          message: "Invalid input: dob must be a date in the past."
        });
        return;
      }else{

      req.db.from('users').update({ 'firstName': firstName, 'lastName': lastName, 'dob': dob, 'address': address }).where('email','=',email)
      .then(()=>{

      const queryData = req.db.from('users').select('email','firstName','lastName','dob','address').where('email','=',email)
      queryData.then((data) => {
        res.status(200).json(
          data[0]
        )
        return;
      })
    })
  }
}
}
    } catch (e) {
      res.status(401).json({
        error: true,
        message: "Invalid JWT token"
      });
      return;
    } 
  }
});

module.exports = router;
