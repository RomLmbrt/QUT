import { useEffect, useState } from "react";

const API_KEY =
  "701e926c-e152-11ec-ab6b-0242ac130002-701e930c-e152-11ec-ab6b-0242ac130002";

export function useWeather(query) {
  const [loading, setLoading] = useState(true);
  const [headlines, setHeadlines] = useState([]);
  const [error, setError] = useState(null);

  const lat = 60.936;
  const lng = 5.114;

  useEffect(() => {
    getForecastByQuery({ latitude: lat, longitude: lng })
      .then((forecasts) => {
        setHeadlines(forecasts);
        setLoading(false);
        setError(null);
      })
      .catch((err) => setError(err.message));
  }, [query]);

  return {
    loading,
    headlines,
    error
  };
}

function getForecastByQuery(q) {
  return fetch(
    `https://api.stormglass.io/v2/tide/extremes/point?lat=${q.latitude}&lng=${q.longitude}&start=2019-03-15&end=2019-03-15`,
    {
      headers: {
        Authorization: API_KEY
      }
    }
  )
    .then((response) => response.json())
    .then((forecasts) => {
      forecasts.map((forecast) => ({
        time: forecast.height,
        text: forecast.time,
        temp: forecast.type,
        wind: forecast.type,
        icon: forecast.type
      }));
    });
}
