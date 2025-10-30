import { useState } from "react";
import "../styles/SignIn.css";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Signing in as: ${form.email}`);
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h1 className="signin-title">Welcome Back</h1>
        <p className="signin-subtitle">Sign in to continue</p>

        <form className="signin-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="signin-btn">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
