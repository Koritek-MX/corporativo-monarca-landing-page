import { FaLinkedinIn, FaEnvelope, FaWhatsapp, FaPlay } from "react-icons/fa";
import Brau from "../../assets/images/brau.webp";
import Cony from "../../assets/images/cony.webp";
import Jesus from "../../assets/images/jesus.webp";
import { useState } from "react";
import FAQ from "./FAQ";

const lawyers = [
    {
        name: "Lic. Braulio Reyes Cervantes",
        role: "Derecho Laboral",
        image: Brau,
        phone: "+52 352 527 1774",
        linkedin: "#",
        email: "juan.perez@corporativomonarca.com",
    },
    {
        name: "Lic. Concepcion Solorio Sánchez",
        role: "Derecho Penal",
        image: Cony,
        phone: "+52 352 527 1774",
        linkedin: "#",
        email: "juan.perez@corporativomonarca.com",
    },
    {
        name: "Lic. Jesús Meza López",
        role: "Derecho Mercantil",
        image: Jesus,
        phone: "+52 352 527 1774",
        linkedin: "#",
        email: "juan.perez@corporativomonarca.com",
    },
];

const AboutUs = () => {
    const [isOpen, setIsOpen] = useState(false);

    // 🔁 Reemplaza por el ID real del video
    const videoId = "dQw4w9WgXcQ";

    return (
        <>
            <section id="nosotros" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">

                    {/* Top section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">

                        {/* Text */}
                        <div>
                            <span className="inline-flex items-center mb-4 px-4 py-2 rounded-full bg-primary/5 text-secondary text-xs tracking-widest uppercase">
                                Sobre Nosotros
                            </span>

                            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                                Experiencia legal con enfoque estratégico
                            </h2>

                            <p className="text-gray-600 mb-4 leading-relaxed">
                                En <strong>Corporativo Monarca</strong> brindamos soluciones legales
                                integrales, enfocadas en la prevención de riesgos, protección
                                patrimonial y crecimiento empresarial.
                            </p>

                            <p className="text-gray-600 leading-relaxed">
                                Nuestro equipo está conformado por abogados especializados que
                                combinan conocimiento jurídico, experiencia práctica y atención
                                personalizada.
                            </p>
                        </div>

                        {/* Image with play button */}
                        <div className="relative group cursor-pointer" onClick={() => setIsOpen(true)}>
                            <img
                                src="https://images.unsplash.com/photo-1521791136064-7986c2920216"
                                alt="Video institucional"
                                className="rounded-2xl shadow-lg object-cover w-full h-[400px]"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-primary/30 rounded-2xl flex items-center justify-center">
                                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                                    <FaPlay className="text-primary ml-1" size={28} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lawyers */}
                    <div>
                        <h3 className="text-2xl font-semibold text-primary mb-10">
                            Nuestro equipo de abogados
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {lawyers.map((lawyer, index) => (
                                <div
                                    key={index}
                                    className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col"
                                >
                                    {/* Image */}
                                    <div className="h-64 w-full overflow-hidden">
                                        <img
                                            src={lawyer.image}
                                            alt={lawyer.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="p-8 flex-1 flex flex-col">
                                        <h4 className="text-lg font-semibold text-primary mb-2">
                                            {lawyer.name}
                                        </h4>

                                        <p className="text-sm text-gray-600 mb-4">
                                            Especialista en {lawyer.role}
                                        </p>

                                        {/* Social icons */}
                                        <div className="flex items-center gap-4 mb-6">
                                            <a className="text-primary/60 hover:text-secondary transition">
                                                <FaWhatsapp size={18} />
                                            </a>
                                            <a className="text-primary/60 hover:text-secondary transition">
                                                <FaEnvelope size={18} />
                                            </a>
                                            <a className="text-primary/60 hover:text-secondary transition">
                                                <FaLinkedinIn size={18} />
                                            </a>
                                        </div>

                                        {/* Bottom row */}
                                        <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-100">
                                            <span className="text-xs font-medium text-secondary uppercase tracking-wider">
                                                {lawyer.role}
                                            </span>

                                            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary/70 group-hover:text-secondary transition cursor-pointer">
                                                Ver perfil →
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Modal */}
                {isOpen && (
                    <div
                        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
                        onClick={() => setIsOpen(false)}
                    >
                        <div
                            className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <iframe
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                                title="Video Corporativo"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                )}
            </section>
            <FAQ />
        </>
    );
};

export default AboutUs;