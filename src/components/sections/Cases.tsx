const cases = [
  {
    title: "Resolución favorable en conflicto laboral",
    description:
      "Resolución de pérdida de la patria potestad en favor de nuestra clienta y su hijo, después de haber sufrido violencia familiar.",
    area: "Derecho Familiar",
    image:
      "https://blogs.evaluar.com/hubfs/images/resolver-conflictos-600X300.jpg",
  },
  {
    title: "Sentencia condenatoria de prision",
    description:
      "En favor de nuestra clienta, víctima del delito de violación por parte de su padrastro.",
    area: "Derecho Penal",
    image:
      "https://static.wixstatic.com/media/11062b_83086fb64b6248d2a2ff560b1e89af1a~mv2.jpg",
  },
  {
    title: "Recuperación de cartera vencida",
    description:
      "Liquidación de alimentos retroactivos en favor de nuestra clienta y sus hijos por más de un $1,000,000 MXN.",
    area: "Derecho Familiar",
    image:
      "https://i0.wp.com/advacoo.com.mx/wp-content/uploads/2021/12/credito-pymes-min.jpg?fit=800%2C400&ssl=1",
  }
];

const SuccessCases = () => {
  return (
    <section id="casos" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="inline-flex items-center mb-4 px-4 py-2 rounded-full bg-primary/5 text-secondary text-xs tracking-widest uppercase">
            Casos de Éxito
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Resultados que respaldan nuestro trabajo
          </h2>

          <p className="text-gray-600">
            Nuestra experiencia se refleja en soluciones legales efectivas y
            resultados favorables para nuestros clientes.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cases.map((item, index) => (
            <div
              key={index}
              className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col"
            >
              {/* Image */}
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-primary mb-3">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  {item.description}
                </p>

                {/* Bottom row */}
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-100">
                  <span className="text-xs font-medium text-secondary uppercase tracking-wider">
                    {item.area}
                  </span>

                  {/* <span className="inline-flex items-center gap-2 text-sm font-medium text-primary/70 group-hover:text-secondary transition">
                    Ver más
                    <span className="transform group-hover:translate-x-1 transition">
                      →
                    </span>
                  </span> */}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SuccessCases;