import { getUsersPublicService } from "../../services/user.services";
import { FaEnvelope, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import FAQ from "./FAQ";

const AboutUs = () => {

  const [lawyers, setLawyers] = useState<any[]>([]);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    loadLawyers();
  }, []);

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

  const loadLawyers = async () => {
    try {
      const data = await getUsersPublicService();
      setLawyers(data);
    } catch {
      console.error('Ocurrio un error al obtener los abogados');
    }
  };

  return (
    <>
      <section
        ref={sectionRef}
        id="nosotros"
        className="py-24 bg-gray-50 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6">

          {/* 🔹 TOP SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">

            {/* TEXT */}
            <div
              className={`
                transition-all duration-700
                ${visible ? "fade-up opacity-100" : "opacity-0 translate-y-10"}
              `}
            >
              <span className="inline-flex items-center mb-4 px-4 py-2 rounded-full bg-primary/5 text-secondary text-xs tracking-widest uppercase">
                Sobre Nosotros
              </span>

              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                Experiencia legal con enfoque estratégico
              </h2>

              <p className="text-gray-600 mb-4 leading-relaxed">
                En <strong>Corporativo Monarca</strong>, no solo entendemos la ley;
                la aplicamos con precisión técnica para transformar desafíos en
                soluciones. Basamos nuestra práctica en tres pilares:
                especialización, prevención y acompañamiento integral.
              </p>
            </div>

            {/* IMAGE */}
            <div
              className={`
                relative group transition-all duration-1000
                ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}
              `}
            >
              <img
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216"
                alt="Video institucional"
                className="
                  rounded-2xl shadow-lg object-cover w-full h-[400px]
                  transition-transform duration-700
                  group-hover:scale-105
                "
              />

              {/* Overlay elegante hover */}
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition duration-500 rounded-2xl" />
            </div>

          </div>

          {/* 🔹 LAWYERS SECTION */}
          <div>
            <h3
              className={`
                text-2xl font-semibold text-primary mb-10 transition-all duration-700
                ${visible ? "fade-up opacity-100" : "opacity-0 translate-y-10"}
              `}
            >
              Nuestro equipo de abogados
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {lawyers.map((lawyer, index) => (
                <div
                  key={index}
                  className={`
                    group bg-white border border-gray-100 rounded-2xl overflow-hidden
                    shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col
                    ${visible ? "fade-up opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
                  `}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  {/* IMAGE */}
                  <div className="h-64 w-full overflow-hidden">
                    <img
                      src={lawyer.avatar}
                      alt={lawyer.name}
                      className="
                        w-full h-full object-cover
                        transition-transform duration-700
                        group-hover:scale-110
                      "
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-8 flex-1 flex flex-col">

                    <h4 className="text-lg font-semibold text-primary mb-2 group-hover:text-secondary transition">
                      {lawyer.name}
                    </h4>

                    <p className="text-sm text-gray-600 mb-4">
                      Especialista en {lawyer.specialty}
                    </p>

                    {/* Social */}
                    <div className="flex items-center gap-4 mb-6">
                      <a
                        href={`https://wa.me/${lawyer.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        className="text-primary/60 hover:text-secondary transition hover:scale-110 duration-300"
                      >
                        <FaWhatsapp size={22} />
                      </a>

                      <a
                        href={`mailto:${lawyer.email}`}
                        className="text-primary/60 hover:text-secondary transition hover:scale-110 duration-300"
                      >
                        <FaEnvelope size={22} />
                      </a>

                      <a
                        href={`tel:${lawyer.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        className="text-primary/60 hover:text-secondary transition hover:scale-110 duration-300"
                      >
                        <FaPhoneAlt size={22} />
                      </a>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto pt-6 border-t border-gray-100">
                      <span className="text-xs font-medium text-secondary uppercase tracking-wider">
                        CONTACTAME DE MANERA DIRECTA
                      </span>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <FAQ />
    </>
  );
};

export default AboutUs;