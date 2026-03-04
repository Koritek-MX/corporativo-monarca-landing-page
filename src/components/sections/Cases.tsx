import { useEffect, useRef, useState } from "react";
import { getSuccessCasesPublicService } from "../../services/successCase.service";

const SuccessCases = () => {

  const [cases, setCases] = useState<any[]>([]);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    loadCases();
  }, []);

  /* 👉 Detectar cuando entra al viewport */
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

  const loadCases = async () => {
    try {
      const data = await getSuccessCasesPublicService();
      const sorted = data.sort(
        (a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)
      );
      setCases(sorted);
    } catch {
      console.log('Error al cargar los casos');
    }
  };

  return (
    <section
      ref={sectionRef}
      id="casos"
      className="py-24 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div
          className={`
            max-w-3xl mb-16 transition-all duration-700
            ${visible ? "fade-up opacity-100" : "opacity-0 translate-y-10"}
          `}
        >
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

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cases.map((item, index) => (
            <div
              key={index}
              className={`
                group bg-white border border-gray-100 rounded-2xl overflow-hidden 
                shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col
                ${visible
                  ? "fade-up opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
                }
              `}
              style={{
                transitionDelay: `${index * 150}ms`,
              }}
            >
              {/* IMAGE */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="
                    w-full h-full object-cover
                    transition-transform duration-700
                    group-hover:scale-110
                  "
                />

                {/* Overlay sutil elegante */}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition duration-500" />
              </div>

              {/* CONTENT */}
              <div className="p-8 flex-1 flex flex-col">

                <h3 className="text-lg font-semibold text-primary mb-3 group-hover:text-secondary transition">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  {item.description}
                </p>

                {/* Bottom */}
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-100">
                  <span className="text-xs font-medium text-secondary uppercase tracking-wider">
                    {item.area}
                  </span>
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