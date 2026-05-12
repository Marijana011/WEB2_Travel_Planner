import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../App.css";

function LoginPage() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = async () => {
    try {
      const response = await axios.post(
        "https://localhost:7023/api/Auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);

      navigate("/dashboard");
    } catch (error) {
      console.log(error);

      alert("Login failed.");
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">Travel Planner</h1>

        <div className="form-section">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={login}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;