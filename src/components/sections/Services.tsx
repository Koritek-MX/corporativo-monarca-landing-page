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
    title: "Derecho Corporativo",
    description:
      "Asesoría legal integral para empresas, contratos, cumplimiento normativo y gobierno corporativo.",
    icon: HiOutlineOfficeBuilding,
  },
  {
    title: "Derecho Laboral",
    description:
      "Defensa y asesoría en relaciones laborales, despidos, contratos y cumplimiento ante autoridades.",
    icon: HiOutlineUserGroup,
  },
  {
    title: "Derecho Civil",
    description:
      "Representación en controversias civiles, contratos, arrendamientos y responsabilidad civil.",
    icon: HiOutlineDocumentText,
  },
  {
    title: "Derecho Mercantil",
    description:
      "Soluciones legales para operaciones comerciales, cobranza, sociedades y litigios mercantiles.",
    icon: HiOutlineBriefcase,
  },
  {
    title: "Litigio Estratégico",
    description:
      "Defensa jurídica especializada con estrategias personalizadas para cada caso.",
    icon: HiOutlineScale,
  },
  {
    title: "Cumplimiento Legal",
    description:
      "Prevención de riesgos legales y acompañamiento en auditorías y procesos regulatorios.",
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
            Brindamos asesoría jurídica especializada con un enfoque estratégico,
            ético y orientado a resultados para proteger tus intereses.
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
              <h3 className="text-lg font-semibold text-primary mb-3">
                {service.title}
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                {service.description}
              </p>

              {/* Ver más */}
              <div className="mt-6 text-right">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-primary/70 group-hover:text-secondary transition">
                  Ver más
                  <span className="transform group-hover:translate-x-1 transition">
                    →
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;