// import {
//   FaPhoneAlt,
//   FaEnvelope,
//   FaMapMarkerAlt,
//   FaWhatsapp,
// } from "react-icons/fa";

// const Contact = () => {
//   return (
//     <section id="contacto" className="py-24 bg-primary text-white">
//       <div className="max-w-7xl mx-auto px-6">

//         {/* Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

//           {/* Left column */}
//           <div>
//             {/* Header */}
//             <span className="inline-flex items-center mb-4 px-4 py-2 rounded-full bg-white/10 text-secondary text-xs tracking-widest uppercase">
//               Contacto
//             </span>

//             <h2 className="text-3xl md:text-4xl font-bold mb-4">
//               Hablemos sobre tu caso
//             </h2>

//             <p className="text-white/80 mb-10">
//               Nuestro equipo está listo para brindarte una asesoría legal clara,
//               profesional y confidencial.
//               Te respondemos en menos de 24 horas.
//             </p>

//             {/* Info */}
//             <div className="space-y-8">
//               <div className="flex items-start gap-4">
//                 <FaPhoneAlt className="text-secondary mt-1" />
//                 <div>
//                   <p className="font-semibold">Teléfono</p>
//                   <a
//                     href="tel:+523525015754"
//                     className="text-white/80 hover:text-secondary transition"
//                   >
//                     352 501 5754
//                   </a>
//                 </div>
//               </div>

//               <div className="flex items-start gap-4">
//                 <FaEnvelope className="text-secondary mt-1" />
//                 <div>
//                   <p className="font-semibold">Correo electrónico</p>
//                   <a
//                     href="mailto:monarcacorporativo@outlook.com"
//                     className="text-white/80 hover:text-secondary transition"
//                   >
//                     monarcacorporativo@outlook.com
//                   </a>
//                 </div>
//               </div>

//               <div className="flex items-start gap-4">
//                 <FaMapMarkerAlt className="text-secondary mt-1" />
//                 <div>
//                   <p className="font-semibold">Ubicación</p>
//                   <p className="text-white/80">
//                     Juan Escutia #10, int 3, Col. Centro, CP. 59300, <br />
//                     La Piedad de Cabadas, Michoácan, México
//                   </p>
//                 </div>
//               </div>

//               {/* WhatsApp */}
//               <a
//                 href="https://wa.me/523525015754"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center gap-3 bg-secondary text-primary font-semibold px-6 py-4 rounded-xl hover:bg-secondary/90 transition w-fit"
//               >
//                 <FaWhatsapp />
//                 Escríbenos por WhatsApp
//               </a>
//             </div>
//           </div>

//           {/* Form */}
//           <form
//             className="bg-white rounded-2xl p-8 shadow-lg text-primary space-y-6"
//             onSubmit={(e) => e.preventDefault()}
//           >
//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Nombre completo
//               </label>
//               <input
//                 type="text"
//                 placeholder="Tu nombre"
//                 className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Correo electrónico
//               </label>
//               <input
//                 type="email"
//                 placeholder="tu@email.com"
//                 className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Teléfono
//               </label>
//               <input
//                 type="tel"
//                 placeholder="Tu número"
//                 className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Ciudad/Pueblo
//               </label>
//               <input
//                 type="text"
//                 placeholder="La Piedad de Cavadas, Michoácan"
//                 className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Mensaje
//               </label>
//               <textarea
//                 rows={4}
//                 placeholder="Cuéntanos brevemente tu caso"
//                 className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
//               />
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-primary text-white font-semibold py-4 rounded-xl hover:bg-primary/90 transition"
//             >
//               Enviar mensaje
//             </button>
//           </form>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default Contact;

import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";

const Contact = () => {
  return (
    <section id="contacto" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left column */}
          <div>
            {/* Header */}
            <span className="inline-flex items-center mb-4 px-4 py-2 rounded-full bg-primary/5 text-secondary text-xs tracking-widest uppercase">
              Contacto
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Hablemos sobre tu caso
            </h2>

            <p className="text-gray-600 mb-10">
              Nuestro equipo está listo para brindarte una asesoría legal clara,
              profesional y confidencial.
              Te respondemos en menos de 24 horas.
            </p>

            {/* Info */}
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <FaPhoneAlt className="text-secondary mt-1" />
                <div>
                  <p className="font-semibold text-primary">Teléfono</p>
                  <a
                    href="tel:+523525015754"
                    className="text-gray-600 hover:text-secondary transition"
                  >
                    352 501 5754
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaEnvelope className="text-secondary mt-1" />
                <div>
                  <p className="font-semibold text-primary">
                    Correo electrónico
                  </p>
                  <a
                    href="mailto:monarcacorporativo@outlook.com"
                    className="text-gray-600 hover:text-secondary transition"
                  >
                    monarcacorporativo@outlook.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaMapMarkerAlt className="text-secondary mt-1" />
                <div>
                  <p className="font-semibold text-primary">Ubicación</p>
                  <p className="text-gray-600">
                    Juan Escutia #10, int 3, Col. Centro, CP. 59300, <br />
                    La Piedad de Cabadas, Michoacán, México
                  </p>
                </div>
              </div>

              {/* WhatsApp */}
              <a
                href="https://wa.me/523525015754"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-primary text-white font-semibold px-6 py-4 rounded-xl hover:bg-primary/90 transition w-fit"
              >
                <FaWhatsapp />
                Escríbenos por WhatsApp
              </a>
            </div>
          </div>

          {/* Form */}
          <form
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 space-y-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                placeholder="Tu nombre"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="tu@email.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                placeholder="Tu número"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Ciudad / Pueblo
              </label>
              <input
                type="text"
                placeholder="La Piedad de Cabadas, Michoacán"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Mensaje
              </label>
              <textarea
                rows={4}
                placeholder="Cuéntanos brevemente tu caso"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white font-semibold py-4 rounded-xl hover:bg-primary/90 transition"
            >
              Enviar mensaje
            </button>
          </form>

        </div>
      </div>
    </section>
  );
};

export default Contact;