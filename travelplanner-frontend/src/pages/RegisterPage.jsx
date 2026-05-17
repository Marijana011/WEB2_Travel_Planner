import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import "../App.css";

function RegisterPage() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const register = async () => {
    try {
      if (!name || !email || !password) {

        toast.error(
          "Please fill all fields."
        );
        return;
      }
      await axios.post(
        "https://localhost:7023/api/Auth/register",
        {
          name,
          email,
          password,
        }
      );
      toast.success(
        "Account created!"
      );
      navigate("/");

    } catch (error) {
      toast.error( error.response?.data ||
        "Registration failed."
      );
    }
  };

  return (
    <div className="app">
        <div className="auth-page">
          <div className="auth-left">
            <h1>Explore The World</h1>
            <p>Plan your perfect trip.</p>
          </div>

          <div className="auth-right">
            <div className="auth-form-wrapper">

                <h1 className="titauth-title">
                  Create Account
                </h1>

                <div className="form-section">

                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}/>

                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}/>

                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}/>
        
                  <button onClick={register}>
                    Register
                  </button>

                  <Link to="/">
                    Already have an account? Login
                  </Link>

                </div>
              </div>
            </div>
        </div>
    </div>        
  );
}

export default RegisterPage;