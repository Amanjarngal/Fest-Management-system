import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle signup (Firebase only)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { email, password, name } = formData;

      // 🔹 Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // 🔹 Set display name
      await updateProfile(user, {
        displayName: name,
      });

      // 🔹 Optional: Force user to log out after registration
      await signOut(auth);

      toast.success("🎉 Account created successfully! Please login to continue.");
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      let message = "Something went wrong!";
      if (error.code === "auth/email-already-in-use")
        message = "This email is already registered.";
      else if (error.code === "auth/invalid-email")
        message = "Invalid email address.";
      else if (error.code === "auth/weak-password")
        message = "Password should be at least 6 characters.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-950 flex flex-col justify-center items-center text-white px-6">
      <div className="bg-gray-950 border border-gray-800 rounded-2xl shadow-xl p-10 w-full max-w-md">
        {/* Title Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-full mb-4"></div>
          <h1 className="text-4xl font-bold tracking-wide text-center">
            Create Account
          </h1>
          <p className="text-gray-400 mt-2 text-center">
            Join <span className="text-purple-400 font-semibold">EventFlow</span>{" "}
            and experience amazing events.
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
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
              placeholder="Enter your email"
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
              minLength={6}
              placeholder="Enter password"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-lg font-semibold rounded-full flex justify-center items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-[1.02] transition-transform duration-200 shadow-lg"
          >
            {loading ? "Creating Account..." : <>Sign Up <ArrowRight size={20} /></>}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-400 hover:underline font-medium"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
