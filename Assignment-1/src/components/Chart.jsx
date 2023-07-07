import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function Chart(props) {
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Population density"
      }
    }
  };

  const labels = ["5 km", "10 km", "30 km", "100 km"];

  const data = {
    labels,
    datasets: [
      {
        data: [
          props.population_5km,
          props.population_10km,
          props.population_30km,
          props.population_100km
        ],
        backgroundColor: "rgba(53, 162, 235, 0.5)"
      }
    ]
  };

  return <Bar options={options} data={data} />;
}
