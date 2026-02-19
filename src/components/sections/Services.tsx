import { useEffect, useRef, useState } from "react";
import {
  HiOutlineScale,
  HiOutlineBriefcase,
  HiOutlineUserGroup,
  HiOutlineDocumentText,
  HiOutlineOfficeBuilding,
  HiOutlineShieldCheck,
} from "react-icons/hi";

const useRevealOnScroll = () => {
  const ref = useRef<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return { ref, visible };
};

const services = [
  {
    title: "Derecho Familiar",
    description:
      "Brindamos asesoría y representación legal en asuntos familiares como divorcios, pensiones alimenticias, guarda y custodia, actuando siempre con sensibilidad y confidencialidad.",
    icon: HiOutlineOfficeBuilding,
  },
  {
    title: "Derecho Civil",
    description:
      "Asesoría y representación en conflictos civiles relacionados con contratos, obligaciones, sucesiones y propiedad, buscando soluciones jurídicas efectivas.",
    icon: HiOutlineUserGroup,
  },
  {
    title: "Derecho Penal",
    description:
      "Defensa y asesoría legal en procedimientos penales con rigor jurídico, confidencialidad y compromiso en cada etapa del proceso.",
    icon: HiOutlineDocumentText,
  },
  {
    title: "Derecho Laboral",
    description:
      "Asesoramos y representamos a trabajadores y empresas en conflictos laborales, despidos y conciliaciones.",
    icon: HiOutlineBriefcase,
  },
  {
    title: "Derecho Mercantil",
    description:
      "Asesoría en contratos comerciales, recuperación de cartera y resolución de controversias empresariales.",
    icon: HiOutlineScale,
  },
  {
    title: "Asesoría Notarial",
    description:
      "Acompañamiento legal en compraventas, testamentos, poderes y regularización de bienes.",
    icon: HiOutlineShieldCheck,
  },
];

const Services = () => {
  const { ref, visible } = useRevealOnScroll();

  return (
    <>
      <section id="servicios" className="py-24 bg-white" ref={ref}>
        <div className="max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className={`max-w-3xl mb-16 ${visible ? "fade-up" : ""}`}>
            <span className="inline-flex items-center mb-4 px-4 py-2 rounded-full bg-primary/5 text-secondary text-xs tracking-widest uppercase">
              Nuestros Servicios
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Soluciones legales a la medida
            </h2>

            <p className="text-gray-600">
              No solo ejecutamos procesos legales, construimos el camino hacia su tranquilidad jurídica.
              Si hay un derecho que defender o una obligación que cumplir, somos su mejor aliado.
            </p>
          </div>

          {/* Grid servicios */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className={`
                  group bg-white border border-gray-100 rounded-2xl p-8
                  shadow-sm hover:shadow-xl hover:-translate-y-1
                  transition duration-300
                  ${visible ? `fade-up delay-${index + 1}` : ""}
                `}
              >
                {/* Icon */}
                <div
                  className="
                    w-12 h-12 flex items-center justify-center rounded-xl
                    bg-primary/5 text-primary mb-6
                    transition duration-300
                    group-hover:bg-primary group-hover:text-white
                    group-hover:scale-110
                  "
                >
                  <service.icon size={24} />
                </div>

                {/* Título */}
                <h3 className="text-lg font-semibold text-primary mb-3">
                  {service.title}
                </h3>

                {/* Descripción */}
                <p className="text-sm text-gray-600 leading-relaxed text-justify">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
};

export default Services;