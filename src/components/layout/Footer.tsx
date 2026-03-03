import { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

import logo from "../../assets/images/monarca-gold.webp";

const Footer = () => {
  const [modal, setModal] = useState<"privacy" | "terms" | null>(null);

  return (
    <>
      <footer className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-6 py-20">

          {/* Top */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-start">

            {/* Brand */}
            <div className="md:col-span-2">
              <img src={logo} alt="Corporativo Monarca" className="h-30 w-auto" />

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
                  <button
                    onClick={() => setModal("privacy")}
                    className="text-white/80 hover:text-secondary transition"
                  >
                    Aviso de Privacidad
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => setModal("terms")}
                    className="text-white/80 hover:text-secondary transition"
                  >
                    Términos y Condiciones
                  </button>
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
                  <a
                    href="tel:+523525015754"
                    className="text-white hover:text-secondary transition"
                  >
                    352 501 5754
                  </a>
                </li>

                <li className="flex items-start gap-2">
                  <FaEnvelope className="mt-1 text-secondary" />
                  <a
                    href="mailto:monarcacorporativo@outlook.com"
                    className="text-white hover:text-secondary transition"
                  >
                    monarcacorporativo@outlook.com
                  </a>
                </li>

                <li className="flex items-start gap-2">
                  <FaMapMarkerAlt className="mt-1 text-secondary" />
                  <a
                    href="https://maps.app.goo.gl/sWKvVHXrAFQ2Xo959"
                    target="_blank"
                    className="text-white hover:text-secondary transition"
                  >
                    Juan Escutia #10, int 3, Col. Centro, CP. 59300,
                    La Piedad de Cavadas, Michoacán, México
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 my-12"></div>

          {/* Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-white/60">
              © {new Date().getFullYear()} Corporativo Monarca.
              Todos los derechos reservados.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=100062926254911"
                target="_blank"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-secondary hover:text-primary transition"
              >
                <FaFacebookF size={14} />
              </a>

              <a
                href="https://www.instagram.com/monarca_abogados/"
                target="_blank"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-secondary hover:text-primary transition"
              >
                <FaInstagram size={14} />
              </a>
            </div>
          </div>
        </div>

        <div className="text-sm text-white/60 text-center pb-4">
          <a href="https://koritekmx.com/" target="_blank">
            Creado con ♥ por Koritek
          </a>
        </div>
      </footer>

      {/* 🔥 MODAL */}
      {modal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6"
          onClick={() => setModal(null)}
        >
          <div
            className="bg-white max-w-3xl w-full rounded-2xl shadow-xl p-8 overflow-y-auto max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-primary mb-6">
              {modal === "privacy"
                ? "Aviso de Privacidad"
                : "Términos y Condiciones"}
            </h2>

            <div className="text-gray-700 space-y-4 text-sm leading-relaxed">

              {modal === "privacy" ? (
                <>
                  <p>
                    En Corporativo Monarca protegemos tus datos personales.
                    La información proporcionada será utilizada únicamente
                    para brindarte asesoría legal y contacto profesional.
                  </p>

                  <p>
                    No compartimos tu información con terceros sin tu
                    consentimiento, salvo requerimiento legal.
                  </p>

                  <p>
                    Puedes solicitar la modificación o eliminación de tus
                    datos escribiendo a nuestro correo oficial.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    El uso de este sitio implica la aceptación de nuestros
                    términos y condiciones.
                  </p>

                  <p>
                    La información proporcionada en esta página es
                    informativa y no constituye asesoría legal formal
                    hasta establecer contacto profesional.
                  </p>

                  <p>
                    Corporativo Monarca se reserva el derecho de modificar
                    estos términos sin previo aviso.
                  </p>
                </>
              )}
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setModal(null)}
                className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;