import { createContactService } from "../../services/contact.service";
import { useState, useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import Swal from "sweetalert2";

import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt
} from "react-icons/fa";

const Contact = () => {

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    state: "Michoacán",
    city: "",
    message: "",
  });

  /* 👉 Scroll reveal */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone) {
      return Swal.fire("Error", "Completa los campos", "warning");
    }

    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        city: `${form.city}, ${form.state}`,
        message: form.message,
        captchaToken
      };

      await createContactService(payload);

      await Swal.fire({
        icon: "success",
        title: "Mensaje enviado",
        text: "Te contactaremos pronto",
        timer: 1800,
        showConfirmButton: false,
      });

      setForm({
        name: "",
        email: "",
        phone: "",
        state: "Michoacán",
        city: "",
        message: "",
      });

      /* 🔥 Reset captcha */
      recaptchaRef.current?.reset();
      setCaptchaToken(null);

    } catch {
      Swal.fire("Error", "No se pudo enviar", "error");
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
    }
  };

  const isFormValid =
    form.name.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.city.trim() &&
    form.message.trim() &&
    captchaToken;

  return (
    <section
      ref={sectionRef}
      id="contacto"
      className="py-24 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* LEFT COLUMN */}
          <div
            className={`
              transition-all duration-700
              ${visible ? "fade-up opacity-100" : "opacity-0 translate-y-10"}
            `}
          >
            <span className="inline-flex items-center mb-4 px-4 py-2 rounded-full bg-primary/5 text-secondary text-xs tracking-widest uppercase">
              Contacto
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Hablemos sobre tu caso
            </h2>

            <p className="text-gray-600 mb-10">
              Nuestro equipo está listo para brindarte una asesoría legal clara,
              profesional y confidencial. Te respondemos en menos de 24 horas.
            </p>

            {/* INFO */}
            <div className="space-y-8">

              <div className="flex items-start gap-4 hover:translate-x-1 transition">
                <FaPhoneAlt className="text-secondary mt-1" />
                <div>
                  <p className="font-semibold text-primary">Teléfono</p>
                  <a
                    href="tel:+523523200006"
                    aria-label="Llamar al Corporativo Monarca al 352 230 0006"
                    className="text-gray-600 hover:text-secondary transition"
                  >
                    352 230 0006
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 hover:translate-x-1 transition">
                <FaEnvelope className="text-secondary mt-1" />
                <div>
                  <p className="font-semibold text-primary">
                    Correo electrónico
                  </p>
                  <a
                    href="mailto:monarcacorporativo@outlook.com"
                    className="text-gray-600 hover:text-secondary transition"
                  >
                    monarcacorporativo@outlook.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaMapMarkerAlt className="text-secondary mt-1" />

                <div className="w-full">
                  <p className="font-semibold text-primary mb-2">
                    Ubicación
                  </p>

                  <p className="text-gray-600 mb-4">
                    Juan Escutia #10, int 3, Col. Centro, CP. 59300,
                    La Piedad de Cavadas, Michoacán, México
                  </p>

                  {/* MAP */}
                  <div className="
                    w-full h-56 rounded-xl overflow-hidden
                    border border-gray-200
                    hover:shadow-xl transition
                  ">
                    <iframe
                      title="Ubicación Corporativo Monarca"
                      src="https://www.google.com/maps?q=Juan%20Escutia%2010%20La%20Piedad%20de%20Cabadas%20Michoacan&output=embed"
                      className="w-full h-full border-0"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FORM */}
          <form
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 space-y-6"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                placeholder="Juan Perez"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="ejemplo@gmail.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                placeholder="3525616327"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-primary mb-1">
                Estado
              </label>

              <select
                id="state"
                name="state"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
                value={form.state}
                onChange={(e) =>
                  setForm({ ...form, state: e.target.value })
                }
              >
                <option value="Aguascalientes">Aguascalientes</option>
                <option value="Baja California">Baja California</option>
                <option value="Baja California Sur">Baja California Sur</option>
                <option value="Campeche">Campeche</option>
                <option value="Chiapas">Chiapas</option>
                <option value="Chihuahua">Chihuahua</option>
                <option value="Ciudad de México">Ciudad de México</option>
                <option value="Coahuila">Coahuila</option>
                <option value="Colima">Colima</option>
                <option value="Durango">Durango</option>
                <option value="Estado de México">Estado de México</option>
                <option value="Guanajuato">Guanajuato</option>
                <option value="Guerrero">Guerrero</option>
                <option value="Hidalgo">Hidalgo</option>
                <option value="Jalisco">Jalisco</option>
                <option value="Michoacán">Michoacán</option>
                <option value="Morelos">Morelos</option>
                <option value="Nayarit">Nayarit</option>
                <option value="Nuevo León">Nuevo León</option>
                <option value="Oaxaca">Oaxaca</option>
                <option value="Puebla">Puebla</option>
                <option value="Querétaro">Querétaro</option>
                <option value="Quintana Roo">Quintana Roo</option>
                <option value="San Luis Potosí">San Luis Potosí</option>
                <option value="Sinaloa">Sinaloa</option>
                <option value="Sonora">Sonora</option>
                <option value="Tabasco">Tabasco</option>
                <option value="Tamaulipas">Tamaulipas</option>
                <option value="Tlaxcala">Tlaxcala</option>
                <option value="Veracruz">Veracruz</option>
                <option value="Yucatán">Yucatán</option>
                <option value="Zacatecas">Zacatecas</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Ciudad / Pueblo
              </label>
              <input
                type="text"
                placeholder="La Piedad de Cavadas"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
                value={form.city}
                onChange={(e) =>
                  setForm({ ...form, city: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Mensaje
              </label>
              <textarea
                rows={4}
                placeholder="Cuéntanos brevemente tu caso"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
              />
            </div>

            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={(token) => setCaptchaToken(token)}
            />

            <button
              type="submit"
              disabled={!isFormValid}
              className={`
              w-full font-semibold py-4 rounded-xl transition
              ${isFormValid
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"}
            `}
            >
              Enviar mensaje
            </button>
          </form>

        </div>
      </div>
    </section>
  );
};

export default Contact;