import React, { useState } from "react";
import axios from "axios";

const GatePass = () => {
  const [formData, setFormData] = useState({ name: "", email: "", event: "" });
  const [qrValue, setQrValue] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/gatepass", formData);
      setQrValue(res.data.qrCodeData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-6">
      <div className="bg-black border border-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Generate Gate Pass</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="text" name="name" placeholder="Full Name" className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email Address" className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700" onChange={handleChange} required />
          <input type="text" name="event" placeholder="Event Name" className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700" onChange={handleChange} required />

          <button type="submit" disabled={loading} className="btn-gradient w-full py-3 rounded-full font-semibold">
            {loading ? "Generating..." : "Generate QR Pass"}
          </button>
        </form>

        {qrValue && (
          <div className="mt-8 text-center">
            <p className="text-purple-400 font-semibold mb-4">Scan this at entry gate:</p>
            <div className="bg-white p-4 rounded-lg inline-block">
              <img src={qrValue} alt="Gate Pass QR" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GatePass;
