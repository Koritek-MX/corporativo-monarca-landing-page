import { useEffect, useState } from "react";
import logo from "../../assets/images/monarca-gold.webp";
import loginBg from "../../assets/images/hero.webp";
import { useNavigate } from "react-router-dom";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import Swal from 'sweetalert2'
import { loginService } from "../../services/auth.service";

const Login = () => {

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "braulio@monarca.com",
    password: "123456",
  });

  useEffect(() => {
    Swal.fire({
      title: "Cargando...",
      allowOutsideClick: false,
      timer: 1000,
      didOpen: () => Swal.showLoading(),
    });
  }, []);


  const isFormValid = form.email.trim() !== "" && form.password.trim() !== "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      await loginService(form.email, form.password);

      await Swal.fire({
        title: "Iniciando sesión...",
        timer: 1200,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
      });

      navigate("/dashboard");

    } catch (error: any) {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Credenciales incorrectas",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen flex relative">

      {/* Left - Image */}
      <div
        className="hidden lg:flex w-1/2 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${loginBg})` }}
      >
        <div className="absolute inset-0 bg-primary/80" />

        {/* Logo centrado */}
        <div className="relative z-10 flex items-center justify-center w-full">
          <img
            src={logo}
            alt="Corporativo Monarca"
            className="h-100"
          />
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6">
        <div className="w-full max-w-md">

          {/* Logo mobile */}
          <div className="lg:hidden flex justify-center mb-10">
            <img
              src={logo}
              alt="Corporativo Monarca"
              className="h-75"
            />
          </div>

          <h1 className="text-4xl font-bold text-primary mb-2 text-center mb-16">
            Iniciar sesión
          </h1>


          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                placeholder="usuario@correo.com"
                value={form.email}
                onChange={handleChange}
                className="
                  w-full border border-gray-300 rounded-lg
                  px-4 py-3
                  focus:outline-none focus:ring-2 focus:ring-secondary
                "
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-primary mb-1">
                Contraseña
              </label>

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="
                  w-full border border-gray-300 rounded-lg
                  px-4 py-3 pr-12
                  focus:outline-none focus:ring-2 focus:ring-secondary
                "
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="
                  absolute right-4 top-9.5
                  text-gray-400 hover:text-primary
                  transition
                "
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <HiOutlineEyeOff size={20} />
                ) : (
                  <HiOutlineEye size={20} />
                )}
              </button>
            </div>

            {/* Entrar */}
            <button
              type="submit"
              disabled={!isFormValid}
              className={`
                w-full font-semibold py-4 rounded-xl transition
                ${isFormValid
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-primary/50 text-white/70 cursor-not-allowed"
                }
              `}
            >
              Entrar
            </button>
          </form>


          {/* Forgot password */}
          <p className="text-sm text-gray-600 text-center mt-6">
            ¿Olvidaste tu contraseña?{" "}
            <a
              className="text-secondary font-semibold hover:underline"
            >
              Recuperala aqui
            </a>
          </p>

          {/* Footer */}
          <p className="text-xs text-gray-400 text-center mt-8">
            © {new Date().getFullYear()} Corporativo Monarca
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;