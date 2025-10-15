import { useState } from "react";
import { useLocation } from "react-router-dom";
import { api, asApiError } from "../api/client";

type Props = {
  initialEmail?: string;
  onVerified?: () => void;
};

export default function VerifyCode({ initialEmail = "", onVerified }: Props) {
  const location = useLocation();
  const defaultEmail = (location.state?.email as string | undefined) ?? initialEmail;

  const [email, setEmail] = useState(defaultEmail);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    setLoading(true);
    try {
      await api.post("/auth/verify", {
        email: email,
        code,
      });
      setMsg("Email verified! You can now sign in.");
      onVerified?.();
    } catch (e) {
      const { status, data } = asApiError(e);
      if (status === 400 || status === 404) {
        setErr(data?.error || "Invalid or expired code.");
      } else {
        setErr("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setMsg("");
    setErr("");
    try {
      await api.post("/auth/resend-code", { email: email.trim().toLowerCase() });
      setMsg("New verification code sent.");
    } catch {
      setErr("Could not resend the code. Try again later.");
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Verify your email</h2>

      <label>
        Email
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </label>

      <label>
        Verification code
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          inputMode="numeric"
        />
      </label>

      {err && <p>{err}</p>}
      {msg && <p>{msg}</p>}

      <div>
        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
        <button type="button" onClick={resend} disabled={loading} style={{ marginLeft: 8 }}>
          Resend code
        </button>
      </div>
    </form>
  );
}
