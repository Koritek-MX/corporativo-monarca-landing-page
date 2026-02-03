import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/monarca-gold.webp";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="max-w-xl text-center">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src={logo}
            alt="Corporativo Monarca"
            className="h-24"
          />
        </div>

        {/* 404 */}
        <h1 className="text-7xl md:text-8xl font-extrabold text-primary mb-4">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
          Página no encontrada
        </h2>

        <p className="text-gray-600 mb-10">
          Lo sentimos, la página que estás buscando no existe o fue movida.
          Verifica la URL o regresa al inicio.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="
              bg-primary text-white font-semibold
              px-8 py-4 rounded-xl
              hover:bg-primary/90 transition
            "
          >
            Volver al inicio
          </button>

          <button
            onClick={() => navigate(-1)}
            className="
              border border-primary text-primary font-semibold
              px-8 py-4 rounded-xl
              hover:bg-primary/5 transition
            "
          >
            Regresar
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-12">
          © {new Date().getFullYear()} Corporativo Monarca
        </p>
      </div>
    </div>
  );
};

export default NotFound;