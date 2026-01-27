import { useState, useEffect } from "react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { HiOutlineMenu, HiOutlineX, HiOutlinePhone } from "react-icons/hi";
import logo from "../../assets/images/monarca-gold.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hide / show navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (open) return;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShow(false);
      } else {
        setShow(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, open]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <>
      {/* NAVBAR */}
      <header
        className={`
          fixed top-0 left-0 w-full z-50
          bg-primary
          transition-transform duration-300
          ${show ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        <div className="pt-2 pb-2 w-full">
          <div className="w-full px-4 lg:px-8 xl:px-12">
            <div className="flex items-center justify-between h-20">

              {/* Logo */}
              <div className="flex items-center gap-3">
                <img
                  src={logo}
                  alt="Corporativo Monarca"
                  className="h-30 w-auto object-contain"
                />
              </div>

              {/* Desktop Menu */}
              <nav className="hidden md:flex gap-10 text-sm lg:text-base font-semibold text-white">
                <a href="#inicio" className="hover:text-secondary transition">INICIO</a>
                <a href="#servicios" className="hover:text-secondary transition">SERVICIOS</a>
                <a href="#experiencia" className="hover:text-secondary transition">EXPERIENCIA</a>
                <a href="#casos" className="hover:text-secondary transition">CASOS DE ÉXITO</a>
                <a href="#nosotros" className="hover:text-secondary transition">SOBRE NOSOTROS</a>
                <a href="#blog" className="hover:text-secondary transition">BLOG</a>
                <a href="#contacto" className="hover:text-secondary transition">CONTACTO</a>
              </nav>

              {/* Desktop Right */}
              <div className="hidden md:flex items-center gap-6 text-right">
                <div className="flex gap-3 text-white">
                  <FaFacebookF size={20} />
                  <FaInstagram size={20} />
                  <FaYoutube size={20} />
                </div>

                <div className="w-px h-8 bg-white/30" />

                <div className="text-sm font-semibold text-white leading-tight">
                  <span className="block">¿Necesitas ayuda?</span>
                  <a
                    href="tel:+523525015754"
                    className="flex items-center gap-2 font-bold hover:text-secondary transition"
                  >
                    <HiOutlinePhone size={16} />
                    352 501 5754
                  </a>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-white"
                onClick={() => setOpen(true)}
                aria-label="Abrir menú"
              >
                <HiOutlineMenu size={30} />
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* MOBILE MODAL (ANIMATED) */}
      <div
        className={`
          fixed inset-0 z-50
          bg-primary/95 backdrop-blur-sm
          transition-all duration-300 ease-out
          ${open ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      >
        <div
          className={`
            flex flex-col h-full
            transform transition-all duration-300 ease-out
            ${open ? "translate-y-0" : "-translate-y-6"}
          `}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 h-24 border-b border-white/20">
            <img
              src={logo}
              alt="Corporativo Monarca"
              className="h-30 w-auto object-contain"
            />
            <button
              onClick={() => setOpen(false)}
              className="text-white"
              aria-label="Cerrar menú"
            >
              <HiOutlineX size={32} />
            </button>
          </div>

          {/* Menu */}
          <nav className="flex-1 flex flex-col items-center justify-center gap-8 text-lg font-semibold text-white">
            {["inicio","servicios","experiencia","casos","nosotros","blog","contacto"].map(id => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className="hover:text-secondary transition"
              >
                {id.toUpperCase()}
              </a>
            ))}
          </nav>

          {/* Modal Footer Info */}
          <div className="border-t border-white/20 px-6 py-6 text-white">
            <div className="flex flex-col items-center gap-3 text-sm">
              <b>¡Contáctanos!</b>

              <a
                href="tel:+523525015754"
                className="hover:text-secondary transition font-semibold"
              >
                352 501 5754
              </a>

              <a
                href="mailto:monarcacorporativo@outlook.com"
                className="hover:text-secondary transition"
              >
                monarcacorporativo@outlook.com
              </a>

              <span className="opacity-90 text-center">
                Juan Escutia #10, int 3, Col. Centro, CP. 59300,<br />
                La Piedad de Cabadas, Michoacán, México
              </span>
            </div>

            <div className="flex justify-center gap-6 mt-4">
              <FaFacebookF size={18} />
              <FaInstagram size={18} />
              <FaYoutube size={18} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;