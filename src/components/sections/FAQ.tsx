import { useState, useEffect, useRef } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { getFaqsPublicService } from "../../services/faq.service";

const FAQ = () => {

  const [faqs, setFaqs] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useEffect(() => {
    loadFaqs();
  }, []);


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

  const loadFaqs = async () => {
    try {

      const data = await getFaqsPublicService()
      const sorted = data.sort(
        (a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)
      );
      setFaqs(sorted);

    } catch {
      console.log('Error al cargar las P&R');
    }
  };

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
                  ${activeIndex === index
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