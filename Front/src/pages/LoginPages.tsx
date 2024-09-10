import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

import "./styles/LoginPages.css";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const envPassword = process.env.REACT_APP_ADMIN_PASSWORD;

  console.log(envPassword);

  const handleLogin = () => {
    if (username === "epitech" && password === envPassword) {
      login();
      navigate("/admin");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="AuthContainer">
      <h1>Admin Login</h1>
      <h1>If you're not admin, you have nothing to do here.</h1>
      <h1>Sorry you can't give yourself points :/</h1>
      <div className="Login">
        <h2>Username:</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <h2>Password:</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default LoginPage;
