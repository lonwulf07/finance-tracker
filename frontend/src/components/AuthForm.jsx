import { useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";

function AuthForm({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin ? { email, password } : { name, email, password };

      const response = await api.post(endpoint, payload);

      localStorage.setItem("token", response.data.token);
      onLogin(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
      style={{ maxWidth: "400px", margin: "100px auto", textAlign: "center" }}
    >
      <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>

      {error && (
        <p style={{ color: "#FF3366", fontWeight: "bold", marginTop: "10px" }}>
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min 8 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength="8"
        />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="btn-punchy"
        >
          {isLogin ? "Login" : "Sign Up"}
        </motion.button>
      </form>

      <p
        style={{
          marginTop: "20px",
          cursor: "pointer",
          color: "#222",
          fontWeight: "bold",
          textDecoration: "underline",
        }}
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? "Don't have an account? Sign up"
          : "Already have an account? Login"}
      </p>
    </motion.div>
  );
}

export default AuthForm;
