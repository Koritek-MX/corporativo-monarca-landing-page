import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/523526881772"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="
        fixed
        bottom-6
        right-6
        z-50
        flex
        items-center
        justify-center
        w-14
        h-14
        rounded-full
        bg-[#25D366]
        text-white
        shadow-lg
        hover:scale-105
        hover:shadow-xl
        transition
      "
    >
      <FaWhatsapp size={35} />
    </a>
  );
};

export default WhatsAppButton;