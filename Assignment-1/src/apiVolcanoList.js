import { useEffect, useState } from "react";

/* in VolcanoList. Returns data for the grid */
/*in Volcano. Returns data for the volcano selected */
export function useVolcanoList(country) {
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    GetVolcanoList(country)
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

function GetVolcanoList(country) {
  return fetch(`http://sefdb02.qut.edu.au:3001/volcanoes?country=${country}`)
    .then((res) => res.json())
    .then((volcanoes) =>
      volcanoes.map((volcano) => {
        return {
          name: volcano.name,
          region: volcano.region,
          subregion: volcano.subregion,
          id: volcano.id
        };
      })
    )
    .catch((error) => console.log(error));
}
