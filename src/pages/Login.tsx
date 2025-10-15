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


  function handleCredentialResponseGoogle(resp: any) {

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

  
  async function handleCredentialResponseNormal() {

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/authenticate", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const contentType = response.headers.get("content-type") || "";
      const payload = contentType.includes("application/json")
        ? await response.json().catch(() => null)
        : await response.text().catch(() => "");
      if (!response.ok) {
        console.error("[login] non-OK:", response.status, payload);
        alert(`Login failed (${response.status}). ${typeof payload === "string" ? payload : payload?.message ?? ""}`);
        return;
      }

      const data: any = payload || {};
      console.log("[login] success:", data);

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ firstname: data.firstname, lastname: data.lastname, email: data.email })
      );

      console.log("[login] navigating to /profile");
      navigate("/profile");
    } catch (err) {
      console.error("[login] error:", err);
      alert("Network or CORS error—see console for details.");
    }
  }


    

  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: "981498023327-rdctb2uffv53bvkk6bpoeiqlqjbkjorf.apps.googleusercontent.com",
      callback: handleCredentialResponseGoogle,
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

        <button className="log-in-btn" disabled={isDisabled} onClick = {handleCredentialResponseNormal}>Sign In</button>
        <div className="other-stuff">OR</div>

        <div id="googleSignInDiv" />
      </div>

      <div className="create-account">
        <div className="new-to-community">New to our community</div>
        <button className="create-account-btn1" onClick={() => navigate("/Signup")}>Create an account</button>
      </div>
    </div>
  );
}

export default Login;
