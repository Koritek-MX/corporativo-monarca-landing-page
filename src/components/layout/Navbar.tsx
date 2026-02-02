import { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { HiOutlineMenu, HiOutlineX, HiOutlinePhone } from "react-icons/hi";
import logo from "../../assets/images/monarca-gold.webp";

const sections = [
  "inicio",
  "servicios",
  "experiencia",
  "casos",
  "nosotros",
  "blog",
  "contacto",
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("inicio");
  const [isNavigating, setIsNavigating] = useState(false);

  /* 👉 Scroll suave al seleccionar sección */
  const handleScrollToSection = (
    e: React.MouseEvent,
    sectionId: string
  ) => {
    e.preventDefault();

    const target = document.getElementById(sectionId);
    if (!target) return;

    setShow(true);
    setIsNavigating(true);

    // Scroll suave
    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    // Cerrar drawer si está abierto
    if (open) setOpen(false);

    // Reactivar hide/show después del scroll
    setTimeout(() => {
      setIsNavigating(false);
      setLastScrollY(window.scrollY);
    }, 700);
  };

  /* Hide / show navbar on scroll */
  useEffect(() => {
    const handleScroll = () => {
      if (open || isNavigating) return;

      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShow(false);
      } else {
        setShow(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, open, isNavigating]);

  /* Lock body scroll when drawer is open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  /* Scroll Spy */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0,
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);



  function openLogin() {
    console.log("Abrir login");
  }

  return (
    <>
      {/* NAVBAR */}
      <header
        className={`
          fixed top-0 left-0 w-full z-50
          bg-primary
          transition-transform duration-300
          ${show ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        <div className="pt-2 pb-2 w-full">
          <div className="w-full px-4 lg:px-8 xl:px-12">
            <div className="flex items-center justify-between h-20">

              {/* Logo */}
              <img
                src={logo}
                alt="Corporativo Monarca"
                className="h-30 w-auto object-contain"
              />

              {/* Desktop Menu */}
              <nav className="hidden md:flex gap-10 text-sm lg:text-base font-semibold">
                {sections.map((id) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={(e) => handleScrollToSection(e, id)}
                    className={`
                      relative pb-1 transition-colors duration-300
                      ${activeSection === id
                        ? "text-secondary after:scale-x-100"
                        : "text-white hover:text-secondary after:scale-x-0"
                      }
                      after:content-['']
                      after:absolute
                      after:left-0
                      after:-bottom-1
                      after:w-full
                      after:h-[2px]
                      after:bg-secondary
                      after:origin-left
                      after:transition-transform
                      after:duration-300
                    `}
                  >
                    {id.toUpperCase()}
                  </a>
                ))}
              </nav>

              {/* Desktop Right */}
              <div className="hidden md:flex items-center gap-6 text-white">
                <div className="flex gap-3">
                  <FaUser
                    className="hover:text-secondary transition"
                    href="#"
                    size={25}
                    onClick={openLogin}
                  />
                </div>

                <div className="w-px h-8 bg-white/30" />

                <div className="text-sm font-semibold leading-tight text-right">
                  <span className="block text-xs opacity-80">
                    ¿Necesitas ayuda?
                  </span>
                  <a
                    href="tel:+523525015754"
                    className="flex items-center gap-2 font-bold hover:text-secondary transition"
                  >
                    <HiOutlinePhone size={16} />
                    352 501 5754
                  </a>
                </div>
              </div>


              {/* Mobile Buttons */}
              <div className="md:hidden flex items-center gap-2">
                <button
                  className="text-white"
                  onClick={openLogin}
                  aria-label="Abrir login"
                >
                  <FaUser
                    className="hover:text-secondary transition"
                    size={30}
                  />
                </button>

                <button
                  className="text-white"
                  onClick={() => setOpen(true)}
                  aria-label="Abrir menú"
                >
                  <HiOutlineMenu size={35} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <div
        className={`
          fixed inset-0 z-50
          transition-all duration-300
          ${open ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`
            absolute top-0 right-0 h-full w-full max-w-sm
            bg-primary
            transform transition-transform duration-300
            ${open ? "translate-x-0" : "translate-x-full"}
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 h-24 border-b border-white/20">
            <img
              src={logo}
              alt="Corporativo Monarca"
              className="h-30 w-auto object-contain"
            />
            <button
              onClick={() => setOpen(false)}
              className="text-white"
              aria-label="Cerrar menú"
            >
              <HiOutlineX size={32} />
            </button>
          </div>

          {/* Menu */}
          <nav className="flex-1 flex flex-col items-center justify-center gap-8 text-lg font-semibold">
            <br />
            {sections.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => handleScrollToSection(e, id)}
                className={`
                  transition-all duration-200
                  ${activeSection === id
                    ? "text-secondary scale-105"
                    : "text-white hover:text-secondary"
                  }
                `}
              >
                {id.toUpperCase()}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;