import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Register() {
  var [countries, setCountries] = useState([]);

  useEffect(() => {
      fetch(`http://sefdb02.qut.edu.au:3001/countries`)
      .then((res) => res.json())
      .then((volcanoList) => {
        setCountries(volcanoList);
      });
  }, []);

  console.log(countries);

  return ( 
    <main>
      <h1>{}</h1>
    </main>
  );
}
