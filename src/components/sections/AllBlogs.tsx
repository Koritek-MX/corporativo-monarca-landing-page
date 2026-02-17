import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getAllBlogsService } from "../../services/blog.service";
import { useNavigate } from "react-router-dom";

const AllBlogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      Swal.fire({
        title: "Cargando blogs...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const [data] = await Promise.all([
        getAllBlogsService(), // 👉 sin límite
        new Promise((resolve) => setTimeout(resolve, 700)),
      ]);

      setBlogs(data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los blogs", "error");
    } finally {
      Swal.close();
    }
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-start justify-between mb-16">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Blog jurídico
            </h2>
            <p className="text-gray-600">
              Artículos legales, consejos y novedades para mantenerte informado.
            </p>
          </div>

          {/* Botón regresar */}
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-gray-600 hover:text-primary transition"
          >
            ← Regresar
          </button>
        </div>

        {/* Empty state */}
        {blogs.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            No hay blogs disponibles
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <article
                key={blog.id}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col"
              >
                {/* Imagen */}
                <div className="h-52 overflow-hidden">
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>

                {/* Contenido */}
                <div className="p-8 flex flex-col flex-1">

                  <div className="flex justify-between mb-3 text-xs uppercase tracking-wider">
                    <span className="text-secondary font-medium">
                      {blog.area}
                    </span>

                    <span className="text-gray-400">
                      {new Date(blog.createdAt)
                        .toLocaleDateString("es-MX")}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-primary mb-3">
                    {blog.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-6 flex-1">
                    {blog.subtitle}
                  </p>

                  <div className="mt-6 text-right">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-primary/70 group-hover:text-secondary transition">
                      Ver más →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AllBlogs;