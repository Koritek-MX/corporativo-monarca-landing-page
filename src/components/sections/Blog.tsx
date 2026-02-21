import { useEffect, useState, useRef } from "react";
import { getAllBlogsService } from "../../services/blog.service";
import { useNavigate } from "react-router-dom";

const Blog = () => {
  
  const [blogs, setBlogs] = useState<any[]>([]);
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    loadBlogs();
  }, []);

  /* 👉 Animación scroll reveal */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  const loadBlogs = async () => {
    try {
      const [data] = await Promise.all([
        getAllBlogsService(3),
        new Promise((resolve) => setTimeout(resolve, 700)),
      ]);

      const sorted = data.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );

      setBlogs(sorted);

    } catch {
      console.log('Error al cargar los blogs');
    }
  };

  return (
    <section
      ref={sectionRef}
      id="blog"
      className="py-24 bg-gray-50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div
          className={`
            max-w-3xl mb-16 transition-all duration-700
            ${visible ? "fade-up opacity-100" : "opacity-0 translate-y-10"}
          `}
        >
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
              style={{ transitionDelay: `${index * 150}ms` }}
              className={`
                group bg-white border border-gray-100 rounded-2xl
                overflow-hidden shadow-sm hover:shadow-xl
                transition-all duration-500 flex flex-col
                ${visible ? "fade-up opacity-100" : "opacity-0 translate-y-12"}
              `}
            >
              {/* Imagen */}
              <div className="h-52 w-full overflow-hidden relative">
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="
                    w-full h-full object-cover
                    group-hover:scale-110
                    transition-transform duration-700
                  "
                />

                {/* Overlay elegante */}
                <div className="
                  absolute inset-0 bg-primary/0
                  group-hover:bg-primary/20
                  transition
                " />
              </div>

              {/* Contenido */}
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
                  <button
                    onClick={() => navigate(`/blog/${blog.id}`)}
                    className="
                      inline-flex items-center gap-2
                      text-sm font-medium
                      text-primary/70
                      hover:text-secondary
                      transition
                    "
                  >
                    Ver más →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Botón */}
        <div
          className={`
            text-center mt-14 transition-all duration-700
            ${visible ? "fade-up opacity-100" : "opacity-0 translate-y-10"}
          `}
        >
          <button
            onClick={() => navigate("/blog")}
            className="
              px-8 py-3
              bg-primary text-white
              rounded-xl font-semibold
              hover:bg-primary/90
              hover:scale-105
              transition
              shadow-md hover:shadow-lg
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