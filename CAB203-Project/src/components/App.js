import { useState } from "react";
import Headline from "./Headline";
import SearchBar from "./SearchBar";
import { useWeather } from "../api";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Forecast from "./Forecast";

export default function App() {
  const [query, setQuery] = useState("Brisbane");
  const { loading, headlines, error } = useWeather(query);
  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/forecast" element={<Forecast />} />
        </Routes>
      </BrowserRouter>

      <h1>Surfing Forecast </h1>
      <SearchBar onSubmit={setQuery} />

      {error === null ? (
        headlines.map((headline) => (
          <Headline key={headline.time} {...headline} />
        ))
      ) : (
        <p>Error: {error}</p>
      )}
    </div>
  );
}

/*
export default function App() {
  const { loading, headlines, error } = useWeather();
  return (
    <div className="App">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h1>Brisbane Weather Forecast Today</h1>
          {headlines.map((headline) => (
            <Headline key={headline.time} {...headline} />
          ))}
        </div>
      )}
    </div>
  );
}
*/
