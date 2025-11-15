import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QrRender({ onScan, onError }) {
  const idRef = useRef("qr-reader-" + Math.floor(Math.random() * 99999));
  const qrRef = useRef(null);

  useEffect(() => {
    const html5Qr = new Html5Qrcode(idRef.current);
    qrRef.current = html5Qr;

    html5Qr
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => onScan && onScan(decodedText),
        (err) => {}
      )
      .catch((err) => onError && onError(err));

    return () => {
      if (qrRef.current) {
        qrRef.current.stop().then(() => qrRef.current.clear());
      }
    };
  }, []);

  return (
    <div
      id={idRef.current}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  );
}
