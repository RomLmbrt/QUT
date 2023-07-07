import { useState } from "react";

export default function SearchBar() {
  const [innerSearch, setInnerSearch] = useState("");

  return (
    <div>
      <input
        aria-labelledby="search-button"
        type="search"
        name="search"
        id="search"
      />
      <button id="search-button" type="button">
        Search
      </button>
    </div>
  );
}
