import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import { Button, Badge } from "reactstrap";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

import "./styles.css";
/*
const table = {
  columns: [
    { headerName: "Make", field: "make" },
    { headerName: "Model", field: "model" },
    { headerName: "Price", field: "price", sortable: true, filter: "agNumberColumnFilter" }
  ],
  rowData: [
    { make: "Toyota", model: "Camry", price: 28000 },
    { make: "Ford", model: "Focus", price: 16700 },
    { make: "Hyundai", model: "Kona", price: 23500 }
  ]
};
*/

export default function App(props) {
  const navigate = useNavigate();

  const columns = [
    { headerName: "Title", field: "title", sortable: true, filter: true },
    { headerName: "Author", field: "author" },
    { headerName: "Edition Count", field: "editionCount" },
    { headerName: "Book ID", field: "id" }
  ];

  const rowData = props.rowData;

  return (
    <div className="container">
      <h1>Book Catalogue</h1>
      <p>
        <Badge color="success">{rowData.length}</Badge> Books published in 2000
        in the Drama category
      </p>
      <div
        className="ag-theme-balham"
        style={{
          height: "300px",
          width: "800px"
        }}
      >
        <AgGridReact
          columnDefs={columns}
          rowData={rowData}
          pagination
          paginationPageSize={7}
          onRowClicked={(row) => navigate(`/book?title=${row.data.title}`)}
        />
      </div>
      <Button
        color="info"
        size="sm"
        className="mt-3"
        href="https://openlibrary.org/developers/api"
        target="_blank"
      >
        Go to Open Library API
      </Button>
    </div>
  );
}
