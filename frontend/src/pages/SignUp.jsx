import { useState, useRef } from "react";
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
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Preview the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate profile picture is uploaded
    if (!fileInputRef.current?.files[0]) {
      setError("Profile picture is required");
      return;
    }

    const formData = new FormData();
    formData.append('role', form.role);
    formData.append('fullname', form.fullname);
    formData.append('email', form.email);
    formData.append('password', form.password);
    if (form.age) formData.append('age', form.age);
    if (form.address) formData.append('address', form.address);
    if (form.phone) formData.append('phone', form.phone);
    if (form.role === "businessman" && form.companyName) {
      formData.append('companyName', form.companyName);
    }
    formData.append('profilePicture', fileInputRef.current.files[0]);

    try {
      setLoading(true);
      const res = await signup(formData);

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
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
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
    <>
      <div className="signup-background"></div>
      <div className="signup-container">
        <div className="signup-box">
          <h1 className="signup-title">Create Your Account</h1>
          <p className="signup-subtitle">Join CarBhara today</p>

          <form className="signup-form" onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}

          <div className="profile-picture-section">
            <div className="profile-picture-preview">
              <img 
                src={imagePreview || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSIzNiIgcj0iMjAiIGZpbGw9IiNmNmM5MGUiLz48cGF0aCBkPSJNMTUgODVjMC0xOS4zMyAxNS42Ny0zNSAzNS0zNXMzNSAxNS42NyAzNSAzNSIgZmlsbD0iI2Y2YzkwZSIvPjwvc3ZnPg=='} 
                alt="Profile Preview" 
                className="preview-image"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="upload-picture-btn"
            >
              {imagePreview ? 'Change Picture' : 'Upload Picture (Required)*'}
            </button>
          </div>

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
    </>
  );
};

export default SignUp;
