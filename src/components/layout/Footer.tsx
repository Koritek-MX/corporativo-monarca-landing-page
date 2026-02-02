import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

import logo from "../../assets/images/monarca-gold.webp"; // ajusta ruta si es necesario

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-6 py-20">

        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-start">

          {/* Brand */}
          <div className="md:col-span-2">
            {/* Logo */}
            <img
              src={logo}
              alt="Corporativo Monarca"
              className="h-30 w-auto"
            />

            <h3 className="text-2xl font-bold mb-4">
              Corporativo Monarca
            </h3>

            <p className="text-white/80 max-w-md leading-relaxed">
              Despacho jurídico comprometido con brindar soluciones legales
              estratégicas, confiables y personalizadas para empresas y
              particulares.
            </p>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-secondary">
              Legal
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="/aviso-de-privacidad"
                  className="text-white/80 hover:text-secondary transition"
                >
                  Aviso de Privacidad
                </a>
              </li>
              <li>
                <a
                  href="/terminos-y-condiciones"
                  className="text-white/80 hover:text-secondary transition"
                >
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a
                  href="#contacto"
                  className="text-white/80 hover:text-secondary transition"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-secondary">
              Contacto
            </h4>

            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <FaPhoneAlt className="mt-1 text-secondary" />
                <span>352 501 5754</span>
              </li>

              <li className="flex items-start gap-2">
                <FaEnvelope className="mt-1 text-secondary" />
                <span>monarcacorporativo@outlook.com</span>
              </li>

              <li className="flex items-start gap-2">
                <FaMapMarkerAlt className="mt-1 text-secondary" />
                <span>
                  Juan Escutia #10, int 3, Col. Centro, CP. 59300,
                  La Piedad de Cabadas, Michoacán, México

                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-12"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Copyright */}
          <p className="text-sm text-white/60 text-center md:text-left">
            © {new Date().getFullYear()} Corporativo Monarca.
            Todos los derechos reservados.
          </p>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.facebook.com/profile.php?id=100062926254911"
              target="_blank"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-secondary hover:text-primary transition"
            >
              <FaFacebookF size={14} />
            </a>

            <a
              href="https://www.instagram.com/monarca_abogados/"
              target="_blank"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-secondary hover:text-primary transition"
            >
              <FaInstagram size={14} />
            </a>

            {/* <a
              href="#"
              aria-label="Youtube"
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-secondary hover:text-primary transition"
            >
              <FaYoutube size={14} />
            </a> */}
          </div>
        </div>
      </div>
      {/* Footer Bottom */}
      <div className="text-sm text-white/60 text-center pb-4">
        <a
          href="https://koritekmx.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Creado con ♥ por Koritek
        </a>
      </div>
    </footer>
  );
};

export default Footer;