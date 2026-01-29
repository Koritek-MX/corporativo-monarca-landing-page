import {
  HiOutlineScale,
  HiOutlineBriefcase,
  HiOutlineUserGroup,
  HiOutlineDocumentText,
  HiOutlineOfficeBuilding,
  HiOutlineShieldCheck,
} from "react-icons/hi";

const services = [
  {
    title: "Derecho Familiar",
    description:
      "Brindamos asesoría y representación legal en asuntos familiares como divorcios, pensiones alimenticias, guarda y custodia, actuando siempre con sensibilidad, confidencialidad y enfoque en el bienestar de las personas involucradas.",
    icon: HiOutlineOfficeBuilding,
  },
  {
    title: "Derecho Civil",
    description:
      "Ofrecemos asesoría y representación legal en conflictos civiles relacionados con contratos, obligaciones, responsabilidad civil, sucesiones y propiedad, buscando soluciones jurídicas efectivas que protejan los derechos e intereses de nuestros clientes.",
    icon: HiOutlineUserGroup,
  },
  {
    title: "Derecho Penal",
    description:
      "Brindamos defensa y asesoría legal en procedimientos penales, representando a nuestros clientes con rigor jurídico, confidencialidad y compromiso en cada etapa del proceso, velando siempre por la protección de sus derechos, y garantizando una reparacion del daño.",
    icon: HiOutlineDocumentText,
  },
  {
    title: "Derecho Laboral",
    description:
      "Asesoramos y representamos a trabajadores y empresas en conflictos laborales, despidos, conciliaciones y cumplimiento de obligaciones legales, ofreciendo soluciones estratégicas y defensa efectiva de sus derechos.",
    icon: HiOutlineBriefcase,
  },
  {
    title: "Derecho Mercantil",
    description:
      "Ofrecemos asesoría y representación legal en asuntos mercantiles, incluyendo contratos comerciales, recuperación de cartera, cumplimiento de obligaciones y resolución de controversias, protegiendo los intereses de nuestros clientes y su actividad empresarial.",
    icon: HiOutlineScale,
  },
  {
    title: "Asesoria notarial",
    description:
      "Brindamos asesoría legal en trámites y actos notariales como compraventas, poderes, testamentos y regularización de bienes, asegurando seguridad jurídica, claridad y cumplimiento normativo en cada proceso.",
    icon: HiOutlineShieldCheck,
  },
];

const Services = () => {
  return (
    <section id="servicios" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="inline-flex items-center mb-4 px-4 py-2 rounded-full bg-primary/5 text-secondary text-xs tracking-widest uppercase">
            Nuestros Servicios
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Soluciones legales a la medida
          </h2>

          <p className="text-gray-600">
            No solo ejecutamos procesos legales; construimos el camino hacia su tranquilidad jurídica. Si hay un derecho que defender o una obligación que cumplir, nosotros somos su mejor aliado.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-lg transition"
            >
              {/* Icon */}
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/5 text-primary mb-6 group-hover:bg-primary group-hover:text-white transition">
                <service.icon size={24} />
              </div>

              {/* Content */}
              <h3 className="text-lg justify-center font-semibold text-primary mb-3">
                {service.title}
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed text-left md:text-justify">
                {service.description}
              </p>

              {/* Ver más */}
              {/* <div className="mt-6 text-right">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-primary/70 group-hover:text-secondary transition">
                  Ver más
                  <span className="transform group-hover:translate-x-1 transition">
                    →
                  </span>
                </span>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;