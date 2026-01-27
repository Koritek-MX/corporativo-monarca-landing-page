import experienceImage from "../../assets/images/DERECHO-PENAL.jpeg";
import { useEffect, useRef, useState } from "react";
import Counter from "../common/Counter";

const stats = [
  { value: 10, label: "Años de experiencia", suffix: "+", duration: 3000 },
  { value: 500, label: "Casos atendidos", suffix: "+", duration: 4000 },
  { value: 95, label: "Casos favorables", suffix: "%", duration: 2500 },
];

const Experience = () => {

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experiencia"
      className="py-24 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Text Content */}
        <div>
          {/* Badge */}
          <span className="inline-flex items-center mb-6 px-4 py-2 rounded-full bg-primary/5 text-secondary text-xs tracking-widest uppercase">
            Nuestra Experiencia
          </span>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            Trayectoria que respalda <br /> cada decisión legal
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-10 leading-relaxed max-w-xl">
            En Corporativo Monarca contamos con una sólida experiencia en la
            defensa y asesoría jurídica, brindando soluciones legales estratégicas
            a personas y empresas, siempre con ética y profesionalismo.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index}>
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  <Counter
                    end={stat.value}
                    duration={stat.duration}
                    start={visible}
                  />
                  {stat.suffix}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Image */}
        <div className="relative">
          <img
            src={experienceImage}
            alt="Experiencia Corporativo Monarca"
            className="w-full h-[420px] object-cover rounded-2xl shadow-lg"
          />
        </div>

      </div>
    </section>
  );
};

export default Experience;