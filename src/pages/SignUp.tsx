import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import "../css/SignUp.css";



declare global {
  interface Window {
    google?: any;
  }
}



function Signup() {

  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [testPassword, setTestPassword] = useState("");
  const [confPassword, setConfPassword] = useState(""); 
  const navigate = useNavigate();
  const isDisabled = !email || !testPassword|| !confPassword|| !lastName|| !firstName;


  return (
    <div className="sign-up-page">
      <div className="back-arrow" onClick={() => navigate("/")}></div>
      <div className="container-sign-up">
        <div className="title">Create an account</div>

        <TextField
          className="input"
          size="small"
          label="First Name"
          sx={{ width: 300, "& .MuiInputBase-root": { height: 40 } }}
          fullWidth
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          className="input"
          size="small"
          label="Last Name"
          sx={{ width: 300, "& .MuiInputBase-root": { height: 40 } }}
          fullWidth
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <TextField
          className="input"
          size="small"
          label="Email"
          sx={{ width: 300, "& .MuiInputBase-root": { height: 40 } }}
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          className="input"
          size="small"
          label="Password"
          type="password"
          sx={{ width: 300, "& .MuiInputBase-root": { height: 40 } }}
          fullWidth
          value={testPassword}
          onChange={(e) => setTestPassword(e.target.value)}
        />

        <TextField
          className="input"
          size="small"
          label="Confirm Password"
          type="password"
          sx={{ width: 300, "& .MuiInputBase-root": { height: 40 } }}
          fullWidth
          value={confPassword}
          onChange={(e) => setConfPassword(e.target.value)}
        />

        <button 
            className="create-account-btn" 
            disabled={isDisabled}
            onClick={()=> {
                if (testPassword === confPassword){
                    setPassword(testPassword);
                    setError("");
                } else {
                    setError("The passwords do not match!");
                }
            }}
            
            >Create Account</button>
            {error && <p style={{ color: "red", marginTop: "8px" }}>{error}</p>}
        <div className="other-stuff">OR</div>

        <div id="googleSignInDiv" />
      </div>
    </div>
  );
}

export default Signup;
