import { useState } from "react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { HiOutlineMenu, HiOutlineX, HiOutlinePhone } from "react-icons/hi";
import logo from "../../assets/react.svg";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* NAVBAR */}
      <header className="w-full bg-primary border-b border-white/20">
        <div className="w-full px-4 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Corporativo Monarca"
                className="h-11 w-auto object-contain"
              />
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex gap-10 text-sm lg:text-base font-semibold text-white">
              <a href="#inicio" className="hover:text-secondary transition">
                INICIO
              </a>
              <a href="#servicios" className="hover:text-secondary transition">
                SERVICIOS
              </a>
              <a href="#experiencia" className="hover:text-secondary transition">
                EXPERIENCIA
              </a>
              <a href="#casos" className="hover:text-secondary transition">
                CASOS DE ÉXITO
              </a>
              <a href="#blog" className="hover:text-secondary transition">
                BLOG
              </a>
              <a href="#contacto" className="hover:text-secondary transition">
                CONTACTO
              </a>
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
      </header>

      {/* MOBILE MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 bg-primary/95 backdrop-blur-sm flex flex-col">

          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 h-20 border-b border-white/20">
            <img src={logo} alt="Logo" className="h-10" />
            <button
              onClick={() => setOpen(false)}
              className="text-white"
              aria-label="Cerrar menú"
            >
              <HiOutlineX size={30} />
            </button>
          </div>

          {/* Menu */}
          <nav className="flex-1 flex flex-col items-center justify-center gap-8 text-lg font-semibold text-white">
            <a onClick={() => setOpen(false)} href="#inicio">INICIO</a>
            <a onClick={() => setOpen(false)} href="#servicios">SERVICIOS</a>
            <a onClick={() => setOpen(false)} href="#experiencia">EXPERIENCIA</a>
            <a onClick={() => setOpen(false)} href="#casos">CASOS DE ÉXITO</a>
            <a onClick={() => setOpen(false)} href="#blog">BLOG</a>
            <a onClick={() => setOpen(false)} href="#contacto">CONTACTO</a>
          </nav>

          {/* Modal Footer Info */}
          <div className="border-t border-white/20 px-6 py-6 text-white">

            {/* Contact Info */}
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
                Juan Escutia #10, int 3, Col. Centro, CP. 59300, <br /> La Piedad de Cabadas, Michoácan, Mexico
              </span>

            </div>

            {/* Social */}
            <div className="flex justify-center gap-6 mt-4">
              <a href="#" aria-label="Facebook" className="hover:text-secondary transition">
                <FaFacebookF size={18} />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-secondary transition">
                <FaInstagram size={18} />
              </a>
              <a href="#" aria-label="Youtube" className="hover:text-secondary transition">
                <FaYoutube size={18} />
              </a>
            </div>
          </div>

        </div>
      )}
    </>
  );
};

export default Navbar;