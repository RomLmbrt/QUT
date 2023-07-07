import { useEffect, useState } from "react";

/* in VolcanoList. Returns data for the grid */
/*in Volcano. Returns data for the volcano selected */
export function useVolcano(id) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    GetVolcano(id)
      .then((volcano) => {
        setData(volcano);
        setLoading(false);
        setError(null);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  return {
    loading,
    data,
    error
  };
}

function GetVolcano(id) {
  const token = localStorage.getItem("token");
  const headers = {
    accept: "application/json",
    "Content-Type": "application/json",
    Authorization: "Bearer " + token
  };

  return fetch("http://sefdb02.qut.edu.au:3001/volcano/{" + id + "}", {
    headers
  })
    .then((res) => res.json())
    .then((volcano) => {
      return volcano;
    })
    .catch((error) => console.log(error));
}
