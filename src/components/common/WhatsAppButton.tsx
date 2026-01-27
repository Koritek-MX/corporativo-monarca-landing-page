import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      
      {/* Tooltip / nube */}
      <div
        className="
          absolute right-16 top-1/2 -translate-y-1/2
          hidden md:flex
          items-center
          bg-primary text-white text-sm
          px-4 py-2
          rounded-xl
          shadow-lg
          opacity-0
          group-hover:opacity-100
          group-hover:translate-x-0
          translate-x-2
          transition-all
          pointer-events-none
          whitespace-nowrap
        "
      >
        Envíanos un WhatsApp

        {/* Flechita */}
        <span
          className="
            absolute right-[-6px] top-1/2 -translate-y-1/2
            w-3 h-3 bg-primary rotate-45
          "
        />
      </div>

      {/* Botón WhatsApp */}
      <a
        href="https://wa.me/523525015754"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Enviar WhatsApp"
        className="
          flex items-center justify-center
          w-14 h-14
          rounded-full
          bg-[#25D366]
          text-white
          shadow-lg
          hover:bg-[#1ebe5d]
          transition
        "
      >
        <FaWhatsapp size={35} />
      </a>
    </div>
  );
};

export default WhatsAppButton;