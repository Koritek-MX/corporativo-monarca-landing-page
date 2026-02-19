import { useState, useEffect, useRef } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const faqs = [
  {
    question: "¿Qué tipo de servicios legales ofrecen?",
    answer:
      "Ofrecemos asesoría y representación legal en derecho corporativo, mercantil, laboral y civil, enfocados en empresas y profesionistas.",
  },
  {
    question: "¿Atienden a personas físicas o solo empresas?",
    answer:
      "Atendemos tanto a empresas como a personas físicas, brindando soluciones legales personalizadas según cada caso.",
  },
  {
    question: "¿Cómo puedo agendar una consulta?",
    answer:
      "Puedes contactarnos a través del formulario, por WhatsApp o vía telefónica. Un asesor se pondrá en contacto contigo a la brevedad.",
  },
  {
    question: "¿Las consultas tienen costo?",
    answer:
      "La primera consulta puede ser gratuita o con costo preferencial, dependiendo del tipo de asunto. Te lo indicamos antes de agendar.",
  },
  {
    question: "¿En qué ciudades brindan atención?",
    answer:
      "Ofrecemos atención presencial en La Piedad de Cavadas, Michoacán, y también de manera remota, lo que nos permite trabajar con clientes en toda la República Mexicana.",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  /* 👉 Animación scroll reveal */
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

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="py-24 bg-white overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div
          className={`
            text-center max-w-2xl mx-auto mb-16 transition-all duration-700
            ${visible ? "fade-up opacity-100" : "opacity-0 translate-y-10"}
          `}
        >
          <span className="inline-flex items-center mb-4 px-4 py-2 rounded-full bg-primary/5 text-secondary text-xs tracking-widest uppercase">
            Preguntas Frecuentes
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            ¿Tienes dudas? Aquí las resolvemos
          </h2>

          <p className="text-gray-600">
            Respondemos las preguntas más comunes para que tomes una decisión
            informada y con confianza.
          </p>
        </div>

        {/* FAQ */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              style={{ transitionDelay: `${index * 120}ms` }}
              className={`
                border border-gray-200 rounded-xl overflow-hidden
                transition-all duration-500 hover:shadow-md
                ${visible ? "fade-up opacity-100" : "opacity-0 translate-y-12"}
              `}
            >
              {/* Question */}
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between p-6 text-left group"
              >
                <span className="text-base md:text-lg font-medium text-primary group-hover:text-secondary transition">
                  {faq.question}
                </span>

                <span
                  className={`
                    ml-4 text-secondary transition-transform duration-300
                    ${activeIndex === index ? "rotate-180" : ""}
                  `}
                >
                  {activeIndex === index ? (
                    <FaMinus size={16} />
                  ) : (
                    <FaPlus size={16} />
                  )}
                </span>
              </button>

              {/* Answer */}
              <div
                className={`
                  px-6 transition-all duration-500 ease-in-out
                  ${
                    activeIndex === index
                      ? "max-h-40 pb-6 opacity-100"
                      : "max-h-0 opacity-0 overflow-hidden"
                  }
                `}
              >
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FAQ;