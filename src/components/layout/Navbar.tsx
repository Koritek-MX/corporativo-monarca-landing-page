import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineMenu, HiOutlineX, HiOutlinePhone } from "react-icons/hi";
import { FaUser } from "react-icons/fa";
import logo from "../../assets/images/monarca-gold.webp";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const sections = [
  "inicio",
  "servicios",
  "experiencia",
  "casos",
  "nosotros",
  "blog",
  "contacto",
];

const Navbar = ({ open, setOpen }: Props) => {
  const navigate = useNavigate();

  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("inicio");
  const [isNavigating, setIsNavigating] = useState(false);

  /* 👉 Scroll a sección */
  const handleScrollToSection = (
    e: React.MouseEvent,
    sectionId: string
  ) => {
    e.preventDefault();

    const target = document.getElementById(sectionId);
    if (!target) return;

    setShow(true);
    setIsNavigating(true);

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setOpen(false);

    setTimeout(() => {
      setIsNavigating(false);
      setLastScrollY(window.scrollY);
    }, 700);
  };

  /* 👉 Login */
  const openLogin = () => {
    setShow(true);
    setIsNavigating(true);

    setOpen(false);
    navigate("/login");

    setTimeout(() => {
      setIsNavigating(false);
      setLastScrollY(window.scrollY);
    }, 300);
  };

  /* 👉 Show / Hide navbar */
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

  /* 👉 Lock scroll body */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  /* 👉 Scroll spy */
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
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <header
        className={`
          fixed top-0 left-0 w-full z-50
          bg-primary transition-transform duration-300
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
              <nav className="hidden md:flex gap-10 font-semibold">
                {sections.map((id) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={(e) => handleScrollToSection(e, id)}
                    className={
                      activeSection === id
                        ? "text-secondary"
                        : "text-white hover:text-secondary"
                    }
                  >
                    {id.toUpperCase()}
                  </a>
                ))}
              </nav>

              {/* Desktop Right */}
              <div className="hidden md:flex items-center gap-6 text-white">
                <FaUser
                  size={25}
                  onClick={openLogin}
                  className="cursor-pointer hover:text-secondary transition"
                />

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
                  className="text-white mr-3"
                  onClick={openLogin}
                >
                  <FaUser size={30} />
                </button>

                <button
                  className="text-white"
                  onClick={() => setOpen(true)}
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
          fixed inset-0 z-50 transition-all duration-300
          ${open ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setOpen(false)}
        />

        <div
          className={`
            absolute top-0 right-0 h-full w-full max-w-sm
            bg-primary transform transition-transform duration-300
            ${open ? "translate-x-0" : "translate-x-full"}
          `}
        >
          <div className="flex items-center justify-between px-6 h-24 border-b border-white/20">
            <img
              src={logo}
              alt="Corporativo Monarca"
              className="h-30 w-auto"
            />

            <button onClick={() => setOpen(false)}>
              <HiOutlineX className="text-white" size={32} />
            </button>
          </div>

          <nav className="flex flex-col items-center justify-center gap-8 mt-10 text-lg font-semibold">
            {sections.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => handleScrollToSection(e, id)}
                className={
                  activeSection === id
                    ? "text-secondary"
                    : "text-white hover:text-secondary"
                }
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