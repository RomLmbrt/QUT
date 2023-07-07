import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

import "../App.css";
import { useVolcanoList } from "../apiVolcanoList";
import SearchBar from "../components/SearchBar";

/*display the grid*/
export default function VolcanoList() {
  const navigate = useNavigate();
  var countries = GetCountries();
  const [country, setCountry] = useState(countries[0]);
  const { loading, rowData, error } = useVolcanoList(country);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error !== null) {
    return <p>Error: {error}</p>;
  }

  const columns = [
    { headerName: "Name", field: "name" },
    { headerName: "Region", field: "region" },
    { headerName: "Subregion", field: "subregion" },
    { headerName: "Id", field: "id" }
  ];

  return (
    <div className="container">
      <SearchBar countriesToAdd={countries} onChange={setCountry} />
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
          onRowClicked={(row) =>
            navigate(`/VolcanoList/Volcano?id=${row.data.id}`)
          }
        />
      </div>
    </div>
  );
}

/*get the list of countries */
function GetCountries() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetch(`http://sefdb02.qut.edu.au:3001/countries`)
      .then((res) => res.json())
      .then((res) => {
        setCountries(res);
      })
      .catch((error) => console.log(error));
  }, []);

  return countries;
}
