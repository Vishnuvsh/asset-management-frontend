import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  // 🧹 clear old session (VERY IMPORTANT)
  localStorage.clear();

  try {
    const res = await API.post("login/", {
      email,
      password,
    });

    /* ================= SAVE TOKENS ================= */
    localStorage.setItem("token", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);

    /* ================= SAVE ROLE (EXISTING) ================= */
    const role = res.data.role ? res.data.role.toUpperCase() : "EMPLOYEE";
    localStorage.setItem("role", role);

    /* ================= SAVE USER (NEW - ADDED) ================= */
    localStorage.setItem(
      "user",
      JSON.stringify({
        email: email,
        role: role, // ADMIN / EMPLOYEE
      })
    );

    /* ================= REDIRECT ================= */
    navigate("/dashboard");
  } catch (err) {
    if (err.response && err.response.status === 401) {
      setError("Invalid email or password");
    } else {
      setError("Server error. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.title}>Asset Management Login</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a, #020617)",
  },
  form: {
    background: "#020617",
    padding: "36px",
    borderRadius: "12px",
    width: "340px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
  },
  title: {
    color: "#e5e7eb",
    textAlign: "center",
    marginBottom: "22px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "14px",
    borderRadius: "6px",
    border: "1px solid #334155",
    background: "#020617",
    color: "#e5e7eb",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  error: {
    color: "#f87171",
    textAlign: "center",
    marginBottom: "12px",
    fontSize: "14px",
  },
};

export default Login;
