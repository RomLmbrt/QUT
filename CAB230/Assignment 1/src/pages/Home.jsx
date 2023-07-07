import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main>
      <h1 className="hero__title">Volcanoes of the World</h1>
      {/* icon */}
      <div id="icon">
        <img src="img/volcano.png" alt="volcano" />
      </div>
    </main>
  );
}