import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import "../css/SignUp.css";

declare global {
  interface Window {
    google?: any;
  }
}

type ApiErrorBody = {
  error?: string;
  field?: string;
  code?: "EMAIL_TAKEN" | "EMAIL_NOT_VERIFIED" | string;
};

function Signup() {
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [testPassword, setTestPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");

  const [emailServerError, setEmailServerError] = useState("");
  const [generalServerError, setGeneralServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const isDisabled =
    !email || !testPassword || !confPassword || !lastName || !firstName || loading;

  async function sendRegistrationInfo() {
    setEmailServerError("");
    setGeneralServerError("");
    setSuccessMsg("");
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: firstName,
          lastname: lastName,
          email: normalizedEmail,
          password: testPassword,
        }),
      });

      if (response.status === 201) {
        // success: show message and go to verification page
        setSuccessMsg("Verification code sent. Check your email.");
        navigate("/verify", { state: { email: normalizedEmail } });
        return;
      }

      let data: ApiErrorBody | undefined;
      try {
        data = (await response.json()) as ApiErrorBody;
      } catch {
        data = undefined;
      }

      if (response.status === 409) {
        if (data?.code === "EMAIL_TAKEN") {
          setEmailServerError("This email already has an account.");
        } else if (data?.code === "EMAIL_NOT_VERIFIED") {
          setEmailServerError(
            data.error || "This email is already registered but not verified. We sent a new code."
          );
        } else {
          setGeneralServerError(data?.error || "Conflict. Please try again.");
        }
        return;
      }

      if (response.status === 400) {
        setGeneralServerError(data?.error || "Please check your input.");
        return;
      }

      setGeneralServerError("Something went wrong. Please try again.");
    } catch (err) {
      console.error("Registration error:", err);
      alert("Network or CORS error—see console for details.");
    } finally {
      setLoading(false);
    }
  }

  async function resendVerificationCode() {
    setGeneralServerError("");
    setSuccessMsg("");
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const res = await fetch("http://localhost:8080/api/v1/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      if (res.ok) {
        setSuccessMsg("New verification code sent.");
      } else {
        setGeneralServerError("Could not resend the code. Try again later.");
      }
    } catch {
      setGeneralServerError("Could not resend the code. Try again later.");
    }
  }

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
          error={!!emailServerError}
          helperText={
            emailServerError ? (
              <>
                {emailServerError}{" "}
                {emailServerError.toLowerCase().includes("not verified") && (
                  <button
                    type="button"
                    onClick={resendVerificationCode}
                    style={{ marginLeft: 8, textDecoration: "underline", background: "none", border: 0, padding: 0, cursor: "pointer" }}
                  >
                    Resend code
                  </button>
                )}
              </>
            ) : undefined
          }
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
          className="create-account-btn2"
          disabled={isDisabled}
          onClick={() => {
            if (testPassword === confPassword) {
              setError("");
              sendRegistrationInfo();
            } else {
              setError("The passwords do not match!");
            }
          }}
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        {/*mismatch error*/}
        {error && <p style={{ color: "red", marginTop: "8px" }}>{error}</p>}

        {generalServerError && (
          <p style={{ color: "red", marginTop: "8px" }}>{generalServerError}</p>
        )}
        {successMsg && (
          <p style={{ color: "green", marginTop: "8px" }}>{successMsg}</p>
        )}

        <div className="other-stuff">OR</div>
        <div id="googleSignInDiv" />
      </div>
    </div>
  );
}

export default Signup;
