import { useEffect, useState } from "react";
import logo from "../../assets/images/monarca-gold.webp";

const LandingSplash = ({ children }: any) => {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);

      setTimeout(() => {
        setLoading(false);
      }, 600); // tiempo del fade
    }, 1800); // duración total visible

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && (
        <div
          className={`fixed inset-0 z-[9999] bg-primary flex items-center justify-center transition-opacity duration-700 ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="relative flex items-center justify-center">

            {/* Logo animado */}
            <img
              src={logo}
              alt="Corporativo Monarca"
              className="h-40 w-auto object-contain animate-logo"
            />

            {/* Loader encima del logo */}
            <div className="absolute w-52 h-52 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
          </div>
        </div>
      )}

      {!loading && children}
    </>
  );
};

export default LandingSplash;