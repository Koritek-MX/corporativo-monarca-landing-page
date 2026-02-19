import heroImage from "../../assets/images/hero.webp";

const Hero = () => {
  const handleScrollToContact = (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();

    const contactSection = document.getElementById("contacto");
    if (!contactSection) return;

    contactSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      id="inicio"
      className="relative min-h-screen w-full bg-cover bg-center scroll-mt-28"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary/80" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center pt-24">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl text-white">

            {/* Badge */}
            <span className="inline-flex items-center mb-6 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm text-xs tracking-widest uppercase text-secondary opacity-0 animate-fadeUp animate-delay-1">
              Bienvenidos a Corporativo Monarca
            </span>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 uppercase opacity-0 animate-fadeUp animate-delay-2">
              Defendemos tus derechos <br />
              <span className="text-white">
                con experiencia y compromiso
              </span>
            </h1>

            {/* CTA */}
            <a
              href="#contacto"
              onClick={handleScrollToContact}
              className="inline-flex items-center justify-center bg-secondary text-white font-semibold px-10 py-4 rounded-xl text-sm md:text-base hover:bg-secondary/90 transition opacity-0 animate-fadeUp animate-delay-3"
            >
              CONTÁCTANOS
            </a>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;