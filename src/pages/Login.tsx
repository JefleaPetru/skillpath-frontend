import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import "../css/Login.css";



declare global {
  interface Window {
    google?: any;
  }
}



function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const isDisabled = !email || !password;

  function handleCredentialResponse(resp: any) {



      // Google ID token (JWT). Is sent to the backend
    fetch("/api/v1/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ idToken: resp.credential }),
    })
      .then((r) => r.json())
      .then((data) => {
        console.log("Signed in:", data);
      })
      .catch(console.error);
  }

  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: "981498023327-rdctb2uffv53bvkk6bpoeiqlqjbkjorf.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });

    const el = document.getElementById("googleSignInDiv");
    if (el) {
      window.google.accounts.id.renderButton(el, {
        theme: "outline",
        size: "large",
        width: 300,
        shape: "pill", 
      });
    }
  }, []);


  return (
    <div className="log-in-page">
      <div className="back-arrow" onClick={() => navigate("/")}></div>
      <div className="container-login">
        <div className="title">Log In</div>

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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="log-in-btn" disabled={isDisabled}>Sign In</button>
        <div className="other-stuff">OR</div>

        <div id="googleSignInDiv" />
      </div>

      <div className="create-account">
        <div className="new-to-community">New to our community</div>
        <button className="create-account-btn" onClick={() => navigate("/Signup")}>Create an account</button>
      </div>
    </div>
  );
}

export default Login;
