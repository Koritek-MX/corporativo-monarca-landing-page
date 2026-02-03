import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import {
  HiOutlineEye,
  HiOutlineEyeOff,
} from "react-icons/hi";

import logo from "../../assets/images/monarca-gold.webp";
import loginBg from "../../assets/images/hero.webp";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isFormValid =
    form.name.trim() !== "" &&
    form.email.trim() !== "" &&
    form.password.trim() !== "" &&
    form.confirmPassword.trim() !== "" &&
    form.password === form.confirmPassword;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    console.log("Register form submitted", form);
    // aquí va la lógica real de registro
  };

  const handleGoogleRegister = () => {
    // registro con Google
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

          <h1 className="text-2xl font-bold text-primary mb-2 text-center">
            Crear cuenta
          </h1>

          <p className="text-gray-600 mb-8 text-center">
            Regístrate para acceder al panel
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                name="name"
                placeholder="Tu nombre"
                value={form.name}
                onChange={handleChange}
                className="
                  w-full border border-gray-300 rounded-lg
                  px-4 py-3
                  focus:outline-none focus:ring-2 focus:ring-secondary
                "
                required
              />
            </div>

            {/* Email */}
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

            {/* Password */}
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
                className="absolute right-4 top-[38px] text-gray-400 hover:text-primary transition"
              >
                {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-primary mb-1">
                Confirmar contraseña
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                value={form.confirmPassword}
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
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-4 top-[38px] text-gray-400 hover:text-primary transition"
              >
                {showConfirmPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isFormValid}
              className={`
                w-full font-semibold py-4 rounded-xl transition
                ${
                  isFormValid
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-primary/50 text-white/70 cursor-not-allowed"
                }
              `}
            >
              Crear cuenta
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 uppercase">o</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleRegister}
            className="
              w-full flex items-center justify-center gap-3
              bg-white border border-gray-300
              rounded-xl py-3
              text-sm font-medium text-gray-700
              hover:bg-gray-50 transition
            "
          >
            <FcGoogle size={18} />
            Registrarse con Google
          </button>

          {/* Login */}
          <p className="text-sm text-gray-600 text-center mt-6">
            ¿Ya tienes cuenta?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-secondary font-semibold hover:underline"
            >
              Inicia sesión
            </button>
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

export default Register;