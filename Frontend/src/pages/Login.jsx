import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { ArrowRight, Eye, EyeOff, Chrome, Loader2 } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      const token = await user.getIdToken();

      // ✅ Store token in localStorage
      localStorage.setItem("token", token);

      navigate("/"); // redirect after login
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();

      // ✅ Store token in localStorage
      localStorage.setItem("token", token);

      navigate("/");
    } catch (err) {
      setError("Google login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      // user still logged in, refresh token
      const token = await user.getIdToken();
      localStorage.setItem("token", token);
    } else {
      // user logged out -> clean storage
      localStorage.removeItem("token");
    }
  });

  return () => unsubscribe();
}, []);
  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center text-white px-6">
      <div className="bg-black border border-gray-800 rounded-2xl shadow-xl p-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-full mb-4"></div>
          <h1 className="text-4xl font-bold tracking-wide text-center">Welcome Back</h1>
          <p className="text-gray-400 mt-2 text-center">Log in to continue your EventFlow journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              className="w-full px-4 py-3 pr-10 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
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
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <span>Login</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>

          <div className="flex items-center justify-center my-4">
            <div className="border-t border-gray-700 w-1/3"></div>
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <div className="border-t border-gray-700 w-1/3"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full py-3 border border-gray-700 rounded-full flex justify-center items-center space-x-3 hover:bg-gray-900 transition-all duration-200"
          >
            <Chrome size={20} className="text-yellow-400" />
            <span>Continue with Google</span>
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-purple-400 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
