import { useState } from "react";

export default function SearchBar(props) {
  const countriesSelect = document.getElementById('countries');
  
  /*Add countries to the select*/
  props.countriesToAdd.map((countryToAdd)=>{
    if (countriesSelect!==null) {
      var optionToAdd;
      optionToAdd = document.createElement("option");
      optionToAdd.text = countryToAdd;
      optionToAdd.value = countryToAdd;
      let test = false;
      /*check that the country is not already an option of the select */
      [].map.call(countriesSelect, (countrySelect)=>{
        if(countrySelect.value === optionToAdd.value){
          test = true;
        };
      });
      if(!test){
        countriesSelect.add(optionToAdd);
      }
    }
  });

  return (
    <div className="container">
      <ul>
        <h1 className="country__title">Country : </h1>
        <div className="dropdown">
        <select 
            name="countries" 
            id="countries"
            onChange={(event) => {
              props.onChange(event.target.value);
            }}>            
          </select>
        </div>
      </ul>
    </div>
  );
}