import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "reactstrap";
import { Map, Marker } from "pigeon-maps";

import { useVolcano } from "../apiVolcano";
import { Chart } from "../components/Chart";

export default function Volcano() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { loading, data, error } = useVolcano(id);
  var token = localStorage.getItem("token");

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error !== null) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container">
      <p>
        <div className="all_volcano">
          <div className="volcano">
            <UseData {...data} />
          </div>
          <div className="map">
            <UseMap long={data.longitude} lat={data.latitude} />
          </div>
        </div>
      </p>
      <p>
        <div className="graph">
          {token !== null ? <Chart {...data} /> : null}
        </div>
      </p>
    </div>
  );
}

/* return the map */
function UseMap(props) {
  return (
    <Map
      height={340}
      width={500}
      defaultCenter={[50.879, 4.6997]}
      defaultZoom={2}
    >
      <Marker width={50} anchor={[props.long, props.lat]} />
    </Map>
  );
}

/* return the data */
function UseData(data) {
  const navigate = useNavigate();

  return (
    <div className="volcano">
      <div className="container">
        <p>
          <h1>{data.name}</h1>
          <p>Country: {data.country}</p>
          <p>Region: {data.region}</p>
          <p>Subregion: {data.subregion}</p>
          <p>Last Eruption: {data.last_eruption}</p>
          <p>Summit: {data.summit}</p>
          <p>Elevation: {data.elevation}</p>
          <Button
            color="info"
            size="sm"
            className="mt-3"
            onClick={() => navigate("/VolcanoList")}
          >
            Back
          </Button>
        </p>
      </div>
    </div>
  );
}
