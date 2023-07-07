import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import App from "./App";
import Book from "./Book";

export default function Catalogue() {
  const [rowData, setRowData] = useState([]);
  useEffect(() => {
    fetch("https://openlibrary.org/subjects/drama.json?published_in=2000")
      .then((res) => res.json())
      .then((data) => data.works)
      .then((works) =>
        works.map((work) => {
          return {
            title: work.title,
            author: work.authors[0].name,
            editionCount: work.edition_count,
            id: work.cover_id
          };
        })
      )
      .then((rowData) => setRowData(rowData));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/book" element={<Book />} />
        <Route path="/" element={<App rowData={rowData} />} />
      </Routes>
    </BrowserRouter>
  );
}
