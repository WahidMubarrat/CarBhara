import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signin } from "../services/authService";
import "../styles/SignIn.css";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await signin(form.email, form.password);
      
      if (data.success || data.message === "Login successful") {
        const user = data.user;
        // Redirect based on user role
        if (user.role === "customer") {
          navigate("/customer/profile");
        } else if (user.role === "businessman") {
          navigate("/business/profile");
        } else {
          setError("Invalid user role");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h1 className="signin-title">Welcome Back</h1>
        <p className="signin-subtitle">Sign in to continue</p>

        <form className="signin-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <button type="submit" className="signin-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
