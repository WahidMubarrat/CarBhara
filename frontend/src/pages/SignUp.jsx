import { useState } from "react";
import "../styles/SignUp.css";
import { signup } from "../services/authService";

const SignUp = () => {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    address: "",
    phone: "",
    role: "customer", // match backend: "customer" or "businessman"
    companyName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const payload = {
      role: form.role,
      fullname: form.fullname,
      email: form.email,
      password: form.password,
      age: form.age ? Number(form.age) : undefined,
      address: form.address,
      phone: form.phone,
      companyName: form.role === "businessman" ? form.companyName : undefined,
    };

    try {
      setLoading(true);
      const res = await signup(payload);

      if (res && res.message === "Signup successful") {
        alert("Signup successful — you can now sign in");
        setForm({
          fullname: "",
          email: "",
          password: "",
          confirmPassword: "",
          age: "",
          address: "",
          phone: "",
          role: "customer",
          companyName: "",
        });
      } else {
        setError(res?.message || "Signup failed");
      }
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1 className="signup-title">Create Your Account</h1>
        <p className="signup-subtitle">Join RentEase today</p>

        <form className="signup-form" onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              value={form.fullname}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              name="age"
              placeholder="Age (optional)"
              value={form.age}
              onChange={handleChange}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <textarea
            name="address"
            placeholder="Address"
            rows="3"
            value={form.address}
            onChange={handleChange}
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="customer">Customer</option>
            <option value="businessman">Business Owner</option>
          </select>

          {form.role === "businessman" && (
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={form.companyName}
              onChange={handleChange}
              required
            />
          )}

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
