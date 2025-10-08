import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(userCredential.user, {
        displayName: formData.name,
      });

      navigate("/login"); // ✅ redirect to login instead of home
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center text-white px-6">
      <div className="bg-black border border-gray-800 rounded-2xl shadow-xl p-10 w-full max-w-md">
        {/* Logo / Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-full mb-4"></div>
          <h1 className="text-4xl font-bold tracking-wide text-center">Create Account</h1>
          <p className="text-gray-400 mt-2 text-center">
            Join EventFlow and experience amazing events.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-gradient w-full py-3 text-lg font-semibold rounded-full flex justify-center items-center space-x-2 transition-transform duration-200 hover:scale-[1.02]"
          >
            {loading ? <span>Creating Account...</span> : <>
              <span>Sign Up</span>
              <ArrowRight size={20} />
            </>}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-400 hover:underline font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
