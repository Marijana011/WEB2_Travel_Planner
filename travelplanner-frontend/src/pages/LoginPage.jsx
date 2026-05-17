import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [isRegister, setIsRegister] = useState(false);

  const navigate = useNavigate();

  const login = async () => {
    try {
      if(!email || !password){
        toast.error("Please fill all fields.");

        return;
      }
      const response = await axios.post(
        "https://localhost:7023/api/Auth/login",
        {
          email,
          password,
        }
      );
      localStorage.setItem("token", response.data.token);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);

      toast.error("Login failed.");
    }
  };

  const register = async () => {
    await axios.post(
      "https://localhost:7023/api/Auth/register",
      {
        name, 
        email,
        password
      }
    );
    
    toast.success("Account created!");
    setIsRegister(false);
  };

  return (
    <div className="app">
      <div className="auth-page">
        <div className="auth-left">

          <h1>
            Explore The World
          </h1>

          <p>
            Plan your perfect trip.
          </p>

        </div>

        <div className="auth-right">
          <h1 className="auth-title">Travel Planner</h1>
          <div className="form-section">
            {isRegister && (
                <input 
                  type="text" 
                  placeholder="Name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}>
                </input>
             )}

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
            <Link to="/register">Don't have an account? Register</Link>
        
          </div>
      </div>
    </div>
  </div>
  );
}

export default LoginPage;