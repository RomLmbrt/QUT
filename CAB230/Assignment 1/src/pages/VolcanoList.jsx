import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button, Badge } from "reactstrap";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

import "../App.css";
import { useVolcanoList } from "../api";
import SearchBar from "../components/SearchBar";

/*display the grid*/
export default function VolcanoList() {
  const navigate = useNavigate();
  const [country, setCountry] = useState("Brisbane");
  const { loading, rowData, error } = useVolcanoList(country);

  if (loading) {
    return <p>Loading...</p>;
  };

  if(error !== null) {
    return <p>Error: {error}</p>
  };

  const columns = [
    { headerName: "Time", field: "time", sortable: true, filter: true },
    { headerName: "Text", field: "text" },
    { headerName: "Temp", field: "temp" },
    { headerName: "Wind", field: "wind" },
    { headerName: "Icon", field: "icon" }
  ];

  return (
    <div className="container">
      <h1>Book Catalogue</h1>
      <p>
        <Badge color="success">{rowData.length}</Badge> Books published in 2000
        in the Drama category
      </p>
      <SearchBar 
        countriesToAdd={getCountries()} 
        onChange={setCountry} 
      />
      <div
        className="ag-theme-balham"
        style={{
          height: "300px",
          width: "800px"
        }}
      >
          <AgGridReact
          rowData={rowData}
          columnDefs={columns}
          pagination
          paginationPageSize={7}
          onRowClicked={(row) => navigate(`/VolcanoList/Volcano?Name=${row.data.title}`)}
          />

      </div>
    </div>
  );
}

/*get the list of countries */
function getCountries(){
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetch(`http://sefdb02.qut.edu.au:3001/countries`)
      .then((res) => res.json())
      .then((res) => {
        if ("error" in res) {
          throw new Error(res.error.message);
        }
      })
      .then((countries) =>{setCountries(countries)});
  }, []);

}