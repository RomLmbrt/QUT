import { useState } from "react";

export default function Login(props) {
  return (
    <div>
      <h1>Login</h1>
      <LoginBar />
    </div>
  );
}

/*create the bar for entering the user's email+password*/

function LoginBar(props) {
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
            NewLogin({ Email: email, Password: password });
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

/*create a new login*/
function NewLogin(props) {
  const url = "http://sefdb02.qut.edu.au:3001/user/login}";

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
      localStorage.setItem("token", res.token);
    });
}
