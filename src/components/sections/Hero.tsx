// import heroImage from "../../assets/images/hero.jpg";

// const Hero = () => {
//   return (
//     <section
//       id="inicio"
//       className="relative h-[90vh] w-full bg-cover bg-center"
//       style={{ backgroundImage: `url(${heroImage})` }}
//     >
//       {/* Overlay */}
//       <div className="absolute inset-0 bg-primary/80" />

//       {/* Content */}
//       <div className="relative z-10 h-full flex items-center">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="max-w-2xl text-white md:ml-0 lg:-ml-150">

//             {/* Welcome */}
//             {/* <span className="inline-block mb-4 text-sm tracking-widest text-secondary uppercase">
//               Bienvenido a Corporativo Monarca
//             </span> */}
//             <span className="inline-flex items-center mb-6 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm text-xs tracking-widest uppercase text-secondary">
//               Bienvenidos a Corporativo Monarca
//             </span>

//             {/* Headline */}
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 uppercase">
//               Defendemos tus derechos <br />
//               con experiencia y compromiso
//             </h1>

//             {/* Description */}
//             {/* <p className="text-base md:text-lg text-white/90 mb-8 uppercase">
//               Somos un despacho jurídico especializado en brindar soluciones
//               legales efectivas, respaldadas por años de experiencia y un trato
//               profesional y cercano.
//             </p> */}

//             {/* CTA */}
//             <a
//               href="#contacto"
//               className="inline-block bg-secondary text-white font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition"
//             >
//               CONTÁCTANOS
//             </a>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;

import heroImage from "../../assets/images/hero.jpg";

const Hero = () => {
  return (
    <section
      id="inicio"
      className="relative min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary/80" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center pt-24">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl text-white">

            {/* Badge */}
            <span className="inline-flex items-center mb-6 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm text-xs tracking-widest uppercase text-secondary">
              Bienvenidos a Corporativo Monarca
            </span>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 uppercase">
              Defendemos tus derechos <br />
              <span className="text-white">
                con experiencia y compromiso
              </span>
            </h1>

            {/* Description (opcional, lista para activar) */}
            {/* 
            <p className="text-base md:text-lg text-white/90 mb-10">
              Somos un despacho jurídico especializado en brindar soluciones
              legales efectivas, respaldadas por años de experiencia y un trato
              profesional y cercano.
            </p>
            */}

            {/* CTA */}
            <a
              href="#contacto"
              className="inline-flex items-center justify-center bg-secondary text-white font-semibold px-10 py-4 rounded-xl text-sm md:text-base hover:bg-secondary/90 transition"
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