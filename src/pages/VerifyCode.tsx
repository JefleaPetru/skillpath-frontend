import { useRef, useState } from "react";
import "../css/VerifyCode.css";
import { api, asApiError } from "../api/client";

type VerifyData = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

type Props = {
  initialEmail?: string;
  onVerified?: () => void;
};

export default function VerifyCode({ onVerified }: Props) {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const verifyData = localStorage.getItem("verifyData");
  const user = verifyData ? (JSON.parse(verifyData) as VerifyData) : null;

  if (!user) return <p>Session expired. Please sign up again.</p>;
  const { firstname, lastname, email, password } = user;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    setLoading(true);
    try {
      const fullCode = code.join(""); // <-- send string, not array
      await api.post("/auth/verify", { email, code: fullCode });
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
      await api.post("/auth/resend-code", {
        firstname,
        lastname,
        email,
        password,
      });
      setMsg("New verification code sent.");
    } catch {
      setErr("Could not resend the code. Try again later.");
    }
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return; // only can type digits inside the cells 
    const next = [...code];
    next[index] = value;
    setCode(next);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) inputsRef.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(6).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setCode(next);
    const focusIndex = Math.min(pasted.length, 5);
    inputsRef.current[focusIndex]?.focus();
  };

  const allFilled = code.every((c) => c !== "");

  return (
    <form onSubmit={submit}>
      <div className="verify-code">
        <div className="container">
          <div className="verify-logo" />
          <button className="email" type="button" aria-disabled>
            {email}
          </button>

          <div className="enter-code-txt">Enter your code</div>
          <div className="enter-code-we-sent">
            Enter the code we sent to <strong>{email}</strong>
          </div>

          <div className = "cells">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  if (el) inputsRef.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={i === 0 ? handlePaste : undefined}
                required
                style={{
                  width: 40,
                  height: 48,
                  textAlign: "center",
                  fontSize: 24,
                  borderRadius: 8,
                  border: "1px solid #ccc",
                }}
              />
            ))}
          </div>

          {err && <p style={{ color: "crimson" }}>{err}</p>}
          {msg && <p style={{ color: "green" }}>{msg}</p>}

          <div>
            <button type="submit" disabled={loading || !allFilled}>
              {loading ? "Verifying..." : "Verify"}
            </button>
            <button type="button" onClick={resend} disabled={loading} style={{ marginLeft: 8 }}>
              Resend code
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
