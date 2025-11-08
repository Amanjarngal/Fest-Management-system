import React from "react";
import { X, Download } from "lucide-react";

const QRModal = ({ qrCode, onClose }) => {
  if (!qrCode) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container */}
      <div className="relative bg-gradient-to-b from-gray-900 via-gray-950 to-black border border-gray-700 rounded-2xl shadow-2xl w-[92%] sm:w-[450px] max-h-[90vh] overflow-y-auto p-6 text-center animate-scaleIn">
        
        {/* Sticky Header (Title + Close Button) */}
        <div className="sticky top-0 bg-gray-900 z-10 flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
          <h2 className="text-xl font-semibold text-yellow-400">Stall QR Code</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-yellow-400 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* QR Image */}
        <div className="flex justify-center mb-5">
          <img
            src={qrCode}
            alt="Stall QR"
            className="w-60 h-60 rounded-xl border border-gray-700 shadow-lg shadow-yellow-500/20"
          />
        </div>

        {/* Info / Description Section */}
        <div className="text-gray-300 space-y-3 mb-6 px-1">
          <p className="text-sm leading-relaxed">
            Scan this QR to view the stall’s live details, menu, and offers.
          </p>
          <p className="text-sm italic opacity-80">
            You can also download and print it for your stall board.
          </p>
          <p className="text-sm">
            If the QR is blurry, try downloading the image and printing it in
            higher resolution.
          </p>
          <p className="text-sm opacity-70">
            Ensure your browser allows popups to preview QR codes properly.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={qrCode}
            download="stall-qr.png"
            className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-5 py-2 rounded-lg shadow-lg transition-all"
          >
            <Download size={18} /> Download QR
          </a>

          <button
            onClick={onClose}
            className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-medium px-5 py-2 rounded-lg transition-all"
          >
            <X size={18} /> Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRModal;
