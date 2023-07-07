import { useEffect, useState } from "react";

const API_KEY = "de867676b7ca457aa7041433220504";

/*The function that fetchs the URL and returns
 data for the rows */
export function useVolcanoList(country) {
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getVolcanoList(country)
      .then((volcanoList) => {
        setRowData(volcanoList);
        setLoading(false);
        setError(null);
      })
      .catch((err) => setError(err.message));
  }, [country]);

  return {
    loading,
    rowData,
    error
  };
}

function getVolcanoList(country) {
  return fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${country}`
  )
  .then((res) => res.json())
  .then((res) => {
    if ("error" in res) {
      throw new Error(res.error.message);
    }
    return res.forecast.forecastday[0].hour;
  })
      .then((works) =>
        works.map((work) => {
          return {
            time: work.time,
            text: work.condition.text,
            temp: work.temp_c,
            wind: work.wind_kph,
            icon: work.condition.icon
          };
        })
      )
  }