import logo from "../../assets/images/monarca-gold.webp";
import loginBg from "../../assets/images/hero.webp";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";




const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // aquí va la lógica de login usuario
  };

  const handleGoogleLogin = () => {
    // aquí va login con Google
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
            Iniciar sesión
          </h1>

          <p className="text-gray-600 mb-8 text-center">
            Accede al panel de control
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="usuario@correo.com"
                className="
                  w-full border border-gray-300 rounded-lg
                  px-4 py-3
                  focus:outline-none focus:ring-2 focus:ring-secondary
                "
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="
                  w-full border border-gray-300 rounded-lg
                  px-4 py-3
                  focus:outline-none focus:ring-2 focus:ring-secondary
                "
                required
              />
            </div>

            {/* Entrar */}
            <button
              type="submit"
              className="
                w-full bg-primary text-white font-semibold
                py-4 rounded-xl
                hover:bg-primary/90 transition
              "
            >
              Entrar
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 uppercase">o</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="
              w-full flex items-center justify-center gap-3
              bg-white border border-gray-300
              rounded-xl py-3
              text-sm font-medium text-gray-700
              hover:bg-gray-50 transition
            "
          >
            <FcGoogle size={18} />
            Continuar con Google
          </button>

          {/* Register */}
          <p className="text-sm text-gray-600 text-center mt-6">
            ¿No tienes cuenta?{" "}
            <a
              href="/register"
              className="text-secondary font-semibold hover:underline"
            >
              Regístrate
            </a>
          </p>

          {/* Footer */}
          <p className="text-xs text-gray-400 text-center mt-8">
            © {new Date().getFullYear()} Corporativo Monarca
          </p>

        </div>
      </div>
      {/* Botón Admin - esquina inferior derecha */}
      <div className="fixed bottom-6 right-6 z-20">
        <button
          onClick={() => navigate("/login/admin")}
          className="
            text-xs font-semibold
            text-primary
            bg-white/90 backdrop-blur
            px-4 py-2 rounded-full
            shadow-md
            hover:text-secondary
            hover:shadow-lg
            transition
          "
        >
          Iniciar sesión como administrador
        </button>
      </div>
    </div>
  );
};

export default Login;