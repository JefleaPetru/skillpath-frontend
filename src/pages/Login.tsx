import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import "../css/Login.css";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const isDisabled = !email || !password;

  return (
    <div className="log-in-page">
      <div className="back-arrow" onClick={() => navigate("/")}></div>
      <div className="container-login">
        <div className="title">Log In</div>

        <TextField className="input" size="small" label="Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)}/>
        <TextField className="input" size="small" label="Password" type={showPassword ? "text" : "password"} 
          fullWidth value={password} onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <button className="log-in-btn" disabled={isDisabled}>Log In</button>
        <div className="other-stuff">Please enter your credentials to continue.</div>
      </div>

      <div className = "create-account">
        <div className = "new-to-community">New to our community</div>
        <button className = "create-account-btn">Create an account</button>
      </div>
    </div>
  );
}

export default Login;
