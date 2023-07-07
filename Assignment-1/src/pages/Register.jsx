import React from "react";
import { useState } from "react";

export default function Register() {
  const [registerMessage, setRegisterMessage] = useState("");
  return (
    <div>
      <h1>Register</h1>
      <RegisterBar onSubmit={setRegisterMessage} />
      {registerMessage !== "" ? <p>{registerMessage}</p> : null}
    </div>
  );
}

/*create a new login*/
function NewRegister(props) {
  const url = "http://sefdb02.qut.edu.au:3001/user/register}";

  return fetch(url, {
    method: "POST",
    headers: {
      accept: "applications/json",
      "Content-Type": "applications/json"
    },
    body: JSON.stringify({
      email: props.Email,
      password: props.Password
    })
  })
    .then((res) => res.json())
    .then((res) => {
      localStorage.setItem("message", res.message);
    });
}

/*create the bar for entering the user's email+password*/

function RegisterBar(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <input
          aria-labelledby="button"
          id="email"
          name="email"
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          aria-labelledby="button"
          id="password"
          name="password"
          type="text"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          id="button"
          type="button"
          onClick={() => {
            NewRegister({ Email: email, Password: password });
            let message = localStorage.getItem("message");
            props.onSubmit(message);
            localStorage.removeItem("message");
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
