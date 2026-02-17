import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getAllBlogsService } from "../../services/blog.service";
import { useNavigate } from "react-router-dom";

const Blog = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const [data] = await Promise.all([
        getAllBlogsService(3),
        new Promise((resolve) => setTimeout(resolve, 700)),
      ]);

      // 👉 Ordena por fecha (últimos primero)
      const sorted = data.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );

      setBlogs(sorted);

    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los blogs", "error");
    } finally {
      Swal.close();
    }
  };

  return (
    <section id="blog" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="inline-flex items-center mb-4 px-4 py-2 rounded-full bg-primary/5 text-secondary text-xs tracking-widest uppercase">
            Blog
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Artículos y asesoría legal
          </h2>

          <p className="text-gray-600">
            Mantente informado con análisis legales, consejos prácticos y
            novedades del ámbito jurídico.
          </p>
        </div>

        {/* Blogs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.slice(0, 3).map((blog, index) => (
            <article
              key={index}
              className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col"
            >
              <div className="h-52 w-full overflow-hidden">
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3 text-xs uppercase tracking-wider">
                  <span className="text-secondary font-medium">
                    {blog.area}
                  </span>
                  <span className="text-gray-400">
                    {new Date(blog.createdAt).toLocaleDateString("es-MX")}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-primary mb-3 leading-snug">
                  {blog.title}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1">
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

        {/* 👉 BOTÓN VER MÁS */}

        <div className="text-center mt-14">
          <button
            onClick={() => navigate("/blog")}
            className="
                px-8 py-3
                bg-primary text-white
                rounded-xl font-semibold
                hover:bg-primary/90
                transition
              "
          >
            Ver más artículos
          </button>
        </div>


      </div>
    </section>
  );
};

export default Blog;