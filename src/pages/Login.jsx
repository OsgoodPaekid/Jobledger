import { useState } from "react";
import { api, setToken } from "../api.js";
import { TextInput, Button } from "../components/Field.jsx";
import logoMark from "../assets/logo-mark-dark.svg";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const r = await api.post("/login", { username, password });
      setToken(r.data.token);
      onLogin();
    } catch (err) {
      setError((err.response && err.response.data && err.response.data.error) || "Could not reach the server.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-[10px] overflow-hidden border border-line bg-paper-raised">
        <div className="bg-ink px-6 py-6 flex items-center gap-3">
          <img src={logoMark} alt="" className="w-9 h-9 shrink-0" />
          <div>
            <div className="font-serif text-2xl text-paper tracking-tight leading-none">JobLedger</div>
            <div className="text-[11px] text-paper/50 mt-1">Sign in to continue</div>
          </div>
        </div>
        <form onSubmit={submit} className="p-6 grid gap-3">
          <TextInput required autoFocus autoComplete="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <TextInput required type="password" autoComplete="current-password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-sm text-rust">{error}</p>}
          <Button disabled={busy}>{busy ? "Signing in…" : "Log in"}</Button>
        </form>
      </div>
    </div>
  );
}
