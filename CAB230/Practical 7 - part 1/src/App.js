import "./styles.css";
import { useState } from "react";

export default function App() {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  return (
    <div className="App">
      {name !== "" ? <h1>Hi {name}</h1> : null}
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <label htmlFor="name">Your name: </label>
        <input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={(event) => {
            const newName = event.target.value;
            if (/[0-9]/.test(newName)) {
              setError("Names can't have numbers");
            } else {
              setError(null);
            }
            setName(newName);
          }}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
